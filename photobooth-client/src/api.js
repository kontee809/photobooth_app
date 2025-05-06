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
  // console.log(userData);
  
  try {
    await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export { registerUser , loginUser };
