import { Category } from '../../../domain/entities/category.enum';

export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
}
