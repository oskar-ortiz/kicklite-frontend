// src/App.tsx

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

// Páginas principales
import Home from "./pages/Home/Home";
import StreamPage from "./pages/Stream/Stream";
import Categories from "./pages/Categories/Categories";
import Dashboard from "./pages/Dashboard/Dashboard";

// Páginas nuevas
import LivePage from "./pages/Live/Live";
import TrendingPage from "./pages/Trending/Trending";

// 🔥 RUTAS DE AUTENTICACIÓN (AGREGADO)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAVBAR */}
      <Navbar />

      {/* RUTAS */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* STREAM INDIVIDUAL */}
        <Route path="/stream/:id" element={<StreamPage />} />

        {/* SECCIONES */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/trending" element={<TrendingPage />} />

        {/* 🔥 LOGIN & REGISTER */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RUTA DESCONOCIDA */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
