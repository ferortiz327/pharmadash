import { Category, CATEGORY_THRESHOLDS, CATEGORY_LABELS } from '../../../../src/domain/entities/category.enum';

describe('Category Enum', () => {
  it('deberia tener los valores correctos', () => {
    expect(Category.GENERIC).toBe('GENERIC');
    expect(Category.ANTIBIOTIC).toBe('ANTIBIOTIC');
    expect(Category.COLD_CHAIN).toBe('COLD_CHAIN');
  });

  describe('CATEGORY_THRESHOLDS', () => {
    it('deberia tener los umbrales correctos para GENERIC', () => {
      expect(CATEGORY_THRESHOLDS[Category.GENERIC]).toEqual({
        criticalStock: 10,
        expiringDays: 30,
        taxRate: 0
      });
    });

    it('deberia tener los umbrales correctos para ANTIBIOTIC', () => {
      expect(CATEGORY_THRESHOLDS[Category.ANTIBIOTIC]).toEqual({
        criticalStock: 5,
        expiringDays: 15,
        taxRate: 0.05
      });
    });

    it('deberia tener los umbrales correctos para COLD_CHAIN', () => {
      expect(CATEGORY_THRESHOLDS[Category.COLD_CHAIN]).toEqual({
        criticalStock: 20,
        expiringDays: 20,
        taxRate: 0.10
      });
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('deberia tener las etiquetas correctas', () => {
      expect(CATEGORY_LABELS[Category.GENERIC]).toBe('Genéricos');
      expect(CATEGORY_LABELS[Category.ANTIBIOTIC]).toBe('Antibióticos');
      expect(CATEGORY_LABELS[Category.COLD_CHAIN]).toBe('Cadena de Frío');
    });
  });
});
