import { Router } from 'express';
import { categoryController } from '../controllers';

const router = Router();

router.post('/', categoryController.create);
router.get('/', categoryController.list);
router.delete('/:id', categoryController.delete);

export default router;
