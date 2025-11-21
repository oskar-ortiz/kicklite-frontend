import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  user: string;
  text: string;
  color: string;
}

export default function LiveChat({ streamId }: { streamId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "Oskaii", text: "¡Bienvenidos al stream!", color: "#8b5cf6" },
    { id: 2, user: "Laura", text: "Qué buen contenido 🔥", color: "#ec4899" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "Tú",
        text: input,
        color: "#10b981",
      },
    ]);

    setInput("");
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 flex flex-col h-full">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: msg.color }}
            >
              {msg.user[0].toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-sm" style={{ color: msg.color }}>
                {msg.user}
              </p>
              <p className="text-slate-300 text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
