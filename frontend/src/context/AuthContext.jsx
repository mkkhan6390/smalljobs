import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            await api.get('auth/csrf-token/'); // Ensure CSRF cookie is set
            const { data } = await api.get('auth/me/');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username, password) => {
        await api.post('auth/login/', { username, password });
        await checkAuth();
    };

    const register = async (userData) => {
        await api.post('auth/register/', userData);
        await login(userData.username, userData.password);
    };

    const logout = async () => {
        await api.post('auth/logout/');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
