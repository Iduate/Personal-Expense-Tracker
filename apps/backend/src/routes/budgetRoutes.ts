import { Router } from 'express';
import { budgetController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', budgetController.create);
router.get('/', budgetController.list);
router.put('/:category', budgetController.update);
router.delete('/:category', budgetController.delete);

export default router;
