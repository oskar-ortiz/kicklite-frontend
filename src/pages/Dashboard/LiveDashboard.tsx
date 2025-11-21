// src/pages/Dashboard/LiveDashboard.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Radio,
  Eye,
  Settings,
  Image as ImageIcon,
  MonitorPlay,
  Copy,
  CheckCircle,
  Video,
} from "lucide-react";

import { api, API_ENDPOINTS } from "../../services/api/api.config";
import { getCategories, type Category } from "../../services/api/streamService";

// INTERFAZ DEL STREAM
interface StreamData {
  id: string;
  title: string;
  categoryId?: string;
  category?: string;
  thumbnailUrl?: string;
  isLive?: boolean;
  viewerCount?: number;
  rtmpUrl: string; // no se usa con vdo.ninja, pero se deja para compatibilidad
  streamKey: string;
}

export default function LiveDashboard() {
  const { streamId } = useParams();

  const [stream, setStream] = useState<StreamData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // ============================================================
  // CARGAR DATOS DEL STREAM
  // ============================================================
  useEffect(() => {
    const load = async () => {
      try {
        const [streamRes, cats] = await Promise.all([
          api.get(API_ENDPOINTS.streams.byId(streamId!)),
          getCategories(),
        ]);

        const s = streamRes.data.stream ?? streamRes.data;

        const formatted: StreamData = {
          id: s.id,
          title: s.title,
          categoryId: s.categoryId,
          category: s.category?.name,
          thumbnailUrl: s.thumbnailUrl,
          isLive: s.isLive,
          viewerCount: s.viewerCount,
          rtmpUrl: s.rtmpUrl,
          streamKey: s.streamKey,
        };

        setStream(formatted);
        setTitle(formatted.title);
        setCategory(formatted.categoryId || "");
        setThumbPreview(formatted.thumbnailUrl || null);
        setCategories(cats);
      } catch {
        console.error("Error cargando stream");
      } finally {
        setLoading(false);
      }
    };

    if (streamId) load();
  }, [streamId]);

  // ============================================================
  // COPIAR TEXTO
  // ============================================================
  const copyValue = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  // ============================================================
  // GUARDAR CONFIGURACIÓN
  // ============================================================
  const save = async () => {
    if (!stream) return;
    setSaving(true);

    try {
      await api.patch(API_ENDPOINTS.streams.byId(stream.id), {
        title,
        categoryId: category,
        thumbnailUrl: thumbPreview,
      });

      setStream({
        ...stream,
        title,
        categoryId: category,
        category:
          categories.find((c) => c.id === category)?.name ||
          stream.category,
      });
    } catch {
      console.error("Error guardando configuración");
    }

    setSaving(false);
  };

  // ============================================================
  // INICIAR / DETENER DIRECTO
  // ============================================================
  const toggleLive = async () => {
    if (!stream) return;

    setLiveLoading(true);

    try {
      if (stream.isLive) {
        await api.post(API_ENDPOINTS.streams.end, { streamId });
        setStream({ ...stream, isLive: false });
      } else {
        await api.post(API_ENDPOINTS.streams.start, { streamId });
        setStream({ ...stream, isLive: true });
      }
    } catch {
      console.error("Error iniciando / deteniendo stream");
    }

    setLiveLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando panel...
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center">
        ❌ Stream no encontrado
      </div>
    );
  }

  // ============================================================
  // UI PRINCIPAL
  // ============================================================
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Emisión</h1>

        <button
          onClick={toggleLive}
          disabled={liveLoading}
          className={`px-5 py-2 rounded-lg font-semibold ${
            stream.isLive ? "bg-red-600" : "bg-green-500"
          }`}
        >
          {liveLoading
            ? "Actualizando..."
            : stream.isLive
            ? "Detener directo"
            : "Iniciar directo"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================== PREVIEW ================== */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-4">
          <h2 className="flex items-center gap-2 text-slate-300 mb-2 text-sm">
            <MonitorPlay className="w-4 h-4" />
            Vista previa del stream (VDO.Ninja)
          </h2>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
            {stream.isLive ? (
              <iframe
                src={`https://vdo.ninja/?view=${stream.id}&cleanoutput&autostart`}
                width="100%"
                height="100%"
                allow="camera; microphone; fullscreen"
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="text-center text-slate-400 flex items-center justify-center w-full h-full">
                Stream offline — inicia la transmisión desde OBS.
              </div>
            )}
          </div>

          <div className="mt-3 text-slate-400 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {stream.viewerCount ?? 0} espectadores
          </div>
        </div>

        {/* ================== CONFIG ================== */}
        <div className="space-y-4">

          {/* VDO.NINJA LINKS */}
          <div className="bg-slate-900 p-4 rounded-xl border border-white/10 space-y-3">
            <h2 className="text-sm flex items-center gap-2 text-slate-300">
              <Video className="w-4 h-4" /> Enlaces VDO.Ninja
            </h2>

            {/* PUSH LINK */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Enlace para OBS (Push)</p>
              <div className="bg-slate-800 px-3 py-2 rounded-lg flex items-center justify-between">
                <span className="text-purple-300 text-xs select-none">
                  {`https://vdo.ninja/?push=${stream.id}`}
                </span>
                <button
                  onClick={() =>
                    copyValue(`https://vdo.ninja/?push=${stream.id}`, "push")
                  }
                >
                  {copied === "push" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* VIEW LINK */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Enlace para ver directo</p>
              <div className="bg-slate-800 px-3 py-2 rounded-lg flex items-center justify-between">
                <span className="text-purple-300 text-xs select-none">
                  {`https://vdo.ninja/?view=${stream.id}&cleanoutput&autostart`}
                </span>
                <button
                  onClick={() =>
                    copyValue(
                      `https://vdo.ninja/?view=${stream.id}&cleanoutput&autostart`,
                      "view"
                    )
                  }
                >
                  {copied === "view" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* STREAM SETTINGS */}
          <div className="bg-slate-900 p-4 rounded-xl border border-white/10 space-y-4">
            <h2 className="text-sm flex items-center gap-2 text-slate-300">
              <Settings className="w-4 h-4" /> Detalles del stream
            </h2>

            {/* Title */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Título</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
              />
            </div>

            {/* Category */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Categoría</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Thumbnail</p>
              <button
                className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg"
                onClick={() => setThumbPreview(null)}
              >
                <ImageIcon className="w-4 h-4" />
                Generar nuevo thumbnail (placeholder)
              </button>
            </div>

            {/* Save */}
            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-purple-600 py-2 rounded-lg font-semibold"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
