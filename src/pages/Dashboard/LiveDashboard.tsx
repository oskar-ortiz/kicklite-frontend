import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Copy,
  Radio,
  CheckCircle,
  Video,
  Eye,
  Settings,
  MonitorPlay,
  Image as ImageIcon,
} from "lucide-react";

import { api, API_ENDPOINTS } from "../../services/api/api.config";
import { getCategories, type Category } from "../../services/api/streamService";

interface StreamData {
  id: string;
  title: string;
  category?: string;
  categoryId?: string;
  thumbnailUrl?: string;
  rtmpUrl: string;
  streamKey: string;
  isLive?: boolean;
  viewerCount?: number;
}

export default function LiveDashboard() {
  const { streamId } = useParams();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!streamId) return;
      setLoading(true);

      try {
        // Cargar stream + categorías en paralelo
        const [streamRes, cats] = await Promise.all([
          api.get(API_ENDPOINTS.streams.byId(streamId)),
          getCategories(),
        ]);

        const s = streamRes.data.stream || streamRes.data;

        const formattedStream: StreamData = {
          id: s.id,
          title: s.title || "Mi nuevo stream",
          category: s.category?.name || s.category || "",
          categoryId: s.category?.id || s.categoryId || "",
          thumbnailUrl: s.thumbnailUrl,
          rtmpUrl: s.rtmpUrl,
          streamKey: s.streamKey,
          isLive: s.isLive ?? false,
          viewerCount: s.viewerCount ?? 0,
        };

        setStream(formattedStream);
        setTitleInput(formattedStream.title);
        setCategoryInput(formattedStream.categoryId || "");
        setThumbPreview(formattedStream.thumbnailUrl || null);
        setCategories(cats || []);
      } catch (err) {
        console.error("❌ Error cargando panel de stream:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [streamId]);

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSaveSettings = async () => {
    if (!stream || !streamId) return;

    try {
      setSaving(true);

      const payload: any = {
        title: titleInput,
      };

      if (categoryInput) {
        payload.categoryId = categoryInput;
      }

      if (thumbPreview) {
        payload.thumbnailUrl = thumbPreview;
      }

      // PATCH al mismo endpoint del byId
      await api.patch(API_ENDPOINTS.streams.byId(streamId), payload);

      setStream((prev) =>
        prev
          ? {
              ...prev,
              title: titleInput,
              categoryId: categoryInput || prev.categoryId,
              category:
                categories.find((c) => c.id === categoryInput)?.name ||
                prev.category,
              thumbnailUrl: thumbPreview || prev.thumbnailUrl,
            }
          : prev
      );
    } catch (err) {
      console.error("❌ Error guardando configuración del stream:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLive = async () => {
    if (!stream || !streamId) return;

    try {
      setLiveLoading(true);

      if (stream.isLive) {
        // Detener stream
        await api.post(API_ENDPOINTS.streams.end, { streamId });
        setStream((prev) => (prev ? { ...prev, isLive: false } : prev));
      } else {
        // Iniciar stream (por si se vuelve a activar)
        await api.post(API_ENDPOINTS.streams.start, { streamId });
        setStream((prev) => (prev ? { ...prev, isLive: true } : prev));
      }
    } catch (err) {
      console.error("❌ Error cambiando estado del stream:", err);
    } finally {
      setLiveLoading(false);
    }
  };

  // Genera un thumbnail "falso" bonito para vista previa,
  // hasta que el backend envie uno real.
  const handleGenerateThumbnail = () => {
    const gradients = [
      "linear-gradient(135deg, #6366f1, #ec4899)",
      "linear-gradient(135deg, #14b8a6, #06b6d4)",
      "linear-gradient(135deg, #f97316, #ec4899)",
      "linear-gradient(135deg, #22c55e, #3b82f6)",
    ];
    const random = gradients[Math.floor(Math.random() * gradients.length)];

    // Usamos un data URL simple como placeholder visual
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // fondo gradiente
      const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grd.addColorStop(0, "#0f172a");
      grd.addColorStop(1, "#1e293b");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // recuadro central simulando player
      ctx.fillStyle = "#111827aa";
      ctx.fillRect(200, 120, 880, 480);

      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 4;
      ctx.strokeRect(200, 120, 880, 480);

      // triángulo play
      ctx.fillStyle = "#e5e7eb";
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY - 50);
      ctx.lineTo(centerX + 60, centerY);
      ctx.lineTo(centerX - 40, centerY + 50);
      ctx.closePath();
      ctx.fill();

      // titulo
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "bold 40px system-ui";
      ctx.fillText(titleInput || "Mi stream increíble", 210, 640);
    }

    const url = canvas.toDataURL("image/png");
    setThumbPreview(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-300 text-lg">
          Cargando panel de emisión...
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-red-400 text-lg">
          ❌ No se encontró el stream
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Panel de Emisión</h1>
            <p className="text-slate-400 mt-1">
              Configura tu directo igual que en Kick antes de salir en vivo.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleToggleLive}
            disabled={liveLoading}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all ${
              stream.isLive
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/40"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-emerald-500/40"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <Radio className="w-5 h-5" />
            {liveLoading
              ? "Actualizando..."
              : stream.isLive
              ? "Finalizar Stream"
              : "Go Live"}
          </motion.button>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
          {/* IZQUIERDA: PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 md:p-6 relative overflow-hidden"
          >
            {/* glow */}
            <div className="pointer-events-none absolute -inset-1 bg-gradient-to-br from-purple-600/30 via-transparent to-blue-500/30 opacity-40 blur-2xl" />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-300">
                    Vista previa del stream
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Eye className="w-4 h-4" />
                    <span>{stream.viewerCount ?? 0} espectadores</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                      stream.isLive
                        ? "bg-red-600 text-white"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {stream.isLive ? "EN VIVO" : "Esperando señal"}
                  </span>
                </div>
              </div>

              {/* Player fake / preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/80 border border-white/10 flex items-center justify-center">
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-slate-900 to-blue-700/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                        <MonitorPlay className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-slate-200 text-sm">
                        Esperando señal de tu OBS/Software de streaming...
                      </p>
                      <p className="text-slate-400 text-xs">
                        Usa la URL RTMP y la Stream Key de abajo para conectar.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* DERECHA: CONFIG */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* RTMP INFO */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-5 h-5 text-green-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Configuración de emisión
                </h2>
              </div>

              <div className="space-y-3">
                {/* RTMP URL */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    RTMP URL
                  </label>
                  <div className="flex items-center bg-slate-800 px-3 py-2 rounded-lg border border-white/10">
                    <span className="flex-1 text-xs break-all text-purple-200">
                      {stream.rtmpUrl}
                    </span>
                    <button
                      onClick={() => handleCopy(stream.rtmpUrl, "rtmp")}
                      className="ml-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                    >
                      {copied === "rtmp" ? (
                        <CheckCircle className="w-4 h-4 text-green-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* STREAM KEY */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Stream Key
                  </label>
                  <div className="flex items-center bg-slate-800 px-3 py-2 rounded-lg border border-white/10">
                    <span className="flex-1 text-xs break-all text-purple-200 select-none">
                      {stream.streamKey}
                    </span>
                    <button
                      onClick={() => handleCopy(stream.streamKey, "key")}
                      className="ml-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                    >
                      {copied === "key" ? (
                        <CheckCircle className="w-4 h-4 text-green-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STREAM SETTINGS */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 md:p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Detalles del stream
                </h2>
              </div>

              {/* TÍTULO */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Título del stream
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Título atractivo para tu directo"
                />
              </div>

              {/* CATEGORÍA */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Categoría
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* THUMBNAIL */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Thumbnail / Portada
                </label>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateThumbnail}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Generar thumbnail
                  </button>

                  {thumbPreview && (
                    <span className="text-xs text-slate-400">
                      Vista previa actual aplicada
                    </span>
                  )}
                </div>
              </div>

              {/* BOTÓN GUARDAR */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-sm shadow-lg shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando cambios..." : "Guardar configuración"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
