import { Request, Response } from 'express';
import { authService } from '../services';
import { validateEmail } from '@expense-tracker/shared';

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Signup request received:', req.body?.email);
      const { email, password } = req.body || {};

      if (!email || !password) {
        console.log('❌ Missing email or password');
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      if (!validateEmail(email)) {
        console.log('❌ Invalid email format:', email);
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      if (password.length < 6) {
        console.log('❌ Password too short');
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      console.log('🔐 Calling authService.signup...');
      const result = await authService.signup(email, password);
      console.log('✓ Signup successful for:', email);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('❌ Signup error:', error?.message || error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      res.status(400).json({ error: error?.message || 'Signup failed' });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔓 Login request received:', req.body?.email);
      const { email, password } = req.body || {};

      if (!email || !password) {
        console.log('❌ Missing email or password');
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      console.log('🔐 Calling authService.login...');
      const result = await authService.login(email, password);
      console.log('✓ Login successful for:', email);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Login error:', error?.message || error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      res.status(401).json({ error: error?.message || 'Login failed' });
    }
  },
};
