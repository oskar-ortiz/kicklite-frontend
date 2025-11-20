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
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Tv, label: 'Live', href: '/live', badge: '24K' },
    { icon: Gamepad2, label: 'Categories', href: '/categories' },
    { icon: TrendingUp, label: 'Trending', href: '/trending' },
  ];

  const notificationsList = [
    { id: 1, user: 'TheKing', action: 'está en vivo', time: '2m' },
    { id: 2, user: 'ProGamer', action: 'te mencionó', time: '15m' },
    { id: 3, user: 'StreamQueen', action: 'te siguió', time: '1h' },
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
            
            {/* Logo + Menu */}
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

            {/* Nav links */}
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

            {/* SEARCH + ACCOUNT AREA */}
            <div className="flex items-center space-x-4">

              {/* SEARCH BAR */}
              <div className="hidden sm:block relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-64 bg-slate-800/50 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              {/* NOTIFICATIONS */}
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
                          <Avatar size="sm" alt={notification.user} />
                          <div className="flex-1 text-left">
                            <p className="text-sm text-white">
                              <span className="font-semibold">{notification.user}</span>{' '}
                              {notification.action}
                            </p>
                            <p className="text-xs text-slate-400">hace {notification.time}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ----------- ACCOUNT AREA ------------ */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">

                  <Link
                    to="/login"
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-medium"
                  >
                    Iniciar Sesión
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-semibold shadow-md"
                  >
                    Registrarse
                  </Link>

                </div>
              ) : (
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
                          <p className="text-sm font-semibold text-white">
                            {user?.username}
                          </p>
                          <p className="text-xs text-slate-400">
                            @{user?.email?.split("@")[0]}
                          </p>
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
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-2" />
                          Cerrar sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
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
