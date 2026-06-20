import { API_BASE_URL } from './api';
import type { Token, User } from '../types/auth';

export const login = async (username: string, password: string): Promise<Token> => {
  const body = new URLSearchParams({ username, password });

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.detail ?? `Login failed: ${response.status}`);
  }

  return response.json();
};

export const signup = async (
  username: string,
  email: string,
  password: string,
  full_name?: string
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, full_name }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.detail ?? `Signup failed: ${response.status}`);
  }

  return response.json();
};

export const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
};
