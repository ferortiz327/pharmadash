import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const medicineController = new MedicineController();

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Listar medicamentos con paginaci?n y filtros
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: N?mero de p?gina
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por p?gina
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o SKU
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [GENERIC, ANTIBIOTIC, COLD_CHAIN]
 *         description: Filtrar por categor?a
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio m?nimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio m?ximo
 *     responses:
 *       200:
 *         description: Lista de medicamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ef: '#/components/schemas/MedicineResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/',
  AuthMiddleware.authenticate,
  (req, res) => medicineController.getAll(req, res)
);

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Crear un nuevo medicamento (Solo ADMIN)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ef: '#/components/schemas/MedicineRequest'
 *     responses:
 *       201:
 *         description: Medicamento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ef: '#/components/schemas/MedicineResponse'
 *       400:
 *         description: SKU duplicado o datos inv?lidos
 *       403:
 *         description: Sin permisos (solo ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin(),
  (req, res) => medicineController.create(req, res)
);

/**
 * @swagger
 * /api/medicines/critical:
 *   get:
 *     summary: Obtener medicamentos con stock cr?tico
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de medicamentos con stock cr?tico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ef: '#/components/schemas/MedicineResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/critical',
  AuthMiddleware.authenticate,
  (req, res) => medicineController.getCritical(req, res)
);

/**
 * @swagger
 * /api/medicines/expiring:
 *   get:
 *     summary: Obtener medicamentos pr?ximos a vencer
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de medicamentos pr?ximos a vencer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ef: '#/components/schemas/MedicineResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/expiring',
  AuthMiddleware.authenticate,
  (req, res) => medicineController.getExpiring(req, res)
);

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Obtener medicamento por ID
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del medicamento
 *     responses:
 *       200:
 *         description: Medicamento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ef: '#/components/schemas/MedicineResponse'
 *       404:
 *         description: Medicamento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  (req, res) => medicineController.getById(req, res)
);

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Actualizar medicamento (Solo ADMIN)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del medicamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [GENERIC, ANTIBIOTIC, COLD_CHAIN]
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicamento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ef: '#/components/schemas/MedicineResponse'
 *       404:
 *         description: Medicamento no encontrado
 *       403:
 *         description: Sin permisos (solo ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin(),
  (req, res) => medicineController.update(req, res)
);

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Eliminar medicamento (Solo ADMIN)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del medicamento
 *     responses:
 *       200:
 *         description: Medicamento eliminado exitosamente
 *       404:
 *         description: Medicamento no encontrado
 *       403:
 *         description: Sin permisos (solo ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin(),
  (req, res) => medicineController.delete(req, res)
);

export default router;
