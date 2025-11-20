// src/context/ChatContext.tsx

import { createContext, useContext, useState } from "react";
import { chatSocket } from "../services/websocket/chatSocket";

// Tipos de badge permitidos (CORREGIDO)
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
  disconnect: () => void;
  sendMessage: (streamId: string, text: string, user?: string) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ======================================================
  //  CONNECT TO STREAM ROOM (WS)
  // ======================================================
  const connectToRoom = async (streamId: string) => {
    await chatSocket.connect(
      () => {
        console.log("🟢 Conectado al WebSocket");

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
            console.error("❌ Error parseando mensaje:", err);
          }
        });
      },
      (err) => console.error("❌ Error al conectar WS:", err)
    );
  };

  // ======================================================
  //  SEND MESSAGE TO BACKEND (WS)
  // ======================================================
  const sendMessage = (streamId: string, text: string, user = "You") => {
    if (!text.trim()) return;

    const message = {
      user,
      message: text,
      timestamp: new Date().toISOString(),
      color: "#9f4bff",
    };

    chatSocket.sendMessage(streamId, message);
  };

  const clearMessages = () => setMessages([]);

  const disconnect = () => {
    chatSocket.disconnect();
    setMessages([]);
    console.log("🔴 WebSocket desconectado.");
  };

  return (
    <ChatContext.Provider
      value={{ messages, connectToRoom, sendMessage, disconnect, clearMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside ChatProvider");
  return ctx;
};
