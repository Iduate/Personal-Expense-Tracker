import type { Expense } from '@expense-tracker/shared';
import { ExpenseModel } from '../models';
import { validateAmount } from '@expense-tracker/shared';

export const expenseService = {
  async createExpense(userId: string, expenseData: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    if (!validateAmount(expenseData.amount)) {
      throw new Error('Invalid amount');
    }

    const expense = await ExpenseModel.create({
      ...expenseData,
      userId,
    });

    return expense.toObject();
  },

  async getExpenses(userId: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Expense[]> {
    const query: Record<string, any> = { userId };

    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    const expenses = await ExpenseModel.find(query).sort({ date: -1 });
    return expenses.map((e: any) => e.toObject());
  },

  async updateExpense(userId: string, expenseId: string, updates: Partial<Omit<Expense, '_id' | 'userId'>>): Promise<Expense> {
    if (updates.amount && !validateAmount(updates.amount)) {
      throw new Error('Invalid amount');
    }

    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: expenseId, userId },
      updates,
      { new: true }
    );

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense.toObject();
  },

  async deleteExpense(userId: string, expenseId: string): Promise<void> {
    const result = await ExpenseModel.deleteOne({ _id: expenseId, userId });

    if (result.deletedCount === 0) {
      throw new Error('Expense not found');
    }
  },

  async getMonthlySummary(userId: string, month?: string): Promise<Record<string, any>> {
    const matchStage: Record<string, any> = { userId };

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 1);
      matchStage.date = {
        $gte: startDate.toISOString(),
        $lt: endDate.toISOString(),
      };
    }

    const result = await ExpenseModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: '$category' },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: null,
          grandTotal: { $sum: '$total' },
          byCategory: {
            $push: {
              category: '$_id.category',
              total: '$total',
            },
          },
        },
      },
    ]);

    return result[0] || { grandTotal: 0, byCategory: [] };
  },

  async getSpendingByCategory(userId: string): Promise<Array<{ category: string; total: number }>> {
    const result = await ExpenseModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          _id: 0,
        },
      },
      { $sort: { total: -1 } },
    ]);

    return result;
  },

  async getMonthlyTrends(userId: string): Promise<Array<{ month: string; total: number }>> {
    const result = await ExpenseModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$date' } } },
            month: { $month: { $dateFromString: { dateString: '$date' } } },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1,
                },
              },
            },
          },
          total: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return result;
  },
};
