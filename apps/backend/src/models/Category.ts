import { Schema, model } from 'mongoose';
import type { CustomCategory } from '@expense-tracker/shared';

const categorySchema = new Schema<CustomCategory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const CategoryModel = model<CustomCategory>('Category', categorySchema);
