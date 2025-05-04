import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebcamCapture from './component/Camera';
import Header from './component/Header';
import Home from './component/Home';
import Footer from './component/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#ffadb1]/60 backdrop-blur-md min-h-screen">
        <Header />

        {/* Bọc các Route bên trong Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<WebcamCapture />} />
          <
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
