import { apiClient } from "./axios";
import type { AuthResponse, LoginData, SignUpData } from "./types";

export const loginApi = async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
};

export const signupApi = async (signupData: SignUpData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', signupData);
    return response.data.data;
};

export const logoutApi = async ()=>{
    const response = await apiClient.post('/auth/logout');
    return response.data;
}

export const refreshToken = async ()=>{
    const response = await apiClient.post('/auth/refreshToken');
    return response.data;
}

export const sendResetLink = async (email : string) => {
    const response = await apiClient.post('/auth/reset/forgotPassword', {email});
    return response.data;
}

export const validateResetToken = async (token: string) => {
    const response = await apiClient.post('/auth/reset/validateResetToken', {token});
    return response.data;
}

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset/resetPassword', {token, newPassword});
    return response.data;
}