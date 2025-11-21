// src/services/websocket/chatSocket.ts

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../api/api.config";

class ChatSocketService {
  private client: Client | null = null;
  private connected = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected && this.client) {
        resolve();
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        reconnectDelay: 3000,
        debug: () => {},

        onConnect: () => {
          this.connected = true;
          console.log("🟢 WebSocket conectado");
          resolve();
        },

        onStompError: (frame) => {
          console.error("❌ STOMP Error:", frame);
          reject(frame);
        },

        onWebSocketClose: () => {
          this.connected = false;
          console.warn("🔌 WebSocket desconectado");
        },
      });

      this.client.activate();
    });
  }

  subscribeToChat(
    streamId: string,
    callback: (msg: IMessage) => void
  ): StompSubscription | null {
    if (!this.client || !this.connected) {
      console.warn("⚠️ No conectado al WS aún.");
      return null;
    }

    return this.client.subscribe(`/topic/chat/${streamId}`, callback);
  }

  sendMessage(streamId: string, message: any): void {
    if (!this.client || !this.connected) {
      console.warn("⚠️ No conectado, no se puede enviar mensaje.");
      return;
    }

    this.client.publish({
      destination: `/app/chat/${streamId}`,
      body: JSON.stringify(message),
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log("🔴 WebSocket desconectado");
    }
  }
}

export const chatSocket = new ChatSocketService();
