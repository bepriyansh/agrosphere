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

function emitApiError(message: string) {
    window.dispatchEvent(new CustomEvent("api-error", { detail: message }));
}

apiClient.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success === false) {
            const msg = response.data.message || 'An unexpected error occurred.';
            emitApiError(msg);
            return Promise.reject(new Error(msg));
        }
        return response;
    },
    (error) => {
        let msg = 'A network error occurred.';
        if (axios.isAxiosError(error) && error.response) {
            msg = error.response.data.message || 'A server error occurred.';
        }
        emitApiError(msg);
        return Promise.reject(new Error(msg));
    }
);
