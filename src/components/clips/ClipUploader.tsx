// ===================================================
// 🔥 CLIP UPLOADER (TIPADO + EXPORTS) COMPLETO
// ===================================================

import React, { useRef } from "react";

interface ClipUploaderProps {
  onUploaded: () => void;
}

export default function ClipUploader({ onUploaded }: ClipUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <input type="file" ref={fileRef} className="text-white mb-4" />

      <button
        onClick={onUploaded}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Subir Clip
      </button>
    </div>
  );
}
