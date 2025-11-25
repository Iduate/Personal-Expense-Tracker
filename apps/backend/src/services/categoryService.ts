import type { CustomCategory } from '@expense-tracker/shared';
import { CategoryModel } from '../models';

export const categoryService = {
  async createCategory(userId: string, name: string): Promise<CustomCategory> {
    const category = await CategoryModel.create({ userId, name });
    return category.toObject();
  },

  async getCategories(userId: string): Promise<CustomCategory[]> {
    const categories = await CategoryModel.find({ userId });
    return categories.map((c: any) => c.toObject());
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const result = await CategoryModel.deleteOne({ _id: categoryId, userId });

    if (result.deletedCount === 0) {
      throw new Error('Category not found');
    }
  },
};
