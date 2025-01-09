// import { message } from 'antd';
import axios from 'axios';

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: '*',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// $api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       message.error('Session expired. Please log in again.');
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 1500);
//     }
//     return Promise.reject(error);
//   },
// );

export default $api;
