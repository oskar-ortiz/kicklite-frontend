// src/context/ChatContext.tsx

import { createContext, useContext, useState } from "react";
import { chatSocket } from "../services/websocket/chatSocket";

export type BadgeType = "founder" | "mod" | "vip" | "sub" | undefined;

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  color?: string;
  badge?: BadgeType;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  connectToRoom: (streamId: string) => Promise<void>;
  sendMessage: (streamId: string, text: string, user?: string) => void;
  disconnect: () => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const connectToRoom = async (streamId: string) => {
    await chatSocket.connect();

    chatSocket.subscribeToChat(streamId, (msg) => {
      try {
        const data = JSON.parse(msg.body);

        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          user: data.user || "Unknown",
          message: data.message || "",
          color: data.color || "#ffffff",
          badge: data.badge as BadgeType,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
      } catch (err) {
        console.error("❌ Error al procesar mensaje WS:", err);
      }
    });
  };

  const sendMessage = (streamId: string, text: string, user = "You") => {
    if (!text.trim()) return;

    const payload = {
      user,
      message: text,
      badge: "vip",
      color: "#9f4bff",
      timestamp: new Date().toISOString(),
    };

    chatSocket.sendMessage(streamId, payload);
  };

  const clearMessages = () => setMessages([]);

  const disconnect = () => {
    chatSocket.disconnect();
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        connectToRoom,
        sendMessage,
        disconnect,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("ChatContext no está dentro de ChatProvider");
  return ctx;
};
