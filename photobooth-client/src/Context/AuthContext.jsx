import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser , loginUser } from '../api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const isAuthenticated = !!token;

    // useEffect(() => {
    //     if (token) {
    //         const getUser = async () => {
    //             const user = await fetchUserProfile(token);
    //             setUser(user);
    //         };
    //         getUser();
    //     }
    // }, [token]); 
     const login = async (email, password) => {
    try {
        const response = await loginUser({ email, password });
        if (response?.access_token) {
            setToken(response.access_token);
            // Lưu token vào localStorage để sử dụng cho các lần truy cập sau
            localStorage.setItem('token', response.access_token);
            
            // // Lấy thông tin người dùng sau khi đăng nhập thành công
            // const userResponse = await fetchUserProfile(response.access_token);
            // setUser(userResponse);  // Cập nhật thông tin người dùng

            // Điều hướng đến trang profile
            navigate('/camera');
        }
    } catch (error) {
        console.error("Login error:", error);
        // Bạn có thể xử lý thêm các lỗi ở đây, chẳng hạn như thông báo lỗi đăng nhập
    }
};


    const register = async (user_name, email, password) => {
        // console.log({ "username": user_name, "email": email, "password": password  });
        await registerUser({ user_name, email, password });
        console.log({ user_name, email, password });
        navigate('/sign-in');  // Đảm bảo đường dẫn đúng là '/sign-up'
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/sign-in");
};
    return (
        <AuthContext.Provider value={{ register, login, logout, user, setUser, token, setToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
    
}

export { AuthProvider, AuthContext };
