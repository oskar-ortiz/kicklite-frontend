import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home/Home";
import StreamPage from "./pages/Stream/Stream";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stream/:id" element={<StreamPage />} />

        {/* Puedes agregar más rutas luego */}
      </Routes>
    </div>
  );
}
