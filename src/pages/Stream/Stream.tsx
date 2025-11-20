import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/api.config";
import { Stream } from "../../types/stream.types";

export default function StreamPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStream = async () => {
      try {
        const res = await api.get(`/streams/${id}`);
        setStream(res.data);
      } catch (err) {
        setError("No se pudo cargar el stream.");
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando stream...
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Stream no encontrado"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">{stream.title}</h1>

        <div className="mb-6">
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full max-w-4xl mx-auto rounded-lg"
          />
        </div>

        <p className="text-slate-300">{stream.description}</p>

        <div className="mt-6 text-slate-500">
          Streamer: <strong>{stream.streamer.username}</strong>
        </div>
      </div>
    </div>
  );
}
