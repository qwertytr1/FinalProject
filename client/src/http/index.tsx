import axios from "axios";

const API_URL = `https://final-project-khaki-gamma.vercel.app/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL:API_URL
})



$api.interceptors.request.use((config) => {
    console.log('Request Config:', config);
    return config;
});


export default $api;
