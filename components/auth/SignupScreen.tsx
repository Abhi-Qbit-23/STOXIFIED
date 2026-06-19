import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../icons/LoadingSpinner';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(username, email, password, fullName || undefined);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-primary-400 mb-2">Stoxified</h1>
      <p className="text-neutral-400 text-sm mb-8">Create your account</p>

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
            Username <span className="text-red-400">*</span>
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
          <label htmlFor="email" className="block text-xs text-neutral-400 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-xs text-neutral-400 mb-1">
            Full Name <span className="text-neutral-500">(optional)</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            autoComplete="name"
            className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs text-neutral-400 mb-1">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username || !email || !password}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-4 h-4" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-400">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
