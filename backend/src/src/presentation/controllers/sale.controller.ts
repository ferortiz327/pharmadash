import { Request, Response } from 'express';
import { SaleService } from '../../application/services/sale.service';
import { CreateSaleDto } from '../../application/dto/sale/create-sale.dto';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const cashierId = req.user?.id;
      if (!cashierId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const dto: CreateSaleDto = req.body;

      if (!dto.items || dto.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one item is required'
        });
      }

      const sale = await this.saleService.createSale(cashierId, dto);

      res.status(201).json({
        success: true,
        data: sale,
        message: 'Sale completed successfully'
      });
    } catch (error: any) {
      const status = error.message && error.message.includes('stock') ? 400 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Error creating sale'
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const sale = await this.saleService.getSaleById(id);

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: 'Sale not found'
        });
      }

      res.json({
        success: true,
        data: sale,
        message: 'Sale retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving sale',
        error: error.message || 'Unknown error'
      });
    }
  }

  async getDaily(req: AuthRequest, res: Response) {
    try {
      const sales = await this.saleService.getDailySales();

      const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);

      res.json({
        success: true,
        data: {
          sales: sales,
          summary: {
            totalSales: sales.length,
            totalRevenue: totalRevenue,
            averageTicket: sales.length > 0 ? totalRevenue / sales.length : 0
          }
        },
        message: 'Daily sales retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving daily sales',
        error: error.message || 'Unknown error'
      });
    }
  }

  async getTopProducts(req: AuthRequest, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const topProducts = await this.saleService.getTopProducts(limit);

      res.json({
        success: true,
        data: topProducts,
        message: 'Top products retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving top products',
        error: error.message || 'Unknown error'
      });
    }
  }
}
