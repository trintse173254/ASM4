import axios from 'axios';

const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  // Ensure the base URL always ends with /api
  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

