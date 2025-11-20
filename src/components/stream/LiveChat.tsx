import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Smile,
  Gift,
  Settings,
  Users,
  Crown,
  Shield,
  Star
} from "lucide-react";

import Avatar from "../common/Avatar";
import { useChat } from "../../context/ChatContext";
import { safeDate } from "../../utils/safeFormat";

export default function LiveChat({ streamId }: { streamId: string }) {
  const { messages, sendMessage, connectToRoom } = useChat();
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Conectar al WS cuando el chat se monta
  useEffect(() => {
    if (streamId) connectToRoom(streamId);
  }, [streamId]);

  // Autoscroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "🎮", "⚡", "💎", "👑", "🏆"];

  const badgeStyles = {
    founder: { icon: Crown, color: "text-amber-400", bg: "bg-amber-500/20" },
    mod: { icon: Shield, color: "text-green-400", bg: "bg-green-500/20" },
    vip: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    sub: { icon: Gift, color: "text-purple-400", bg: "bg-purple-500/20" }
  } as const;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(streamId, input, "You");
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

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="group relative">

            <div className="flex items-start gap-3">
              <Avatar size="sm" alt={msg.user} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {msg.badge && badgeStyles[msg.badge] && (
                    <div className={`p-1 rounded ${badgeStyles[msg.badge].bg}`}>
                      {(() => {
                        const Icon = badgeStyles[msg.badge].icon;
                        return (
                          <Icon
                            className={`w-3 h-3 ${badgeStyles[msg.badge].color}`}
                          />
                        );
                      })()}
                    </div>
                  )}

                  <span
                    className="font-bold text-sm"
                    style={{ color: msg.color }}
                  >
                    {msg.user}
                  </span>

                  <span className="text-xs text-slate-500">
                    {safeDate(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit"
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

      {/* INPUT */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/5 p-4">
        <div className="flex gap-2">

          {/* Emoji toggle */}
          <div className="relative">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <Smile className="w-5 h-5 text-slate-400" />
            </button>

            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 bg-slate-800 p-3 rounded-xl border border-white/10 grid grid-cols-5 gap-2"
                >
                  {emojis.map((e) => (
                    <button
                      key={e}
                      onClick={() => setInput((t) => t + e)}
                      className="text-2xl hover:bg-white/10 rounded-lg"
                    >
                      {e}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
            rows={1}
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-purple-600 rounded-xl disabled:opacity-40"
          >
            <Send className="w-5 h-5 text-white" />
          </button>

        </div>
      </div>
    </div>
  );
}
