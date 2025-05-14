import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');  // Thêm state để lưu thông báo lỗi
    const navigate = useNavigate();

    const isAuthenticated = !!token;

    const login = async (email, password) => {
        if(!email || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin!")
            return; 
        }
        try {
            const response = await loginUser({ email, password });
            if (response?.access_token) {
                setToken(response.access_token);
                localStorage.setItem('token', response.access_token);
                navigate('/');
            }
        } catch (error) {
            if (error?.response?.data?.message) {
            setErrorMessage(error.response.data.message || 'Lỗi đăng nhập');
        } else {
            setErrorMessage('Email hoặc mật khẩu không đúng!');
        } 
        }
    };

    const register = async (user_name, email, password) => {
        if (!user_name || !email || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            await registerUser({ user_name, email, password });
            navigate('/sign-in');
        } catch (error) {
            console.error("Full error:", error);
            // Kiểm tra lỗi trả về từ backend
            setErrorMessage(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };



    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/sign-in");
    };

    return (
        <AuthContext.Provider value={{ register, login, logout, user, setUser, token, setToken, isAuthenticated, errorMessage, setErrorMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
