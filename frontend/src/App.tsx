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
import HakkimizdaPage from './pages/HakkimizdaPage';
import ReportsPage from "./pages/RaporlarPage";
import AuthRoute from "./components/AuthRoute";
import MainLayout from "./components/MainLayout"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Giriş yapmamış kullanıcılar için herkese açık rotalar */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Sidebar'lı Korumalı Rotalar için Ana Layout */}
        <Route element={<AuthRoute><MainLayout /></AuthRoute>}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/depo-ekle" element={<DepoEkle />} />
            <Route path="/depolarim" element={<Depolarim />} />
            <Route path="/acik-depo-ekle" element={<AcikDepoEklePage />} /> {/* Bu rotayı buraya taşıdık */}
            <Route path="/hakkimizda" element={<HakkimizdaPage />} />
            <Route path="/raporlar" element={<ReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;