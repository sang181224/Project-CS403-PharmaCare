import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [token]);

    const login = (userData, authToken) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
        toast.success('Bạn đã đăng xuất.');
        window.location.href = '/dang-nhap';
    };

    const value = { user, token, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};