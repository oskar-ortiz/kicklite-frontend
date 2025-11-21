import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

// Páginas principales
import Home from "./pages/Home/Home";
import StreamPage from "./pages/Stream/Stream"; // soporta stream + clip
import LivePage from "./pages/Live/Live";

// Clips
import ClipsPage from "./pages/Clips/ClipsPage.tsx";
import ClipPage from "./pages/Clips/ClipPage.tsx";
import UploadClip from "./pages/Clips/UploadClip.tsx";  // 👈 NUEVA RUTA

// Categorías (si deseas dejarlo aunque no tenga vida)
import Categories from "./pages/Categories/Categories";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import LiveDashboard from "./pages/Dashboard/LiveDashboard";

// Trending (opcional)
import TrendingPage from "./pages/Trending/Trending";

// Autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAVBAR GLOBAL */}
      <Navbar />

      {/* RUTAS */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* STREAM O CLIP (STREAMPAGE SOPORTA AMBOS) */}
        <Route path="/stream/:id" element={<StreamPage />} />
        <Route path="/clip/:id" element={<StreamPage />} />

        {/* LISTADO DE STREAMS (LIVE) */}
        <Route path="/live" element={<LivePage />} />

        {/* CLIPS */}
        <Route path="/clips" element={<ClipsPage />} />
        <Route path="/clip/:id" element={<ClipPage />} />

        {/* 🔥 SUBIR CLIP */}
        <Route path="/clips/upload" element={<UploadClip />} />  {/* ⬅ ESTA ES LA RUTA QUE PEDISTE */}

        {/* CATEGORIES / TRENDING (SIN VIDA SI QUIERES) */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/trending" element={<TrendingPage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/live/:streamId" element={<LiveDashboard />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
