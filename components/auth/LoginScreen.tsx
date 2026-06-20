import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../icons/LoadingSpinner';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-primary-400 mb-2">Stoxified</h1>
      <p className="text-neutral-400 text-sm mb-8">Stock news, swipe to discover</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && (
          <div className="bg-red-800/60 border border-red-600 text-red-200 text-sm rounded-lg px-4 py-3">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="float-right text-red-300 hover:text-white"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-xs text-neutral-400 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-500"
            placeholder="your_username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs text-neutral-400 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username || !password}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-4 h-4" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};
