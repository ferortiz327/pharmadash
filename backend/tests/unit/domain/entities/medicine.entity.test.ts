import { Medicine } from '../../../../src/domain/entities/medicine.entity';
import { Category } from '../../../../src/domain/entities/category.enum';

describe('Medicine Entity', () => {
  const mockMedicineData = {
    id: '123',
    sku: 'GEN001',
    name: 'Paracetamol 500mg',
    category: Category.GENERIC,
    price: 10.99,
    stock: 50,
    expirationDate: new Date('2027-12-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  describe('isCriticalStock', () => {
    it('should return true when stock is below threshold', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 5 });
      expect(medicine.isCriticalStock()).toBe(true);
    });

    it('should return false when stock is above threshold', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 15 });
      expect(medicine.isCriticalStock()).toBe(false);
    });
  });

  describe('getTaxRate', () => {
    it('should return 0 for GENERIC medicines', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC });
      expect(medicine.getTaxRate()).toBe(0);
    });

    it('should return 0.05 for ANTIBIOTIC medicines', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC });
      expect(medicine.getTaxRate()).toBe(0.05);
    });

    it('should return 0.10 for COLD_CHAIN medicines', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN });
      expect(medicine.getTaxRate()).toBe(0.10);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with taxes correctly', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, price: 100 });
      const total = medicine.calculateTotal(2);
      expect(total).toBe(210);
    });
  });
});
