import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Lấy dữ liệu từ localStorage khi khởi động
        const storedUser = localStorage.getItem('user');
        const storedAccess = localStorage.getItem('accessToken');
        const storedRefresh = localStorage.getItem('refreshToken');

        if (storedUser && storedAccess && storedRefresh) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
        }
        setIsLoading(false);
    }, []);

    const login = (userData, access, refresh) => {
        setUser(userData);
        setAccessToken(access);
        setRefreshToken(refresh);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    const logout = async () => {
        try {
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất API", error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const updateTokens = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            refreshToken,
            isAuthenticated: !!accessToken,
            isLoading,
            login,
            logout,
            updateTokens
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
