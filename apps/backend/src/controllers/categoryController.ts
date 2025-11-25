import { Request, Response } from 'express';
import { categoryService } from '../services';
import { PREDEFINED_CATEGORIES } from '@expense-tracker/shared';

export const categoryController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const userId = req.userId!;

      if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      const category = await categoryService.createCategory(userId, name);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const customCategories = await categoryService.getCategories(userId);
      const allCategories = [
        ...PREDEFINED_CATEGORIES,
        ...customCategories.map(c => c.name),
      ];

      res.status(200).json({ predefined: PREDEFINED_CATEGORIES, custom: customCategories, all: allCategories });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      await categoryService.deleteCategory(userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
