import React from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";


const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // // Lưu token vào localStorage (hoặc nơi bạn quản lý auth)
    // const { token } = response.data;
    // localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;  // Nếu thành công, trả về dữ liệu (thông thường là response.data)
    } catch (error) {
        console.error("Registration error:", error);
        
        if (error.response) {
            // Lỗi do server trả về, kiểm tra mã lỗi và dữ liệu lỗi
            const status = error.response.status;
            const errorData = error.response.data;
            
            if (status === 409) {
                // Lỗi email đã tồn tại
                throw new Error('Email đã tồn tại. Vui lòng sử dụng email khác!');
            } else {
                // Lỗi khác từ server
                throw new Error(errorData?.error || 'Đăng ký không thành công');
            }
        } else if (error.request) {
            // Nếu không có phản hồi từ server (ví dụ do mất kết nối)
            throw new Error('Lỗi kết nối với server. Vui lòng thử lại.');
        } else {
            // Lỗi khác, có thể là lỗi cấu hình hoặc lỗi khi gửi request
            throw new Error('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
        }
    }
};


const checkPayment = async (token) => {
    try {
      const response = await axios.post(`${API_URL}/check_payment`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      return response.data ;
    } catch (error) {
      console.error("Check error:", error);
      throw error;
    }
  }
  
  const updateData = async (token , payment) => {
   try {
      const response = await axios.post(`${API_URL}/update`, payment,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.message);
      return response.data ;
    } catch (error) {
      console.error("Check error:", error);
      throw error;
    }
  }
export { registerUser , loginUser , checkPayment,updateData };
