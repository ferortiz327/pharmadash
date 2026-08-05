import { PrismaClient } from '@prisma/client';

export class GetDashboardMetricsUseCase {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async execute() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Ingresos del d?a
    const dailyRevenue = await this.prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'COMPLETED'
      },
      _sum: {
        total: true
      }
    });

    // 2. Total de ventas del d?a
    const totalSales = await this.prisma.sale.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'COMPLETED'
      }
    });

    // 3. Obtener todos los medicamentos
    const medicines = await this.prisma.medicine.findMany();

    // 4. Stock cr?tico
    const criticalStock = medicines.filter((m: any) => {
      const thresholds: Record<string, number> = {
        'GENERIC': 10,
        'ANTIBIOTIC': 5,
        'COLD_CHAIN': 20
      };
      return m.stock < (thresholds[m.category] || 10);
    });

    // 5. Stock bajo
    const lowStock = medicines.filter((m: any) => {
      const thresholds: Record<string, number> = {
        'GENERIC': 10,
        'ANTIBIOTIC': 5,
        'COLD_CHAIN': 20
      };
      const threshold = thresholds[m.category] || 10;
      return m.stock >= threshold && m.stock < threshold * 2;
    });

    // 6. Pr?ximos a vencer
    const expiringSoon = medicines.filter((m: any) => {
      const daysUntilExpiration = Math.ceil(
        (m.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const thresholds: Record<string, number> = {
        'GENERIC': 30,
        'ANTIBIOTIC': 15,
        'COLD_CHAIN': 20
      };
      return daysUntilExpiration <= (thresholds[m.category] || 30) && daysUntilExpiration > 0;
    });

    // 7. Medicamentos vencidos
    const expired = medicines.filter((m: any) => {
      return new Date() > m.expirationDate;
    });

    // 8. Ticket promedio
    const averageTicket = totalSales > 0 ? (dailyRevenue._sum.total || 0) / totalSales : 0;

    return {
      dailyRevenue: dailyRevenue._sum.total || 0,
      totalSales: totalSales,
      averageTicket: averageTicket,
      criticalStock: criticalStock.length,
      lowStock: lowStock.length,
      expiringSoon: expiringSoon.length,
      expired: expired.length,
      totalMedicines: medicines.length
    };
  }
}

export default GetDashboardMetricsUseCase;
