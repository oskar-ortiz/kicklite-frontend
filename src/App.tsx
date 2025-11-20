import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Stream from './pages/Stream/Stream';
import Categories from './pages/Categories/Categories';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const { loading } = useAuth();

  // ✅ Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stream/:id" element={<Stream />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;