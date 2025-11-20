import { useState, useEffect, useRef } from "react";
import { Smile, Send, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import { useChat } from "../../context/ChatContext";
import { safeDate } from "../../utils/safeFormat";

// ✅ ESTA ES LA PARTE QUE FALTABA
export interface LiveChatProps {
  streamId: string;
}

export default function LiveChat({ streamId }: LiveChatProps) {
  const { messages, sendMessage, connectToRoom } = useChat();
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamId) connectToRoom(streamId);
  }, [streamId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "🎮", "⚡", "💎", "👑", "🏆"];

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(streamId, input, "You");
    setInput("");
  };

  return (
    <div className="h-[700px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/5 flex flex-col overflow-hidden">

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

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="group relative">
            <div className="flex items-start gap-3">
              <Avatar size="sm" alt={msg.user} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-bold text-sm"
                    style={{ color: msg.color }}
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
              <div className="absolute bottom-full mb-2 bg-slate-800 p-3 rounded-xl border border-white/10 grid grid-cols-5 gap-2">
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
            placeholder="Send a message..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
            rows={1}
          />

          <button
            aria-label="send-message"
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
