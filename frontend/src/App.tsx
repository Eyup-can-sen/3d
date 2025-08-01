// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DepoEkle from './pages/depo-ekle';
import Depolarim from './pages/depolarim'
import AcikDepoEklePage from "./pages/acik-depo-ekle";

// AuthRoute bileşenini import edin
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Giriş yapmamış kullanıcılar için herkese açık rotalar */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/acik-depo-ekle" element={<AcikDepoEklePage />} />
        {/* Giriş yapmış kullanıcılar için korumalı rotalar */}
        <Route
          path="/home"
          element={
            <AuthRoute>
              <HomePage />
            </AuthRoute>
          }
        />

        <Route
          path="/depo-ekle"
          element={
            <AuthRoute>
              <DepoEkle />
            </AuthRoute>
          }
        />

        <Route
          path="/depolarim"
          element={
            <AuthRoute>
              <Depolarim />
            </AuthRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;