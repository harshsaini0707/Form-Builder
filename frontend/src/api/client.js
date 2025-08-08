import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  r => r,
  err => {
    toast.error(err?.response?.data?.message || 'Network error');
    return Promise.reject(err);
  }
);

export default api;
