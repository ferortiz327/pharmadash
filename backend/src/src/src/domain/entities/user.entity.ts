import { UserRole } from './user-role.enum';

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IUser) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.role = props.role;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isCashier(): boolean {
    return this.role === UserRole.CASHIER;
  }

  isPharmacist(): boolean {
    return this.role === UserRole.PHARMACIST;
  }

  canManageInventory(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canManageSales(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.CASHIER;
  }

  canViewDashboard(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
