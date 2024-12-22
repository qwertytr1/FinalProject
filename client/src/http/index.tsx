import axios from "axios";

export const API_URL = `https://final-project-chi-nine.vercel.app/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL:API_URL
})




$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default $api;
