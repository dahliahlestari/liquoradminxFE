import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import KelolaProduk from "./components/KelolaProduk";
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  // Fungsi untuk update token dari child (misalnya dari AdminLogin)
  const handleLogin = () => {
    setToken(localStorage.getItem("adminToken"));
  };

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/produk" />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />

        {/* Route Kelola Produk, dilindungi */}
        <Route
          path="/produk"
          element={
            token ? (
              <AdminLayout onLogout={handleLogout}>
                <KelolaProduk token={token} />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect ke login kalau route tidak dikenali */}
        <Route
          path="*"
          element={<Navigate to={token ? "/produk" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
