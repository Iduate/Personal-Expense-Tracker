import { Router } from 'express';
import { expenseController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', expenseController.create);
router.get('/', expenseController.list);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);
router.get('/monthly/summary', expenseController.getMonthlySummary);
router.get('/category/spending', expenseController.getSpendingByCategory);
router.get('/export/csv', expenseController.exportCSV);
router.get('/trends/monthly', expenseController.getMonthlyTrends);

export default router;
