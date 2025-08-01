// src/components/AuthRoute.js (veya PrivateRoute.js)

import React from "react";
import { Navigate } from "react-router-dom";

// Bu bileşen, bir prop olarak child (korumalı sayfa) alacak.
const AuthRoute = ({ children }) => {
  // `localStorage`'dan token'ı alıyoruz
  const token = localStorage.getItem("token");

  // Eğer token varsa, çocuk bileşeni (korumalı sayfa) render et
  if (token) {
    return children;
  }

  // Eğer token yoksa, kullanıcıyı "/login" sayfasına yönlendir
  return <Navigate to="/" replace />;
};

export default AuthRoute;