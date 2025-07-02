import axios from 'axios';
import { config } from '../utils/config';

const AuthService_BASE_URL = `${config.AUTH_SERVICE_URL}/api/v1/service`;
const AIService_BASE_URL = `${config.AI_SERVICE_URL}/api`;

export const apiAuthServiceClient = axios.create({
    baseURL: AuthService_BASE_URL,
    withCredentials: true,
});

export const apiAIServiceClient = axios.create({
    baseURL: AIService_BASE_URL,
    withCredentials: true,
});

[apiAuthServiceClient, apiAIServiceClient].forEach(client => {
    client.interceptors.request.use(
        (config) => {
            if (!(config.data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
});

[apiAuthServiceClient, apiAIServiceClient].forEach(client => {
    client.interceptors.response.use(
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
    )
});