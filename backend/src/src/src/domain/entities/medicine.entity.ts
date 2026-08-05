import { Category, CATEGORY_THRESHOLDS } from './category.enum';

export interface IMedicine {
  id: string;
  sku: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  expirationDate: Date;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Medicine {
  public readonly id: string;
  public readonly sku: string;
  public readonly name: string;
  public readonly category: Category;
  private _price: number;
  private _stock: number;
  public readonly expirationDate: Date;
  public readonly imageUrl?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: IMedicine) {
    this.id = props.id;
    this.sku = props.sku;
    this.name = props.name;
    this.category = props.category;
    this._price = props.price;
    this._stock = props.stock;
    this.expirationDate = props.expirationDate;
    this.imageUrl = props.imageUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  isCriticalStock(): boolean {
    const threshold = CATEGORY_THRESHOLDS[this.category].criticalStock;
    return this._stock < threshold;
  }

  isExpiringSoon(): boolean {
    const today = new Date();
    const daysUntilExpiration = Math.ceil(
      (this.expirationDate.getTime() - today.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const threshold = CATEGORY_THRESHOLDS[this.category].expiringDays;
    return daysUntilExpiration <= threshold && daysUntilExpiration > 0;
  }

  isExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  getTaxRate(): number {
    return CATEGORY_THRESHOLDS[this.category].taxRate;
  }

  calculateTax(quantity: number): number {
    return this._price * quantity * this.getTaxRate();
  }

  calculateTotal(quantity: number): number {
    return this._price * quantity + this.calculateTax(quantity);
  }

  canSell(quantity: number): boolean {
    return this._stock >= quantity && !this.isExpired();
  }

  reduceStock(quantity: number): void {
    if (!this.canSell(quantity)) {
      throw new Error('Insufficient stock or product expired');
    }
    this._stock -= quantity;
  }

  addStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity must be positive');
    }
    this._stock += quantity;
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this._price = newPrice;
  }

  getCategoryLabel(): string {
    const labels = {
      GENERIC: 'Generic',
      ANTIBIOTIC: 'Antibiotic',
      COLD_CHAIN: 'Cold Chain'
    };
    return labels[this.category] || 'Unknown';
  }

  getStockStatus(): string {
    const threshold = CATEGORY_THRESHOLDS[this.category].criticalStock;
    if (this._stock < threshold) return 'CRITICAL';
    if (this._stock < threshold * 2) return 'LOW';
    return 'NORMAL';
  }
}
