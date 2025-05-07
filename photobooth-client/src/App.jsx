import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebcamCapture from './component/Camera';
import Header from './component/Header';
import Home from './component/Home';
import Footer from './component/Footer';
import RegisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';
import WebCamAI from './component/Camera_AI';
import { AuthProvider } from './Context/AuthContext';  // Import AuthProvider
import backgroundImage from './assets/background.jpg';

import PrivateRoute from './component/PrivateRoute';
import PublicOnlyRoute from './component/PublicOnlyRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Di chuyển AuthProvider ra ngoài Routes */}
        <div className="backdrop-blur-md min-h-screen" style={{backgroundImage: `url(${backgroundImage})`}}>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={
              <PrivateRoute>
                <WebcamCapture />
              </PrivateRoute>
              
            } />
            <Route path='/sign-up' element={
              <PublicOnlyRoute>
                <RegisterForm />
              </PublicOnlyRoute>
              
            } />

            <Route path='/sign-in' element={
              <PublicOnlyRoute>
                <LoginForm />
              </PublicOnlyRoute>
              
            } />

            <Route path='/camera-ai' element={
              <WebCamAI />
            }/>
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
