export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  PHARMACIST = 'PHARMACIST'
}

export const USER_ROLE_LABELS = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.CASHIER]: 'Cajero',
  [UserRole.PHARMACIST]: 'Farmac?utico'
} as const;

export const USER_ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageInventory: true,
    canManageSales: true,
    canViewDashboard: true,
    canManageUsers: true
  },
  [UserRole.CASHIER]: {
    canManageInventory: false,
    canManageSales: true,
    canViewDashboard: false,
    canManageUsers: false
  },
  [UserRole.PHARMACIST]: {
    canManageInventory: false,
    canManageSales: true,
    canViewDashboard: false,
    canManageUsers: false
  }
} as const;
