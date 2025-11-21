// src/components/stream/LiveChat.tsx

import { useState, useEffect, useRef } from "react";
import { Smile, Send, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import { useChat } from "../../context/ChatContext";
import { safeDate } from "../../utils/safeFormat";

export interface LiveChatProps {
  streamId: string;
}

// Configuración slow mode / anti-spam
const SLOW_MODE_SECONDS = 5;
const SPAM_WINDOW_MS = 10_000;
const SPAM_MAX_MSGS = 5;

export default function LiveChat({ streamId }: LiveChatProps) {
  const { messages, sendMessage, connectToRoom } = useChat();
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageTimesRef = useRef<number[]>([]);
  const lastMessageRef = useRef<string>("");

  useEffect(() => {
    if (streamId) connectToRoom(streamId);
  }, [streamId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(
      () => setCooldown((c) => (c > 0 ? c - 1 : 0)),
      1000
    );
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (input.length > 0 && warning) {
      setWarning(null);
    }
  }, [input, warning]);

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "🎮", "⚡", "💎", "👑", "🏆"];

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    if (cooldown > 0) {
      setWarning(`Slow mode activo: espera ${cooldown}s.`);
      return;
    }

    const now = Date.now();
    messageTimesRef.current = messageTimesRef.current.filter(
      (t) => now - t < SPAM_WINDOW_MS
    );

    if (messageTimesRef.current.length >= SPAM_MAX_MSGS) {
      setWarning("Estás enviando mensajes muy rápido. Espera unos segundos.");
      return;
    }

    if (lastMessageRef.current === text) {
      setWarning("No repitas el mismo mensaje.");
      return;
    }

    messageTimesRef.current.push(now);
    lastMessageRef.current = text;
    setCooldown(SLOW_MODE_SECONDS);

    sendMessage(streamId, text, "You");
    setInput("");
  };

  return (
    <div className="h-[700px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-white text-lg font-bold">Chat</h3>
          </div>

          <button className="p-2 hover:bg-white/5 rounded-lg">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="group relative">
            <div className="flex items-start gap-3">
              <Avatar size="sm" alt={msg.user} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-bold text-sm"
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
                </div>

                <p className="text-slate-200 break-words text-sm">
                  {msg.message}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* WARNING */}
      {warning && (
        <div className="px-4 py-2 text-xs text-yellow-400 bg-yellow-500/10 border-t border-yellow-500/30">
          {warning}
        </div>
      )}

      {/* INPUT */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/5 p-4">
        <div className="flex gap-2">
          <div className="relative">
            <button
              aria-label="toggle-emoji-picker"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <Smile className="w-5 h-5 text-slate-400" />
            </button>

            {showEmojis && (
              <div className="absolute bottom-full mb-2 bg-slate-800 p-3 rounded-xl border border-white/10 grid grid-cols-5 gap-2 z-50">
                {emojis.map((e) => (
                  <button
                    key={e}
                    aria-label={`emoji-${e}`}
                    onClick={() => setInput((t) => t + e)}
                    className="text-2xl hover:bg-white/10 rounded-lg"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            aria-label="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              cooldown > 0
                ? `Slow mode: espera ${cooldown}s...`
                : "Send a message..."
            }
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
            rows={1}
          />

          <button
            aria-label="send-message"
            onClick={handleSend}
            disabled={!input.trim() || cooldown > 0}
            className="p-3 bg-purple-600 rounded-xl disabled:opacity-40"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
