import { Medicine } from '../entities/medicine.entity';
import { Category } from '../entities/category.enum';

export interface FindMedicinesOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  onlyCritical?: boolean;
  onlyExpiring?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Datos para crear un medicamento (sin m?todos)
export interface CreateMedicineData {
  sku: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  expirationDate: Date;
  imageUrl?: string | null;
}

export interface IMedicineRepository {
  create(data: CreateMedicineData): Promise<Medicine>;
  findById(id: string): Promise<Medicine | null>;
  findBySku(sku: string): Promise<Medicine | null>;
  findAll(options: FindMedicinesOptions): Promise<PaginatedResult<Medicine>>;
  update(id: string, data: Partial<CreateMedicineData>): Promise<Medicine | null>;
  delete(id: string): Promise<boolean>;
  getCriticalStock(): Promise<Medicine[]>;
  getExpiringSoon(): Promise<Medicine[]>;
  updateStock(id: string, quantity: number): Promise<Medicine | null>;
}
