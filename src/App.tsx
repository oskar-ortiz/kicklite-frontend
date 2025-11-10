import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-system">
        <Navbar />
        <main className="pt-20">
          <Home />
        </main>
      </div>
    </Router>
  );
}

export default App;