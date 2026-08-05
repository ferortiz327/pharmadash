export enum Category {
  GENERIC = 'GENERIC',
  ANTIBIOTIC = 'ANTIBIOTIC',
  COLD_CHAIN = 'COLD_CHAIN'
}

export const CATEGORY_THRESHOLDS = {
  [Category.GENERIC]: {
    criticalStock: 10,
    expiringDays: 30,
    taxRate: 0
  },
  [Category.ANTIBIOTIC]: {
    criticalStock: 5,
    expiringDays: 15,
    taxRate: 0.05
  },
  [Category.COLD_CHAIN]: {
    criticalStock: 20,
    expiringDays: 20,
    taxRate: 0.10
  }
} as const;

export const CATEGORY_LABELS = {
  [Category.GENERIC]: 'Genéricos',
  [Category.ANTIBIOTIC]: 'Antibióticos',
  [Category.COLD_CHAIN]: 'Cadena de Frío'
} as const;
