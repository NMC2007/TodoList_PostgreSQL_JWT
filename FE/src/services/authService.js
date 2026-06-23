import api from '../lib/axios';

export const authService = {
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    logout: async (refreshToken) => {
        const response = await api.post('/auth/logout', { refreshToken });
        return response.data;
    },
    refresh: async (refreshToken) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    }
};
