import { Schema, model } from 'mongoose';
import type { CustomCategory } from '@shared/types';

export interface BudgetDoc {
  userId: string;
  category: string;
  limit: number;
  alert_threshold: number; // Percentage (0-100) to trigger alert
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<BudgetDoc>(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true, min: 0 },
    alert_threshold: { type: Number, default: 80, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const Budget = model<BudgetDoc>('Budget', budgetSchema);
