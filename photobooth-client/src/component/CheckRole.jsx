import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';


const CheckRole = ({children}) => {
  const { role } = useContext(AuthContext)

  return role === "admin" ? children : <Navigate to="/" replace />;
};

export default CheckRole;
