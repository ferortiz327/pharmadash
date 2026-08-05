import { User } from './user.entity';
import { SaleItem } from './sale-item.entity';

export enum SaleStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING'
}

export interface ISale {
  id: string;
  cashierId: string;
  cashier?: User;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: SaleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Sale {
  public readonly id: string;
  public readonly cashierId: string;
  public readonly cashier?: User;
  private _items: SaleItem[];
  private _subtotal: number;
  private _tax: number;
  private _total: number;
  public readonly status: SaleStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ISale) {
    this.id = props.id;
    this.cashierId = props.cashierId;
    this.cashier = props.cashier;
    this._items = props.items || [];
    this._subtotal = props.subtotal;
    this._tax = props.tax;
    this._total = props.total;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get items(): SaleItem[] {
    return this._items;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get tax(): number {
    return this._tax;
  }

  get total(): number {
    return this._total;
  }

  addItem(item: SaleItem): void {
    this._items.push(item);
    this._subtotal += item.subtotal;
    this._tax += item.tax;
    this._total += item.total;
  }

  isCompleted(): boolean {
    return this.status === SaleStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === SaleStatus.CANCELLED;
  }
}
