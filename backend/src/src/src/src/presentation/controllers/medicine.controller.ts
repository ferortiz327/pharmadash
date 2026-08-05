import { Request, Response } from 'express';
import { MedicineService } from '../../application/services/medicine.service';
import { MedicineRepository } from '../../infrastructure/repositories/medicine.repository';
import { CreateMedicineDto } from '../../application/dto/medicine/create-medicine.dto';
import { PaginationQueryDto } from '../../application/dto/medicine/pagination-query.dto';
import { Category } from '../../domain/entities/category.enum';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class MedicineController {
  private medicineService: MedicineService;

  constructor() {
    const medicineRepository = new MedicineRepository();
    this.medicineService = new MedicineService(medicineRepository);
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const query: PaginationQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        category: req.query.category as Category,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined
      };

      console.log('Usuario autenticado:', req.user?.email, 'Rol:', req.user?.role);

      const result = await this.medicineService.getMedicines(query);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Medicines retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const medicine = await this.medicineService.getMedicineById(id);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found'
        });
      }

      res.json({
        success: true,
        data: medicine,
        message: 'Medicine retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving medicine',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const dto: CreateMedicineDto = req.body;
      
      if (!dto.sku || !dto.name || !dto.price || !dto.stock || !dto.expirationDate) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: sku, name, price, stock, expirationDate'
        });
      }

      if (dto.category && !Object.values(Category).includes(dto.category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Allowed values: ' + Object.values(Category).join(', ')
        });
      }

      console.log('Usuario ADMIN creando medicamento:', req.user?.email);

      const medicine = await this.medicineService.createMedicine(dto);

      res.status(201).json({
        success: true,
        data: medicine,
        message: 'Medicine created successfully'
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('SKU') ? 400 : 500;
      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error creating medicine'
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      console.log('Usuario ADMIN actualizando medicamento:', req.user?.email);

      const medicine = await this.medicineService.updateMedicine(id, data);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found'
        });
      }

      res.json({
        success: true,
        data: medicine,
        message: 'Medicine updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating medicine',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      console.log('Usuario ADMIN eliminando medicamento:', req.user?.email);

      const deleted = await this.medicineService.deleteMedicine(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found'
        });
      }

      res.json({
        success: true,
        message: 'Medicine deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting medicine',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCritical(req: AuthRequest, res: Response) {
    try {
      const medicines = await this.medicineService.getCriticalStock();

      res.json({
        success: true,
        data: medicines,
        message: 'Critical stock medicines retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving critical medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getExpiring(req: AuthRequest, res: Response) {
    try {
      const medicines = await this.medicineService.getExpiringSoon();

      res.json({
        success: true,
        data: medicines,
        message: 'Expiring medicines retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving expiring medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
