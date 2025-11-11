import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Stream from './pages/Stream/Stream';
import Categories from './pages/Categories/Categories';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
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