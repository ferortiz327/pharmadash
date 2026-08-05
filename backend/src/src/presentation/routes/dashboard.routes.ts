import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Obtener m?tricas del dashboard (KPIs)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: M?tricas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     dailyRevenue:
 *                       type: number
 *                       description: Ingresos del d?a
 *                     totalSales:
 *                       type: integer
 *                       description: Total de ventas del d?a
 *                     averageTicket:
 *                       type: number
 *                       description: Ticket promedio
 *                     criticalStock:
 *                       type: integer
 *                       description: Medicamentos con stock cr?tico
 *                     lowStock:
 *                       type: integer
 *                       description: Medicamentos con stock bajo
 *                     expiringSoon:
 *                       type: integer
 *                       description: Medicamentos pr?ximos a vencer
 *                     expired:
 *                       type: integer
 *                       description: Medicamentos vencidos
 *                     totalMedicines:
 *                       type: integer
 *                       description: Total de medicamentos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (solo ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.get('/metrics', AuthMiddleware.authenticate, AuthMiddleware.requireAdmin(), (req, res) => dashboardController.getMetrics(req, res));

export default router;
