import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Expenses OK' });
});

export default router;
