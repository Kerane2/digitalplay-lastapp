import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

// Routes publiques
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

// Routes admin
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty(),
    body('price').isNumeric(),
    body('category_id').isUUID(),
  ],
  productsController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  productsController.updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  productsController.deleteProduct
);

export default router;
