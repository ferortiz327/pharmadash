import { PrismaClient } from '@prisma/client';
import { Medicine } from '../../domain/entities/medicine.entity';
import { Category } from '../../domain/entities/category.enum';
import { 
  IMedicineRepository, 
  FindMedicinesOptions, 
  PaginatedResult,
  CreateMedicineData
} from '../../domain/interfaces/medicine-repository.interface';

export class MedicineRepository implements IMedicineRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateMedicineData): Promise<Medicine> {
    const created = await this.prisma.medicine.create({
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        expirationDate: data.expirationDate,
        imageUrl: data.imageUrl || null
      }
    });

    return new Medicine({
      id: created.id,
      sku: created.sku,
      name: created.name,
      category: created.category as Category,
      price: created.price,
      stock: created.stock,
      expirationDate: created.expirationDate,
      imageUrl: created.imageUrl || undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    });
  }

  async findById(id: string): Promise<Medicine | null> {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id }
    });
    if (!medicine) return null;
    return new Medicine({
      id: medicine.id,
      sku: medicine.sku,
      name: medicine.name,
      category: medicine.category as Category,
      price: medicine.price,
      stock: medicine.stock,
      expirationDate: medicine.expirationDate,
      imageUrl: medicine.imageUrl || undefined,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt
    });
  }

  async findBySku(sku: string): Promise<Medicine | null> {
    const medicine = await this.prisma.medicine.findUnique({
      where: { sku }
    });
    if (!medicine) return null;
    return new Medicine({
      id: medicine.id,
      sku: medicine.sku,
      name: medicine.name,
      category: medicine.category as Category,
      price: medicine.price,
      stock: medicine.stock,
      expirationDate: medicine.expirationDate,
      imageUrl: medicine.imageUrl || undefined,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt
    });
  }

  async findAll(options: FindMedicinesOptions): Promise<PaginatedResult<Medicine>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } }
      ];
    }
    if (options.category) {
      where.category = options.category;
    }
    if (options.minPrice !== undefined) {
      where.price = { ...where.price, gte: options.minPrice };
    }
    if (options.maxPrice !== undefined) {
      where.price = { ...where.price, lte: options.maxPrice };
    }

    const [medicines, total] = await Promise.all([
      this.prisma.medicine.findMany({ 
        where, 
        skip, 
        take: limit, 
        orderBy: { createdAt: 'desc' } 
      }),
      this.prisma.medicine.count({ where })
    ]);

    const data = medicines.map(m => new Medicine({
      id: m.id,
      sku: m.sku,
      name: m.name,
      category: m.category as Category,
      price: m.price,
      stock: m.stock,
      expirationDate: m.expirationDate,
      imageUrl: m.imageUrl || undefined,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
  }

  async update(id: string, data: Partial<CreateMedicineData>): Promise<Medicine | null> {
    const updateData: any = {};
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.expirationDate !== undefined) updateData.expirationDate = data.expirationDate;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    const updated = await this.prisma.medicine.update({
      where: { id },
      data: updateData
    });
    if (!updated) return null;
    return new Medicine({
      id: updated.id,
      sku: updated.sku,
      name: updated.name,
      category: updated.category as Category,
      price: updated.price,
      stock: updated.stock,
      expirationDate: updated.expirationDate,
      imageUrl: updated.imageUrl || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.medicine.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async getCriticalStock(): Promise<Medicine[]> {
    const medicines = await this.prisma.medicine.findMany();
    return medicines
      .map(m => new Medicine({
        id: m.id,
        sku: m.sku,
        name: m.name,
        category: m.category as Category,
        price: m.price,
        stock: m.stock,
        expirationDate: m.expirationDate,
        imageUrl: m.imageUrl || undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      }))
      .filter(m => m.isCriticalStock());
  }

  async getExpiringSoon(): Promise<Medicine[]> {
    const medicines = await this.prisma.medicine.findMany();
    return medicines
      .map(m => new Medicine({
        id: m.id,
        sku: m.sku,
        name: m.name,
        category: m.category as Category,
        price: m.price,
        stock: m.stock,
        expirationDate: m.expirationDate,
        imageUrl: m.imageUrl || undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      }))
      .filter(m => m.isExpiringSoon());
  }

  async updateStock(id: string, quantity: number): Promise<Medicine | null> {
    const updated = await this.prisma.medicine.update({
      where: { id },
      data: { stock: quantity }
    });
    if (!updated) return null;
    return new Medicine({
      id: updated.id,
      sku: updated.sku,
      name: updated.name,
      category: updated.category as Category,
      price: updated.price,
      stock: updated.stock,
      expirationDate: updated.expirationDate,
      imageUrl: updated.imageUrl || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  }
}
