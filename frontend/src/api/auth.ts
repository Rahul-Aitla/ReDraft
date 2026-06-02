import client from './client';
import type { Author } from '../types';

interface AuthResponse {
  token: string;
  user: Author;
}

interface AuthPayload {
  email: string;
  password?: string;
  name?: string;
}

export const login = async (payload: AuthPayload) => {
  const { data } = await client.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const register = async (payload: AuthPayload) => {
  const { data } = await client.post<AuthResponse>('/auth/register', payload);
  return data;
};
