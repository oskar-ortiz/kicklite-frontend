// src/App.tsx
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

// Páginas principales
import Home from "./pages/Home/Home";
import StreamPage from "./pages/Stream/Stream";

// Listado general de contenido (Live = Clips en tu versión)
import LivePage from "./pages/Live/Live";

// Clips
import ClipsPage from "./pages/Clips/ClipsPage";
import ClipPage from "./pages/Clips/ClipPage";
import UploadClip from "./pages/Clips/UploadClip";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import LiveDashboard from "./pages/Dashboard/LiveDashboard";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAVBAR GLOBAL */}
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* STREAM EN VIVO */}
        <Route path="/stream/:id" element={<StreamPage />} />

        {/* CLIPS */}
        <Route path="/clips" element={<ClipsPage />} />
        <Route path="/clip/:id" element={<ClipPage />} />

        {/* SUBIR CLIP */}
        <Route path="/clips/upload" element={<UploadClip />} />

        {/* LISTADO DE CONTENIDO (ANTES LIVE STREAMS) */}
        <Route path="/live" element={<LivePage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/live/:streamId"
          element={<LiveDashboard />}
        />

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
