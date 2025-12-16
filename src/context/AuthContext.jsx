import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '../services/authApi';
import authApi from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async ({ username, password }) => {
        try {
            const foundUser = await authApi.login({ username, password });

            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(foundUser));
                return { success: true, user: foundUser };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Đăng nhập thất bại, vui lòng thử lại'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const newUser = await authApi.signup(
                userData.username,
                userData.full_name,
                userData.phone,
                userData.email,
                userData.address,
                userData.password
            );

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.message || 'Đăng ký thất bại, vui lòng thử lại'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };



    const isAdmin = () => {
        return user && user.role_id === 1;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                signup,
                isAdmin,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};