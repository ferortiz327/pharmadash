import { PrismaClient } from '@prisma/client';
import { CreateSaleDto } from '../dto/sale/create-sale.dto';

export class SaleService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSale(cashierId: string, dto: CreateSaleDto) {
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    const items: any[] = [];

    for (const itemDto of dto.items) {
      const medicine = await this.prisma.medicine.findUnique({
        where: { id: itemDto.medicineId }
      });

      if (!medicine) {
        throw new Error('Medicine not found');
      }

      if (medicine.stock < itemDto.quantity) {
        throw new Error('Insufficient stock');
      }

      const taxRate = this.getTaxRate(medicine.category);
      const itemSubtotal = medicine.price * itemDto.quantity;
      const itemTax = itemSubtotal * taxRate;
      const itemTotal = itemSubtotal + itemTax;

      await this.prisma.medicine.update({
        where: { id: medicine.id },
        data: { stock: medicine.stock - itemDto.quantity }
      });

      items.push({
        medicineId: medicine.id,
        quantity: itemDto.quantity,
        unitPrice: medicine.price,
        subtotal: itemSubtotal,
        tax: itemTax,
        total: itemTotal
      });

      subtotal += itemSubtotal;
      tax += itemTax;
      total += itemTotal;
    }

    const sale = await this.prisma.sale.create({
      data: {
        cashierId: cashierId,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'COMPLETED',
        items: {
          create: items
        }
      },
      include: {
        cashier: true,
        items: {
          include: {
            medicine: true
          }
        }
      }
    });

    return this.formatSaleResponse(sale);
  }

  async getSaleById(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        cashier: true,
        items: {
          include: {
            medicine: true
          }
        }
      }
    });

    if (!sale) return null;
    return this.formatSaleResponse(sale);
  }

  async getDailySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'COMPLETED'
      },
      include: {
        cashier: true,
        items: {
          include: {
            medicine: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sales.map((sale: any) => this.formatSaleResponse(sale));
  }

  async getTopProducts(limit: number = 5) {
    // Obtener los productos m?s vendidos
    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['medicineId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    // Obtener los nombres de los medicamentos
    const medicineIds = topProducts.map((p: any) => p.medicineId);
    const medicines = await this.prisma.medicine.findMany({
      where: {
        id: { in: medicineIds }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true
      }
    });

    return topProducts.map((p: any) => {
      const medicine = medicines.find((m: any) => m.id === p.medicineId);
      return {
        medicineId: p.medicineId,
        name: medicine?.name || 'Unknown',
        sku: medicine?.sku || 'Unknown',
        price: medicine?.price || 0,
        stock: medicine?.stock || 0,
        totalSold: p._sum.quantity || 0
      };
    });
  }

  private getTaxRate(category: string): number {
    const rates: Record<string, number> = {
      'GENERIC': 0,
      'ANTIBIOTIC': 0.05,
      'COLD_CHAIN': 0.10
    };
    return rates[category] || 0;
  }

  private formatSaleResponse(sale: any) {
    return {
      id: sale.id,
      cashierId: sale.cashierId,
      cashierName: sale.cashier ? sale.cashier.firstName + ' ' + sale.cashier.lastName : 'Unknown',
      items: sale.items.map((item: any) => ({
        id: item.id,
        medicineId: item.medicineId,
        medicineName: item.medicine ? item.medicine.name : 'Unknown',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        tax: item.tax,
        total: item.total
      })),
      subtotal: sale.subtotal,
      tax: sale.tax,
      total: sale.total,
      status: sale.status,
      createdAt: sale.createdAt
    };
  }
}
