import type { User, AuthResponse } from '@expense-tracker/shared';
import { generateToken, hashPassword, comparePasswords } from '../utils';

// Lazy load models to avoid initialization issues in Lambda
const getUserModel = async () => {
  const { UserModel } = await import('../models');
  return UserModel;
};

export const authService = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const UserModel = await getUserModel();
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({ email, password: hashedPassword });

    const token = generateToken(user._id!.toString());
    return {
      token,
      user: {
        _id: user._id!.toString(),
        email: user.email,
      },
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const UserModel = await getUserModel();
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id!.toString());
    return {
      token,
      user: {
        _id: user._id!.toString(),
        email: user.email,
      },
    };
  },
};
