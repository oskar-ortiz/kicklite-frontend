import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, API_ENDPOINTS } from "../../services/api/api.config";
import { motion } from "framer-motion";
import { Copy, Radio, CheckCircle } from "lucide-react";

interface StreamData {
  id: string;
  rtmpUrl: string;
  streamKey: string;
  isLive?: boolean;
}

export default function LiveDashboard() {
  const { streamId } = useParams();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStream = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.streams.byId(streamId!));
        setStream(res.data.stream || res.data);
      } catch (err) {
        console.error("❌ Error cargando stream:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [streamId]);

  const copy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading)
    return (
      <div className="text-center text-white p-10 text-xl">
        Cargando panel de stream...
      </div>
    );

  if (!stream)
    return (
      <div className="text-center text-red-400 p-10 text-xl">
        ❌ No se encontró el stream
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Panel de Emisión</h1>

        <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Radio className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-semibold">
              Configuración de Streaming
            </h2>
          </div>

          {/* RTMP URL */}
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-1">RTMP URL</label>
            <div className="flex items-center bg-slate-800 px-4 py-3 rounded-lg border border-white/10">
              <span className="flex-1 break-all text-purple-300">
                {stream.rtmpUrl}
              </span>

              <button
                onClick={() => copy(stream.rtmpUrl, "rtmp")}
                className="ml-3 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {copied === "rtmp" ? (
                  <CheckCircle className="w-5 h-5 text-green-300" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* STREAM KEY */}
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-1">
              Stream Key
            </label>
            <div className="flex items-center bg-slate-800 px-4 py-3 rounded-lg border border-white/10">
              <span className="flex-1 break-all text-purple-300 select-none">
                {stream.streamKey}
              </span>

              <button
                onClick={() => copy(stream.streamKey, "key")}
                className="ml-3 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {copied === "key" ? (
                  <CheckCircle className="w-5 h-5 text-green-300" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Estado */}
          <div className="mt-8 flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                stream.isLive ? "bg-green-400" : "bg-slate-600"
              }`}
            />
            <span className="text-slate-300">
              {stream.isLive ? "Tu stream está en vivo" : "Esperando señal..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
