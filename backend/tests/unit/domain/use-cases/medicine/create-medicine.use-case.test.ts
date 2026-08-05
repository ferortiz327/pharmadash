import { CreateMedicineUseCase } from '../../../../../src/domain/use-cases/medicine/create-medicine.use-case';
import { Category } from '../../../../../src/domain/entities/category.enum';

describe('CreateMedicineUseCase', () => {
  let useCase: CreateMedicineUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findBySku: jest.fn(),
      create: jest.fn()
    };
    useCase = new CreateMedicineUseCase(mockRepository);
  });

  const validDto = {
    sku: 'GEN001',
    name: 'Paracetamol 500mg',
    category: Category.GENERIC,
    price: 10.99,
    stock: 50,
    expirationDate: new Date('2027-12-31')
  };

  it('should create a medicine successfully', async () => {
    mockRepository.findBySku.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: '123', ...validDto });

    const result = await useCase.execute(validDto);
    
    expect(result).toBeDefined();
    expect(result.id).toBe('123');
  });

  it('should throw error if SKU already exists', async () => {
    mockRepository.findBySku.mockResolvedValue({ id: '456' });

    await expect(useCase.execute(validDto)).rejects.toThrow('SKU already exists');
  });

  it('should throw error if price is negative', async () => {
    const invalidDto = { ...validDto, price: -10 };
    mockRepository.findBySku.mockResolvedValue(null);

    await expect(useCase.execute(invalidDto)).rejects.toThrow('Price cannot be negative');
  });
});
