import { Request, Response } from 'express';
import { expenseService } from '../services';

export const expenseController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { amount, description, category, date } = req.body;
      const userId = req.userId!;

      if (!amount || !description || !category || !date) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const expense = await expenseService.createExpense(userId, {
        amount,
        description,
        category,
        date,
      });

      res.status(201).json(expense);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { startDate, endDate, category } = req.query;

      const expenses = await expenseService.getExpenses(userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        category: category as string | undefined,
      });

      res.status(200).json(expenses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const updates = req.body;

      const expense = await expenseService.updateExpense(userId, id, updates);
      res.status(200).json(expense);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      await expenseService.deleteExpense(userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMonthlySummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { month } = req.query;

      const summary = await expenseService.getMonthlySummary(userId, month as string | undefined);
      res.status(200).json(summary);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getSpendingByCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const spending = await expenseService.getSpendingByCategory(userId);
      res.status(200).json(spending);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async exportCSV(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const expenses = await expenseService.getExpenses(userId, {});

      // Create CSV header
      const headers = ['Date', 'Description', 'Category', 'Amount'];
      const rows = expenses.map((e: any) => [
        new Date(e.date).toLocaleDateString(),
        e.description,
        e.category,
        e.amount.toFixed(2),
      ]);

      // Create CSV content
      const csv = [headers, ...rows].map((row: any) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="expenses-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMonthlyTrends(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const trends = await expenseService.getMonthlyTrends(userId);
      res.status(200).json(trends);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
