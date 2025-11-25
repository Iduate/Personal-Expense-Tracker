// Lazy load models to avoid initialization issues in Lambda
const getBudgetModel = async () => {
  const { Budget } = await import('../models');
  return Budget;
};

export const budgetService = {
  async createBudget(userId: string, category: string, limit: number, alert_threshold: number = 80) {
    const Budget = await getBudgetModel();
    const budget = await Budget.create({
      userId,
      category,
      limit,
      alert_threshold,
    });
    return budget.toObject();
  },

  async getBudgets(userId: string) {
    const Budget = await getBudgetModel();
    const budgets = await Budget.find({ userId });
    return budgets.map((b: any) => b.toObject());
  },

  async getBudgetByCategory(userId: string, category: string) {
    const Budget = await getBudgetModel();
    const budget = await Budget.findOne({ userId, category });
    return budget ? budget.toObject() : null;
  },

  async updateBudget(userId: string, category: string, limit?: number, alert_threshold?: number) {
    const Budget = await getBudgetModel();
    const budget = await Budget.findOneAndUpdate(
      { userId, category },
      { ...(limit !== undefined && { limit }), ...(alert_threshold !== undefined && { alert_threshold }) },
      { new: true }
    );
    return budget ? budget.toObject() : null;
  },

  async deleteBudget(userId: string, category: string) {
    const Budget = await getBudgetModel();
    await Budget.deleteOne({ userId, category });
  },

  // Check if spending exceeds budget threshold
  async checkBudgetAlert(userId: string, category: string, currentSpending: number) {
    const budget = await this.getBudgetByCategory(userId, category);
    if (!budget) return { exceeded: false, budget: null };

    const percentageUsed = (currentSpending / budget.limit) * 100;
    return {
      exceeded: percentageUsed >= budget.alert_threshold,
      percentageUsed,
      budget,
    };
  },
};
