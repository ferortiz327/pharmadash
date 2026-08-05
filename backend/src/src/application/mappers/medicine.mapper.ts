import { Medicine } from '../../domain/entities/medicine.entity';
import { MedicineResponseDto } from '../dto/medicine/medicine-response.dto';

export class MedicineMapper {
  static toResponse(medicine: Medicine): MedicineResponseDto {
    return {
      id: medicine.id,
      sku: medicine.sku,
      name: medicine.name,
      category: medicine.category,
      categoryLabel: medicine.getCategoryLabel(),
      price: medicine.price,
      stock: medicine.stock,
      expirationDate: medicine.expirationDate,
      imageUrl: medicine.imageUrl,
      isCriticalStock: medicine.isCriticalStock(),
      isExpiringSoon: medicine.isExpiringSoon(),
      isExpired: medicine.isExpired(),
      stockStatus: medicine.getStockStatus(),
      taxRate: medicine.getTaxRate(),
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt
    };
  }

  static toResponseList(medicines: Medicine[]): MedicineResponseDto[] {
    return medicines.map(medicine => this.toResponse(medicine));
  }
}
