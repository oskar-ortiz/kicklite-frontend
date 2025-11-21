import LiveChat from "../../components/stream/LiveChat";

export default function StreamPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* VIDEO */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            Transmisión en vivo
          </h1>

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-xl">
            <video
              src="https://samplelib.com/lib/preview/mp4/sample-1m.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-4 text-slate-400">🔴 120 espectadores</p>
        </div>

        {/* CHAT */}
        <div className="lg:col-span-1 h-[600px]">
          <LiveChat streamId="demo" />
        </div>

      </div>
    </div>
  );
}
