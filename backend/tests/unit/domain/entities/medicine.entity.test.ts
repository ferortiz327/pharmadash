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
    it('deberia retornar true cuando el stock es menor al umbral para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, stock: 5 });
      expect(medicine.isCriticalStock()).toBe(true);
    });

    it('deberia retornar false cuando el stock es mayor al umbral para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, stock: 15 });
      expect(medicine.isCriticalStock()).toBe(false);
    });

    it('deberia retornar true cuando el stock es menor al umbral para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, stock: 3 });
      expect(medicine.isCriticalStock()).toBe(true);
    });

    it('deberia retornar false cuando el stock es mayor al umbral para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, stock: 10 });
      expect(medicine.isCriticalStock()).toBe(false);
    });

    it('deberia retornar true cuando el stock es menor al umbral para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, stock: 15 });
      expect(medicine.isCriticalStock()).toBe(true);
    });

    it('deberia retornar false cuando el stock es mayor al umbral para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, stock: 25 });
      expect(medicine.isCriticalStock()).toBe(false);
    });
  });

  describe('isExpiringSoon', () => {
    it('deberia retornar true cuando vence en menos de 30 dias para GENERIC', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(true);
    });

    it('deberia retornar false cuando vence en mas de 30 dias para GENERIC', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(false);
    });

    it('deberia retornar true cuando vence en menos de 15 dias para ANTIBIOTIC', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(true);
    });

    it('deberia retornar false cuando vence en mas de 15 dias para ANTIBIOTIC', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(false);
    });

    it('deberia retornar true cuando vence en menos de 20 dias para COLD_CHAIN', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(true);
    });

    it('deberia retornar false cuando vence en mas de 20 dias para COLD_CHAIN', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 40);
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, expirationDate: futureDate });
      expect(medicine.isExpiringSoon()).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('deberia retornar true cuando la fecha de vencimiento ya paso', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const medicine = new Medicine({ ...mockMedicineData, expirationDate: pastDate });
      expect(medicine.isExpired()).toBe(true);
    });

    it('deberia retornar false cuando la fecha de vencimiento es futura', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const medicine = new Medicine({ ...mockMedicineData, expirationDate: futureDate });
      expect(medicine.isExpired()).toBe(false);
    });
  });

  describe('getTaxRate', () => {
    it('deberia retornar 0 para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC });
      expect(medicine.getTaxRate()).toBe(0);
    });

    it('deberia retornar 0.05 para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC });
      expect(medicine.getTaxRate()).toBe(0.05);
    });

    it('deberia retornar 0.10 para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN });
      expect(medicine.getTaxRate()).toBe(0.10);
    });
  });

  describe('calculateTax', () => {
    it('deberia calcular correctamente el impuesto para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, price: 100 });
      const tax = medicine.calculateTax(2);
      expect(tax).toBe(0);
    });

    it('deberia calcular correctamente el impuesto para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, price: 100 });
      const tax = medicine.calculateTax(2);
      expect(tax).toBe(10);
    });

    it('deberia calcular correctamente el impuesto para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, price: 100 });
      const tax = medicine.calculateTax(2);
      expect(tax).toBe(20);
    });
  });

  describe('calculateTotal', () => {
    it('deberia calcular correctamente el total sin impuestos para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, price: 100 });
      const total = medicine.calculateTotal(2);
      expect(total).toBe(200);
    });

    it('deberia calcular correctamente el total con impuestos para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC, price: 100 });
      const total = medicine.calculateTotal(2);
      expect(total).toBe(210);
    });

    it('deberia calcular correctamente el total con impuestos para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN, price: 100 });
      const total = medicine.calculateTotal(2);
      expect(total).toBe(220);
    });
  });

  describe('canSell', () => {
    it('deberia retornar true cuando hay stock suficiente y no esta vencido', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 10 });
      expect(medicine.canSell(5)).toBe(true);
    });

    it('deberia retornar false cuando no hay stock suficiente', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 3 });
      expect(medicine.canSell(5)).toBe(false);
    });

    it('deberia retornar false cuando el producto esta vencido', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const medicine = new Medicine({ ...mockMedicineData, expirationDate: pastDate });
      expect(medicine.canSell(1)).toBe(false);
    });
  });

  describe('reduceStock', () => {
    it('deberia reducir el stock correctamente', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 10 });
      medicine.reduceStock(3);
      expect(medicine.stock).toBe(7);
    });

    it('deberia lanzar error si no hay stock suficiente', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 3 });
      expect(() => medicine.reduceStock(5)).toThrow('Insufficient stock or product expired');
    });
  });

  describe('addStock', () => {
    it('deberia aumentar el stock correctamente', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 10 });
      medicine.addStock(5);
      expect(medicine.stock).toBe(15);
    });

    it('deberia lanzar error si la cantidad es negativa', () => {
      const medicine = new Medicine({ ...mockMedicineData, stock: 10 });
      expect(() => medicine.addStock(-5)).toThrow('Quantity must be positive');
    });
  });

  describe('updatePrice', () => {
    it('deberia actualizar el precio correctamente', () => {
      const medicine = new Medicine({ ...mockMedicineData, price: 10.99 });
      medicine.updatePrice(15.99);
      expect(medicine.price).toBe(15.99);
    });

    it('deberia lanzar error si el precio es negativo', () => {
      const medicine = new Medicine({ ...mockMedicineData, price: 10.99 });
      expect(() => medicine.updatePrice(-5)).toThrow('Price cannot be negative');
    });
  });

  describe('getCategoryLabel', () => {
    it('deberia retornar la etiqueta correcta para GENERIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC });
      expect(medicine.getCategoryLabel()).toBe('Generic');
    });

    it('deberia retornar la etiqueta correcta para ANTIBIOTIC', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.ANTIBIOTIC });
      expect(medicine.getCategoryLabel()).toBe('Antibiotic');
    });

    it('deberia retornar la etiqueta correcta para COLD_CHAIN', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.COLD_CHAIN });
      expect(medicine.getCategoryLabel()).toBe('Cold Chain');
    });
  });

  describe('getStockStatus', () => {
    it('deberia retornar CRITICAL cuando el stock es critico', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, stock: 5 });
      expect(medicine.getStockStatus()).toBe('CRITICAL');
    });

    it('deberia retornar LOW cuando el stock es bajo', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, stock: 15 });
      expect(medicine.getStockStatus()).toBe('LOW');
    });

    it('deberia retornar NORMAL cuando el stock es normal', () => {
      const medicine = new Medicine({ ...mockMedicineData, category: Category.GENERIC, stock: 25 });
      expect(medicine.getStockStatus()).toBe('NORMAL');
    });
  });
});
