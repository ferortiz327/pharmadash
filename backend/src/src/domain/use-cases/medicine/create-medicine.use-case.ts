import { Medicine } from '../../entities/medicine.entity';
import { Category } from '../../entities/category.enum';
import { IMedicineRepository, CreateMedicineData } from '../../interfaces/medicine-repository.interface';

export interface CreateMedicineDTO {
  sku: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  expirationDate: Date;
  imageUrl?: string;
}

export class CreateMedicineUseCase {
  constructor(
    private readonly medicineRepository: IMedicineRepository
  ) {}

  async execute(dto: CreateMedicineDTO): Promise<Medicine> {
    // Validar SKU ?nico
    const existing = await this.medicineRepository.findBySku(dto.sku);
    if (existing) {
      throw new Error('SKU already exists');
    }

    // Validar precio
    if (dto.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validar stock
    if (dto.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    // Validar fecha de expiraci?n
    if (new Date(dto.expirationDate) <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }

    // Crear medicina usando la interfaz CreateMedicineData
    const medicineData: CreateMedicineData = {
      sku: dto.sku,
      name: dto.name,
      category: dto.category,
      price: dto.price,
      stock: dto.stock,
      expirationDate: dto.expirationDate,
      imageUrl: dto.imageUrl
    };

    const medicine = await this.medicineRepository.create(medicineData);
    return medicine;
  }
}
