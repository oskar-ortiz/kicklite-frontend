import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  user: string;
  avatar?: string;
  text: string;
  timestamp: number;
}

export function useChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!streamId) return;

    const s = io("https://TU_BACKEND_SOCKET"); // poner URL real
    setSocket(s);

    s.emit("joinRoom", streamId);

    s.on("chatMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.emit("leaveRoom", streamId);
      s.disconnect();
    };
  }, [streamId]);

  const sendMessage = (msg: ChatMessage) => {
    if (socket) socket.emit("chatMessage", msg);
  };

  return { messages, sendMessage };
}
