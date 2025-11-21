import { ChatMessage } from "../../hooks/useChat";

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition">
      <img
        src={msg.avatar || "https://via.placeholder.com/40"}
        className="w-8 h-8 rounded-full"
      />

      <div>
        <p className="text-purple-300 font-semibold text-sm">@{msg.user}</p>
        <p className="text-white text-sm">{msg.text}</p>
      </div>
    </div>
  );
}
