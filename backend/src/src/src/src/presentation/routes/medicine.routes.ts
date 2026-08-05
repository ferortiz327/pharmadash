import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

const router = Router();
const medicineController = new MedicineController();

// Rutas p?blicas (requieren autenticaci?n)
router.get(
  '/', 
  AuthMiddleware.authenticate, 
  (req, res) => medicineController.getAll(req, res)
);

router.get(
  '/critical', 
  AuthMiddleware.authenticate, 
  (req, res) => medicineController.getCritical(req, res)
);

router.get(
  '/expiring', 
  AuthMiddleware.authenticate, 
  (req, res) => medicineController.getExpiring(req, res)
);

router.get(
  '/:id', 
  AuthMiddleware.authenticate, 
  (req, res) => medicineController.getById(req, res)
);

// Rutas protegidas - Solo ADMIN
router.post(
  '/', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.requireAdmin(), 
  (req, res) => medicineController.create(req, res)
);

router.put(
  '/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.requireAdmin(), 
  (req, res) => medicineController.update(req, res)
);

router.delete(
  '/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.requireAdmin(), 
  (req, res) => medicineController.delete(req, res)
);

export default router;
