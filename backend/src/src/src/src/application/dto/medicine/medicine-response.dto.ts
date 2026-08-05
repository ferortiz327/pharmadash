import { Category } from '../../../domain/entities/category.enum';

export class MedicineResponseDto {
  id!: string;
  sku!: string;
  name!: string;
  category!: Category;
  categoryLabel!: string;
  price!: number;
  stock!: number;
  expirationDate!: Date;
  imageUrl?: string;
  isCriticalStock!: boolean;
  isExpiringSoon!: boolean;
  isExpired!: boolean;
  stockStatus!: string;
  taxRate!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
