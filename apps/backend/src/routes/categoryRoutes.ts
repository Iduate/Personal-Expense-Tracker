import { Router } from 'express';
import { categoryController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', categoryController.create);
router.get('/', categoryController.list);
router.delete('/:id', categoryController.delete);

export default router;
