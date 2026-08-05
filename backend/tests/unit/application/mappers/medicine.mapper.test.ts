import { MedicineMapper } from '../../../../src/application/mappers/medicine.mapper';
import { Medicine } from '../../../../src/domain/entities/medicine.entity';
import { Category } from '../../../../src/domain/entities/category.enum';

describe('MedicineMapper', () => {
  const mockMedicine = new Medicine({
    id: '123',
    sku: 'GEN001',
    name: 'Paracetamol',
    category: Category.GENERIC,
    price: 10.99,
    stock: 50,
    expirationDate: new Date('2027-12-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  describe('toResponse', () => {
    it('deber?a mapear Medicine a MedicineResponseDto', () => {
      const response = MedicineMapper.toResponse(mockMedicine);
      
      expect(response).toBeDefined();
      expect(response.id).toBe('123');
      expect(response.sku).toBe('GEN001');
      expect(response.name).toBe('Paracetamol');
      expect(response.category).toBe(Category.GENERIC);
      expect(response.price).toBe(10.99);
      expect(response.stock).toBe(50);
    });
  });

  describe('toResponseList', () => {
    it('deber?a mapear una lista de Medicines', () => {
      const medicines = [mockMedicine, mockMedicine];
      const responses = MedicineMapper.toResponseList(medicines);
      
      expect(responses).toHaveLength(2);
    });
  });
});
