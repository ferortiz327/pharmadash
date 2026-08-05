import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const saleController = new SaleController();

// Todas las rutas requieren autenticaci?n
router.use(AuthMiddleware.authenticate);

// Rutas de ventas
router.post('/', AuthMiddleware.requireCashier(), (req, res) => saleController.create(req, res));
router.get('/daily', AuthMiddleware.requireCashier(), (req, res) => saleController.getDaily(req, res));
router.get('/top-products', AuthMiddleware.requireAdmin(), (req, res) => saleController.getTopProducts(req, res));
router.get('/:id', AuthMiddleware.requireCashier(), (req, res) => saleController.getById(req, res));

export default router;
