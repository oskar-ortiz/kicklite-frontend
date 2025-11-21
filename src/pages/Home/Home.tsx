import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 pt-24 px-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* TEXTOS */}
        <div>
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            streamora<span className="text-purple-400">.space</span>
          </h1>

          <h2 className="text-4xl text-purple-300 font-bold mt-4">
            Stream. Crea. Conecta.
          </h2>

          <p className="text-slate-300 mt-6 text-lg">
            Comparte tus mejores momentos o transmite en vivo con estilo.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/stream/1")}
              className="bg-purple-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-purple-700"
            >
              Comenzar stream
            </button>

            <Link
              to="/clips"
              className="bg-white/10 px-6 py-3 rounded-lg text-white font-semibold hover:bg-white/20"
            >
              Ver clips
            </Link>
          </div>
        </div>

        {/* VIDEO PREVIEW */}
        <div className="relative aspect-video rounded-2xl border border-white/10 shadow-xl overflow-hidden cursor-pointer"
             onClick={() => navigate("/stream/1")}
        >
          <video
            src="https://samplelib.com/lib/preview/mp4/sample-1m.mp4"
            className="w-full h-full object-cover opacity-60 hover:opacity-100 transition"
            muted
            autoPlay
            loop
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
