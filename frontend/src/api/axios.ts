import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success === false) {
            return Promise.reject(new Error(response.data.message || 'An unexpected error occurred.'));
        }
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(new Error(error.response.data.message || 'A server error occurred.'));
        }
        return Promise.reject(new Error('A network error occurred.'));
    }
);
