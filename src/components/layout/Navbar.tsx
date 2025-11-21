// ======================================
// 🔥 NAVBAR COMPLETO MODIFICADO
// ======================================

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Bell,
  User as UserIcon,
  Menu,
  Home,
  Tv,
  Gamepad2,
  TrendingUp,
  Film,
  Settings,
  LogOut,
  Crown,
  Sparkles,
} from "lucide-react";

import Avatar from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

import { getLiveStreams, type Stream } from "../../services/api/streamService";
import { getAllClips } from "../../services/api/clipService";

interface NotificationItem {
  id: string;
  title: string;
  type: "stream" | "clip";
  user: string;
  avatarUrl?: string;
  viewerCount?: number;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notificationItems, setNotificationItems] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading, signOut } = useAuth();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setUserMenu(false);
    setMobileMenu(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Cargar notificaciones → Streams en vivo + Clips nuevos
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);

        const [streams, clips] = await Promise.all([
          getLiveStreams(),
          getAllClips(),
        ]);

        const streamItems: NotificationItem[] = (streams || []).map((s: Stream) => ({
          id: s.id,
          title: s.title || "En directo",
          type: "stream",
          user: s.user?.username || "Streamer",
          avatarUrl: s.user?.avatarUrl,
          viewerCount: s.viewerCount || 0,
        }));

        const clipItems: NotificationItem[] = (clips || []).map((c: any) => ({
          id: c.id,
          title: c.title || "Nuevo Clip",
          type: "clip",
          user: c.streamer?.username || "Usuario",
          avatarUrl: c.streamer?.avatarUrl,
        }));

        setNotificationItems([...streamItems.slice(0, 5), ...clipItems.slice(0, 5)]);
      } catch (err) {
        console.error("❌ Error cargando notificaciones:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, []);

  const handleLogout = () => {
    signOut();
    setUserMenu(false);
    navigate("/");
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Tv, label: "Live", href: "/live" },
    { icon: Film, label: "Clips", href: "/clips" },
    { icon: Gamepad2, label: "Categories", href: "/categories" },
    { icon: TrendingUp, label: "Trending", href: "/trending" },
  ];

  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "Usuario");
  const displayHandle = user?.username || (user?.email ? user.email.split("@")[0] : "user");

  const showAuthButtons = !loading && !isAuthenticated;
  const showUserAvatar = !loading && isAuthenticated && !!user;

  return (
    <>
      {/* ================================ */}
      {/* NAVBAR */}
      {/* ================================ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
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

            {/* MIDDLE */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
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
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <Bell className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg py-2 z-50"
                    >
                      {/* HEADER */}
                      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="font-semibold text-white">Actividad Reciente</h3>
                        {loadingNotifications && (
                          <span className="text-xs text-slate-400">Cargando...</span>
                        )}
                      </div>

                      {notificationItems.length === 0 && (
                        <div className="px-4 py-4 text-sm text-slate-400">
                          Nada nuevo aún.
                        </div>
                      )}

                      {notificationItems.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            navigate(n.type === "stream" ? `/stream/${n.id}` : `/clip/${n.id}`);
                            setNotificationsOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-slate-700"
                        >
                          <Avatar size="sm" alt={n.user} src={n.avatarUrl} />
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <strong>{n.user}</strong>{" "}
                              {n.type === "stream" ? "está en vivo" : "subió un clip"}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{n.title}</p>
                          </div>

                          {n.type === "stream" && (
                            <span className="text-xs text-purple-300 font-semibold">
                              {n.viewerCount} viewers
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AUTH */}
              {loading && <div className="w-24 h-8 rounded-lg bg-slate-800 animate-pulse" />}

              {showAuthButtons && (
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
              )}

              {showUserAvatar && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu((prev) => !prev)}
                    className="p-2 rounded-lg hover:bg-slate-800"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-700">
                          <p className="text-sm font-semibold text-white">{displayName}</p>
                          <p className="text-xs text-slate-400">@{displayHandle}</p>
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

      {/* SIDEBAR */}
      <Sidebar open={mobileMenu} onClose={() => setMobileMenu(false)} />
    </>
  );
}
