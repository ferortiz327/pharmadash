export class CreateSaleItemDto {
  medicineId!: string;
  quantity!: number;
}

export class CreateSaleDto {
  items!: CreateSaleItemDto[];
}
