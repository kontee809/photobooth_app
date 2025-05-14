import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { checkPayment } from '../api';

const CheckPayment = ({ children }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (token) {
        try {
          const res = await checkPayment(token);
          
          // Nếu API trả về "premium access"
          if (res.message === "User ti has premium access.") {
            // Nếu đã thanh toán, cho phép truy cập
            navigate('/camera-ai');
          } 
        } catch (error) {
          navigate('/payment');
          console.error('Lỗi kiểm tra thanh toán:', error);
        }
      }
    };

    checkPaymentStatus();
  }, [token, navigate]);

  return <>{children}</>; // Render lại các component bên trong nếu thanh toán hợp lệ
};

export default CheckPayment;
