import axios from 'axios';

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: '*',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default $api;
