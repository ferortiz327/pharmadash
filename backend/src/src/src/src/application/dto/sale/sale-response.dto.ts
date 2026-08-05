import { SaleStatus } from '../../../domain/entities/sale.entity';

export class SaleItemResponseDto {
  id!: string;
  medicineId!: string;
  medicineName!: string;
  quantity!: number;
  unitPrice!: number;
  subtotal!: number;
  tax!: number;
  total!: number;
}

export class SaleResponseDto {
  id!: string;
  cashierId!: string;
  cashierName!: string;
  items!: SaleItemResponseDto[];
  subtotal!: number;
  tax!: number;
  total!: number;
  status!: SaleStatus;
  createdAt!: Date;
}
