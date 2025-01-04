import axios from 'axios';

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: '*',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

$api.interceptors.request.use(
  (config) => {
    const cfg = config;
    const token = localStorage.getItem('token');
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default $api;
