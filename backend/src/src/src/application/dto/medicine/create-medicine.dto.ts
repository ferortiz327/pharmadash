import { Category } from '../../../domain/entities/category.enum';

export class CreateMedicineDto {
  sku!: string;
  name!: string;
  category!: Category;
  price!: number;
  stock!: number;
  expirationDate!: Date;
  imageUrl?: string;
}
