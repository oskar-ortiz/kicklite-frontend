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

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAVBAR SIEMPRE PRESENTE */}
      <Navbar />

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* STREAM INDIVIDUAL + CHAT */}
        <Route path="/stream/:id" element={<StreamPage />} />

        {/* SECCIONES */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* NUEVAS RUTAS */}
        <Route path="/live" element={<LivePage />} />
        <Route path="/trending" element={<TrendingPage />} />

        {/* RUTA DESCONOCIDA */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
