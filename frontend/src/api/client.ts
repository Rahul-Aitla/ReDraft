import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (!url) return '';
  // Ensure the URL ends with /api for consistency
  return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
};

const client = axios.create({
  baseURL: getBaseURL(),
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
