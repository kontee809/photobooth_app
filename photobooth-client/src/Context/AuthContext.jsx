import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, getListUser, checkRole } from '../api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [users, setUsers] = useState([]);
    const [role, setRole ] = useState('');
    const [amount , setAmount] = useState('');
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
                localStorage.setItem('user_name', response.user_name);
                //localStorage.setItem('role', response.role);
                setRole(response.role)
                console.log(role)
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

    const checkrole = async () => {
        try {
            const response = await checkRole(token)
            setRole(response.role);
        } catch (error) {
            console.error("Lỗi khi gọi getListUser trong context:", error);
        }
    }

    const getListUserContext = async () => {
    try {
        const response = await getListUser(token);
        if (response) {
            // setRole(response.admin); // giả sử API trả về `admin: "admin"`
            setUsers(response.data_user);
            setAmount(response.total_amount)
        }
    } catch (error) {
        console.error("Lỗi khi gọi getListUser trong context:", error);
    }
};

    const logout = () => {
    setToken(null);
    setUsers([]); // ✅ sửa ở đây
    localStorage.removeItem("token");
    navigate("/sign-in");
};


    return (
        <AuthContext.Provider value={{ register, login, logout, users, setUsers, token, setToken, isAuthenticated, errorMessage, setErrorMessage, role , getListUserContext , amount , checkrole }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
