import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  Menu,
  X, 
  Home,
  Tv,
  Gamepad2,
  TrendingUp,
  Settings,
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Tv, label: 'Live', href: '/live', badge: '24K' },
    { icon: Gamepad2, label: 'Categories', href: '/categories' },
    { icon: TrendingUp, label: 'Trending', href: '/trending' },
  ];

  // ✅ NOTIFICACIONES SIN IMÁGENES ROTAS
  const notificationsList = [
    { id: 1, user: 'TheKing', action: 'está en vivo', time: '2m', emoji: '👑' },
    { id: 2, user: 'ProGamer', action: 'te mencionó', time: '15m', emoji: '🎮' },
    { id: 3, user: 'StreamQueen', action: 'te siguió', time: '1h', emoji: '👸' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMobileMenu(!mobileMenu)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold text-white">streamora</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-white/60 rounded border border-white/20">
                  space
                </span>
              </Link>
            </div>

            {/* Center - Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right side - Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:block relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-64 bg-slate-800/50 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />
                </button>

                <AnimatePresence>
                  {notifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-700">
                        <h3 className="font-semibold text-white">Notificaciones</h3>
                      </div>
                      {notificationsList.map((notification) => (
                        <button
                          key={notification.id}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-700 transition-colors"
                        >
                          {/* ✅ EMOJI EN LUGAR DE IMAGEN ROTA */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl flex-shrink-0">
                            {notification.emoji}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm text-white">
                              <span className="font-semibold">{notification.user}</span>{' '}
                              {notification.action}
                            </p>
                            <p className="text-xs text-slate-400">hace {notification.time}</p>
                          </div>
                        </button>
                      ))}
                      <div className="px-4 py-2 border-t border-slate-700 text-center">
                        <Link 
                          to="/notifications" 
                          className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                          onClick={() => setNotifications(false)}
                        >
                          Ver todas
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenu(!userMenu)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <User className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white">Usuario</p>
                        <p className="text-xs text-slate-400">@usuario</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-white hover:bg-slate-700"
                        onClick={() => setUserMenu(false)}
                      >
                        <Crown className="inline-block w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-white hover:bg-slate-700"
                        onClick={() => setUserMenu(false)}
                      >
                        <Settings className="inline-block w-4 h-4 mr-2" />
                        Configuración
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                      >
                        <LogOut className="inline-block w-4 h-4 mr-2" />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-16 left-0 bottom-0 w-64 bg-slate-900 z-40 border-r border-white/5"
          >
            <div className="py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-3"
                  onClick={() => setMobileMenu(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {(mobileMenu || userMenu || notifications) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setMobileMenu(false);
              setUserMenu(false);
              setNotifications(false);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
}