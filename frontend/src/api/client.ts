import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {  const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (!url) {
    console.warn('⚠️ VITE_API_URL is not defined! API calls will likely fail.');
    return '';
  }
  const finalUrl = url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
  console.log(`📡 Frontend API Base URL: ${finalUrl}`);
  return finalUrl;
};

const client = axios.create({
  baseURL: getBaseURL(),
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
