import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Trends OK' });
});

export default router;
