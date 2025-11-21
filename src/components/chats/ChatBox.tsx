// src/components/chat/ChatBox.tsx

import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import Avatar from "../common/Avatar";
import { safeDate } from "../../utils/safeFormat";

interface ChatBoxProps {
  streamId: string;
  username: string;
  color?: string;
  badge?: "mod" | "vip" | "founder" | "sub";
}

// Configuración de slow mode / anti-spam
const SLOW_MODE_SECONDS = 5;        // segundos entre mensajes
const SPAM_WINDOW_MS = 10_000;      // ventana de tiempo para contar mensajes
const SPAM_MAX_MSGS = 5;            // máximo mensajes en la ventana

export default function ChatBox({
  streamId,
  username,
  color = "#9f4bff",
  badge,
}: ChatBoxProps) {
  const { messages, connectToRoom, sendMessage } = useChat();

  const [input, setInput] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messageTimesRef = useRef<number[]>([]);
  const lastMessageRef = useRef<string>("");

  // Conectar al room del stream
  useEffect(() => {
    if (streamId) connectToRoom(streamId);
  }, [streamId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Reducir cooldown cada segundo
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(
      () => setCooldown((c) => (c > 0 ? c - 1 : 0)),
      1000
    );
    return () => clearInterval(interval);
  }, [cooldown]);

  // Limpiar warning cuando el usuario escribe
  useEffect(() => {
    if (input.length > 0 && warning) {
      setWarning(null);
    }
  }, [input, warning]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    // Slow mode
    if (cooldown > 0) {
      setWarning(`Slow mode activo: espera ${cooldown}s para enviar otro mensaje.`);
      return;
    }

    const now = Date.now();
    // Limpiar tiempos viejos
    messageTimesRef.current = messageTimesRef.current.filter(
      (t) => now - t < SPAM_WINDOW_MS
    );

    // Anti-flood: demasiados mensajes en poco tiempo
    if (messageTimesRef.current.length >= SPAM_MAX_MSGS) {
      setWarning("Estás enviando mensajes muy rápido. Espera unos segundos.");
      return;
    }

    // Anti-duplicado: mismo mensaje seguido
    if (lastMessageRef.current === text) {
      setWarning("No repitas el mismo mensaje.");
      return;
    }

    // Registrar envío
    messageTimesRef.current.push(now);
    lastMessageRef.current = text;
    setCooldown(SLOW_MODE_SECONDS);

    // Enviar al contexto / backend
    sendMessage(streamId, text, username);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 rounded-xl overflow-hidden">
      {/* MENSAJES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar size="sm" alt={msg.user} />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-semibold text-sm"
                  style={{ color: msg.color || "#ffffff" }}
                >
                  {msg.user}
                </span>

                <span className="text-xs text-slate-500">
                  {safeDate(msg.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {msg.badge && (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-purple-600 text-white">
                    {msg.badge}
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-sm break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WARNING / SLOW MODE INFO */}
      {warning && (
        <div className="px-4 py-2 text-xs text-yellow-400 bg-yellow-500/10 border-t border-yellow-500/30">
          {warning}
        </div>
      )}

      {/* INPUT */}
      <div className="p-3 bg-slate-800 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            cooldown > 0
              ? `Slow mode: espera ${cooldown}s...`
              : "Escribe un mensaje..."
          }
          className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white outline-none border border-white/10"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || cooldown > 0}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/40 text-white"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
