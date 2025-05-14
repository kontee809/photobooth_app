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
import FrameAI from './component/FrameAI';
import CheckPayment from './component/CheckPayment';
import Payment from './component/Payment';
import DonePayment from './component/DonePayment';

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
              <PrivateRoute>
                <CheckPayment>
                  <WebCamAI />
                </CheckPayment>
              </PrivateRoute>
              
            }/>

            <Route path='/frame' element={
              <FrameAI />
            }/>

            <Route path='/payment' element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            } />

            <Route path='/done-payment' element={
              <PrivateRoute>
                <DonePayment />
              </PrivateRoute>
            }/>
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
