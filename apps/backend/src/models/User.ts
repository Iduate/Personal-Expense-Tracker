import { Schema, model } from 'mongoose';
import type { User } from '@expense-tracker/shared';

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>('User', userSchema);
