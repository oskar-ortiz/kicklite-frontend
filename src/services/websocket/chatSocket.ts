// src/services/websocket/chatSocket.ts

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../api/api.config";

class ChatSocketService {
  private client: Client | null = null;
  private connected = false;

  connect(onConnected?: () => void, onError?: (err: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        reconnectDelay: 5000,
        debug: () => {}, // silencioso
        onConnect: () => {
          this.connected = true;
          onConnected?.();
          resolve();
        },
        onStompError: (err) => {
          console.error("WS ERROR:", err);
          onError?.(err);
          reject(err);
        }
      });

      this.client.activate();
    });
  }

  subscribeToChat(streamId: string, callback: (msg: IMessage) => void): StompSubscription | null {
    if (!this.client || !this.connected) return null;

    return this.client.subscribe(`/topic/chat/${streamId}`, callback);
  }

  sendMessage(streamId: string, message: any): void {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: `/app/chat/${streamId}`,
      body: JSON.stringify(message),
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export const chatSocket = new ChatSocketService();
