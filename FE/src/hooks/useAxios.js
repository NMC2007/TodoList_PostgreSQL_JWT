import { useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const useAxios = () => {
    const { accessToken, refreshToken, updateTokens, logout } = useAuth();

    useEffect(() => {
        // Request interceptor: tự động thêm token
        const requestIntercept = api.interceptors.request.use(
            (config) => {
                if (accessToken && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor: xử lý token hết hạn (401)
        const responseIntercept = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    // Không intercept các request của phần auth (như login, refresh)
                    if (originalRequest.url?.includes('/auth/')) {
                        return Promise.reject(error);
                    }

                    originalRequest._retry = true;

                    if (!refreshToken) {
                        logout();
                        return Promise.reject(error);
                    }

                    try {
                        const data = await authService.refresh(refreshToken);
                        // Cập nhật token mới
                        updateTokens(data.data.accessToken, data.data.refreshToken);
                        
                        // Thử lại request bị lỗi với token mới
                        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // Refresh token cũng hết hạn hoặc lỗi
                        logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup function: xóa interceptors khi unmount để tránh bị gọi lại nhiều lần
        return () => {
            api.interceptors.request.eject(requestIntercept);
            api.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, refreshToken, updateTokens, logout]);

    return api;
};

export default useAxios;
