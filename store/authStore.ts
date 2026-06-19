import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, signup, fetchCurrentUser } from '../services/authApi';
import { useNewsStore } from './newsStore';
import type { User } from '../types/auth';

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hydrateUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token } = await login(username, password);
          const user = await fetchCurrentUser(access_token);
          // Clear any previous user's data before setting new session
          useNewsStore.getState().clearUserData();
          set({ token: access_token, user, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      signup: async (username, email, password, fullName) => {
        set({ isLoading: true, error: null });
        try {
          await signup(username, email, password, fullName);
          const { access_token } = await login(username, password);
          const user = await fetchCurrentUser(access_token);
          // Clear any previous user's data before setting new session
          useNewsStore.getState().clearUserData();
          set({ token: access_token, user, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        useNewsStore.getState().clearUserData();
        set({ token: null, user: null, error: null });
      },

      clearError: () => set({ error: null }),

      // Re-validate token on app start
      hydrateUser: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const user = await fetchCurrentUser(token);
          set({ user });
        } catch {
          // Token expired or invalid — force logout
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: 'stoxified-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
