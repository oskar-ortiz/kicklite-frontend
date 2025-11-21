// src/pages/Clips/UploadClip.tsx
import { useState } from "react";
import { api } from "../../services/api/api.config";
import { useNavigate } from "react-router-dom";

export default function UploadClip() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("file", file);

      await api.post("/api/clips/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/clips");
    } catch (err) {
      console.error("Error subiendo clip:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-6">
      <h1 className="text-white text-3xl font-bold mb-6">Subir Clip</h1>

      <div className="max-w-xl space-y-4">
        <input
          type="text"
          placeholder="Título del clip"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-white/10"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/mp4"
          className="text-white"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white"
        >
          {loading ? "Subiendo…" : "Subir Clip"}
        </button>
      </div>
    </div>
  );
}
