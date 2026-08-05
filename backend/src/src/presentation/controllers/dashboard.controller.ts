import { Response } from 'express';
import { GetDashboardMetricsUseCase } from '../../domain/use-cases/dashboard/get-dashboard-metrics.use-case';
import { AuthRequest } from '../../infrastructure/middleware/auth.middleware';

export class DashboardController {
  private getMetricsUseCase: GetDashboardMetricsUseCase;

  constructor() {
    this.getMetricsUseCase = new GetDashboardMetricsUseCase();
  }

  async getMetrics(req: AuthRequest, res: Response) {
    try {
      const metrics = await this.getMetricsUseCase.execute();

      res.json({
        success: true,
        data: metrics,
        message: 'Dashboard metrics retrieved successfully'
      });
    } catch (error: any) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving dashboard metrics',
        error: error.message || 'Unknown error'
      });
    }
  }
}

export default DashboardController;
