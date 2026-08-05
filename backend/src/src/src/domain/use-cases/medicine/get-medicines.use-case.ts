import { Medicine } from '../../entities/medicine.entity';
import { IMedicineRepository, FindMedicinesOptions, PaginatedResult } from '../../interfaces/medicine-repository.interface';

export class GetMedicinesUseCase {
  constructor(
    private readonly medicineRepository: IMedicineRepository
  ) {}

  async execute(options: FindMedicinesOptions): Promise<PaginatedResult<Medicine>> {
    return this.medicineRepository.findAll(options);
  }
}
