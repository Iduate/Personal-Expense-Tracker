import type { CustomCategory } from '@expense-tracker/shared';

// Lazy load models to avoid initialization issues in Lambda
const getCategoryModel = async () => {
  const { CategoryModel } = await import('../models');
  return CategoryModel;
};

export const categoryService = {
  async createCategory(userId: string, name: string): Promise<CustomCategory> {
    const CategoryModel = await getCategoryModel();
    const category = await CategoryModel.create({ userId, name });
    return category.toObject();
  },

  async getCategories(userId: string): Promise<CustomCategory[]> {
    const CategoryModel = await getCategoryModel();
    const categories = await CategoryModel.find({ userId });
    return categories.map((c: any) => c.toObject());
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const CategoryModel = await getCategoryModel();
    const result = await CategoryModel.deleteOne({ _id: categoryId, userId });

    if (result.deletedCount === 0) {
      throw new Error('Category not found');
    }
  },
};
