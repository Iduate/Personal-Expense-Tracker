import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(persist((set) => ({
    token: null,
    userId: null,
    email: null,
    setAuth: (token, userId, email) => set({ token, userId, email }),
    clearAuth: () => set({ token: null, userId: null, email: null }),
}), {
    name: 'auth-storage',
}));
