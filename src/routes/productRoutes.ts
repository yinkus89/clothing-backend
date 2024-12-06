import { Router } from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controller/productController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authMiddleware, addProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
