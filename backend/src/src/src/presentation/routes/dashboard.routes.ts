import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// Solo ADMIN puede ver el dashboard
router.get(
  '/metrics',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin(),
  (req, res) => dashboardController.getMetrics(req, res)
);

export default router;
