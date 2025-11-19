import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Routes utilisateur
router.post('/', authenticateToken, ordersController.createOrder);
router.get('/my-orders', authenticateToken, ordersController.getUserOrders);
router.get('/:id', authenticateToken, ordersController.getOrderById);

// Routes admin
router.get('/', authenticateToken, requireAdmin, ordersController.getAllOrders);
router.put(
  '/:id/status',
  authenticateToken,
  requireAdmin,
  ordersController.updateOrderStatus
);

export default router;
