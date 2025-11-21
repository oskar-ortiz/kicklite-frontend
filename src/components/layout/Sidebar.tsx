// ======================================
// 🔥 SIDEBAR COMPLETO MODIFICADO
// ======================================

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Home,
  Tv,
  Film,
  Radio,
  Users,
  X,
} from "lucide-react";

import {
  getLiveStreams,
  type Stream,
} from "../../services/api/streamService";

import { getAllClips } from "../../services/api/clipService";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos al abrir
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [streams, clipsData] = await Promise.all([
          getLiveStreams(),
          getAllClips(),
        ]);

        setLiveStreams(streams || []);
        setClips(clipsData || []);
      } catch (err) {
        console.error("❌ Error cargando Sidebar:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadData();
  }, [open]);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Tv, label: "Live", href: "/live" },
    { icon: Film, label: "Clips", href: "/clips" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed top-0 left-0 bottom-0 w-64 bg-slate-950/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                S
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">
                  streamora
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-wide">
                  space
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* NAV LINKS */}
          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-purple-600/80 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ======================== */}
          {/* 🔴 STREAMS EN VIVO */}
          {/* ======================== */}
          <div className="px-4 pt-2 pb-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wide">
                <Radio className="w-3 h-3 text-red-400" />
                <span>Canales en vivo</span>
              </div>
              {loading && (
                <span className="text-[10px] text-slate-500">Cargando...</span>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {liveStreams.length === 0 && !loading && (
                <p className="text-xs text-slate-500">
                  No hay streams en vivo en este momento.
                </p>
              )}

              {liveStreams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => {
                    onClose();
                    navigate(`/stream/${stream.id}`);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">
                    {stream.user?.username?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">
                      {stream.user?.username || "Streamer"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {stream.title || "En directo"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] text-slate-300">
                      {stream.viewerCount?.toLocaleString("es-ES") || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ======================== */}
          {/* 🎬 CLIPS RECIENTES */}
          {/* ======================== */}
          <div className="px-4 pb-4 border-t border-white/10 mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wide mb-3">
              <Film className="w-3 h-3 text-purple-400" />
              <span>Clips recientes</span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {clips.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  Sin clips aún.
                </p>
              ) : (
                clips.slice(0, 8).map((clip) => (
                  <button
                    key={clip.id}
                    onClick={() => {
                      onClose();
                      navigate(`/clip/${clip.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-800 text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center text-white text-xs">
                      🎬
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{clip.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {clip.streamer?.username || "Usuario"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
