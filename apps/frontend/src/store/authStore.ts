import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  setAuth: (token: string, userId: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      token: null,
      userId: null,
      email: null,
      setAuth: (token: string, userId: string, email: string) =>
        set({ token, userId, email } as Partial<AuthState>),
      clearAuth: () =>
        set({ token: null, userId: null, email: null } as Partial<AuthState>),
    }),
    {
      name: 'auth-storage',
    }
  ) as any
);
