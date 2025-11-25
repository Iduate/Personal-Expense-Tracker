import { Router } from 'express';
import { budgetController } from '../controllers';

const router = Router();

router.post('/', budgetController.create);
router.get('/', budgetController.list);
router.put('/:category', budgetController.update);
router.delete('/:category', budgetController.delete);

export default router;
