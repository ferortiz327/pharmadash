import { Medicine } from './medicine.entity';
import { Sale } from './sale.entity';

export interface ISaleItem {
  id: string;
  saleId: string;
  sale?: Sale;
  medicineId: string;
  medicine?: Medicine;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}

export class SaleItem {
  public readonly id: string;
  public readonly saleId: string;
  public readonly sale?: Sale;
  public readonly medicineId: string;
  public readonly medicine?: Medicine;
  public readonly quantity: number;
  public readonly unitPrice: number;
  public readonly subtotal: number;
  public readonly tax: number;
  public readonly total: number;
  public readonly createdAt: Date;

  constructor(props: ISaleItem) {
    this.id = props.id;
    this.saleId = props.saleId;
    this.sale = props.sale;
    this.medicineId = props.medicineId;
    this.medicine = props.medicine;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.subtotal = props.subtotal;
    this.tax = props.tax;
    this.total = props.total;
    this.createdAt = props.createdAt;
  }
}
