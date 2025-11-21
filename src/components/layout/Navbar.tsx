import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Bell,
  User,
  Menu,
  Home,
  Tv,
  Gamepad2,
  TrendingUp,
  Settings,
  LogOut,
  Crown,
  Sparkles,
} from "lucide-react";

import Avatar from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import {
  getLiveStreams,
  type Stream,
} from "../../services/api/streamService";

interface NotificationItem {
  id: string;
  user: string;
  title: string;
  viewerCount: number;
  avatarUrl?: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notificationItems, setNotificationItems] =
    useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Notificaciones reales
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const liveStreams: Stream[] = await getLiveStreams();

        const mapped: NotificationItem[] = (liveStreams || []).map((s) => ({
          id: s.id,
          user: s.user?.username || "Streamer",
          title: s.title || "En directo",
          viewerCount: s.viewerCount || 0,
          avatarUrl: s.user?.avatarUrl,
        }));

        setNotificationItems(mapped);
      } catch (err) {
        console.error("❌ Error cargando notificaciones:", err);
        setNotificationItems([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Tv, label: "Live", href: "/live", badge: "24K" },
    { icon: Gamepad2, label: "Categories", href: "/categories" },
    { icon: TrendingUp, label: "Trending", href: "/trending" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenu(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link to="/" className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold text-white">streamora</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-white/60 rounded border border-white/20">
                  space
                </span>
              </Link>
            </div>

            {/* CENTER NAV */}
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

            {/* RIGHT */}
            <div className="flex items-center space-x-4">
              {/* SEARCH */}
              <div className="hidden sm:block relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-48 lg:w-64 bg-slate-800/50 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              {/* NOTIFICATIONS */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <Bell className="h-5 w-5" />
                </button>

                {/* NOTIFICATION DROPDOWN */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="font-semibold text-white">
                          Canales en vivo
                        </h3>
                      </div>

                      {notificationItems.length === 0 && (
                        <p className="px-4 py-3 text-slate-400 text-sm">
                          No hay canales en vivo.
                        </p>
                      )}

                      {notificationItems.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate(`/stream/${n.id}`);
                          }}
                          className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-slate-700"
                        >
                          <Avatar size="sm" alt={n.user} src={n.avatarUrl} />
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <strong>{n.user}</strong>{" "}
                              <span className="text-slate-300">está en vivo</span>
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {n.title}
                            </p>
                          </div>
                          <span className="text-xs text-purple-300 font-semibold">
                            {n.viewerCount.toLocaleString("es-ES")} viewers
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AUTH ZONE */}
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="p-2 rounded-lg hover:bg-slate-800"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
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
                            @{user?.email.split("@")[0]}
                          </p>
                        </div>

                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-white hover:bg-slate-700"
                        >
                          <Crown className="inline-block w-4 h-4 mr-2" />
                          Dashboard
                        </Link>

                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-white hover:bg-slate-700"
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

      {/* SIDEBAR MOBILE */}
      <Sidebar open={mobileMenu} onClose={() => setMobileMenu(false)} />

      {/* OVERLAY */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}
