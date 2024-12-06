import { Router } from 'express';
import { getOrders, createOrder, getOrderById } from '../controller/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getOrders);
router.post('/', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);

export default router;
