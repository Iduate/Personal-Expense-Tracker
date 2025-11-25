import { Request, Response } from 'express';
import { budgetService } from '../services';

export const budgetController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { category, limit, alert_threshold } = req.body;
      const userId = req.userId!;

      if (!category || !limit) {
        res.status(400).json({ error: 'Category and limit are required' });
        return;
      }

      const budget = await budgetService.createBudget(userId, category, limit, alert_threshold);
      res.status(201).json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const budgets = await budgetService.getBudgets(userId);
      res.status(200).json(budgets);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { limit, alert_threshold } = req.body;
      const userId = req.userId!;

      const budget = await budgetService.updateBudget(userId, category, limit, alert_threshold);
      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      res.status(200).json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const userId = req.userId!;

      await budgetService.deleteBudget(userId, category);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
