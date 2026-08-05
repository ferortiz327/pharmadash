import { Medicine } from '../../domain/entities/medicine.entity';
import { Category } from '../../domain/entities/category.enum';
import { IMedicineRepository } from '../../domain/interfaces/medicine-repository.interface';
import { CreateMedicineUseCase } from '../../domain/use-cases/medicine/create-medicine.use-case';
import { GetMedicinesUseCase } from '../../domain/use-cases/medicine/get-medicines.use-case';
import { CreateMedicineDto } from '../dto/medicine/create-medicine.dto';
import { MedicineResponseDto } from '../dto/medicine/medicine-response.dto';
import { MedicineMapper } from '../mappers/medicine.mapper';
import { PaginationQueryDto } from '../dto/medicine/pagination-query.dto';

export class MedicineService {
  private createMedicineUseCase: CreateMedicineUseCase;
  private getMedicinesUseCase: GetMedicinesUseCase;
  private medicineRepository: IMedicineRepository;

  constructor(medicineRepository: IMedicineRepository) {
    this.medicineRepository = medicineRepository;
    this.createMedicineUseCase = new CreateMedicineUseCase(this.medicineRepository);
    this.getMedicinesUseCase = new GetMedicinesUseCase(this.medicineRepository);
  }

  async createMedicine(dto: CreateMedicineDto): Promise<MedicineResponseDto> {
    const medicine = await this.createMedicineUseCase.execute({
      ...dto,
      expirationDate: new Date(dto.expirationDate)
    });
    return MedicineMapper.toResponse(medicine);
  }

  async getMedicines(query: PaginationQueryDto): Promise<{
    data: MedicineResponseDto[];
    pagination: any;
  }> {
    const result = await this.getMedicinesUseCase.execute({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search,
      category: query.category as Category,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice
    });

    return {
      data: MedicineMapper.toResponseList(result.data),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev
      }
    };
  }

  async getMedicineById(id: string): Promise<MedicineResponseDto | null> {
    const medicine = await this.medicineRepository.findById(id);
    if (!medicine) return null;
    return MedicineMapper.toResponse(medicine);
  }

  async updateMedicine(id: string, data: Partial<Medicine>): Promise<MedicineResponseDto | null> {
    const medicine = await this.medicineRepository.update(id, data);
    if (!medicine) return null;
    return MedicineMapper.toResponse(medicine);
  }

  async deleteMedicine(id: string): Promise<boolean> {
    return this.medicineRepository.delete(id);
  }

  async getCriticalStock(): Promise<MedicineResponseDto[]> {
    const medicines = await this.medicineRepository.getCriticalStock();
    return MedicineMapper.toResponseList(medicines);
  }

  async getExpiringSoon(): Promise<MedicineResponseDto[]> {
    const medicines = await this.medicineRepository.getExpiringSoon();
    return MedicineMapper.toResponseList(medicines);
  }
}
