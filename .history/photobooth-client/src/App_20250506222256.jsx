import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebcamCapture from './component/Camera';
import Header from './component/Header';
import Home from './component/Home';
import Footer from './component/Footer';
import RegisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';
import { AuthProvider } from './Context/AuthContext';  // Import AuthProvider
import backgroundImage from '../';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Di chuyển AuthProvider ra ngoài Routes */}
        <div className="backdrop-blur-md min-h-screen" style={{backgroundImage: }}>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={<WebcamCapture />} />
            <Route path='/sign-up' element={<RegisterForm />} />
            <Route path='/sign-in' element={<LoginForm />} />
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
