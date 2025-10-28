import { Router } from 'express';
import { OrdersController } from '../controllers/ordersController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes (require authentication)
router.post('/', authenticate, OrdersController.createOrder);
router.get('/user/:userId', authenticate, OrdersController.getUserOrders);
router.get('/:id', authenticate, OrdersController.getOrderById);
router.put('/:id/cancel', authenticate, OrdersController.cancelOrder);

// Admin routes
router.get('/', authenticate, authorize('admin'), OrdersController.getAllOrders);
router.put('/:id/status', authenticate, authorize('admin'), OrdersController.updateOrderStatus);

export default router;