import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const saleController = new SaleController();

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineId
 *                     - quantity
 *                   properties:
 *                     medicineId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *       400:
 *         description: Stock insuficiente o datos inv?lidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error del servidor
 */
router.post('/', AuthMiddleware.authenticate, AuthMiddleware.requireCashier(), (req, res) => saleController.create(req, res));

/**
 * @swagger
 * /api/sales/daily:
 *   get:
 *     summary: Obtener ventas del d?a
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ventas del d?a obtenidas exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/daily', AuthMiddleware.authenticate, AuthMiddleware.requireCashier(), (req, res) => saleController.getDaily(req, res));

/**
 * @swagger
 * /api/sales/top-products:
 *   get:
 *     summary: Obtener los productos m?s vendidos
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: N?mero de productos a retornar
 *     responses:
 *       200:
 *         description: Top productos obtenidos exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (solo ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.get('/top-products', AuthMiddleware.authenticate, AuthMiddleware.requireAdmin(), (req, res) => saleController.getTopProducts(req, res));

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venta obtenida exitosamente
 *       404:
 *         description: Venta no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', AuthMiddleware.authenticate, AuthMiddleware.requireCashier(), (req, res) => saleController.getById(req, res));

export default router;
