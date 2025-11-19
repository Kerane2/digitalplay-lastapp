import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryById);

// Routes admin
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  categoriesController.createCategory
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  categoriesController.deleteCategory
);

export default router;
