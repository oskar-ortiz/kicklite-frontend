// src/services/websocket/viewerSocket.ts

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../api/api.config";

type ViewerCallback = (count: number) => void;

class ViewerSocketService {
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
          console.log("🟢 WS viewers conectado");
          resolve();
        },
        onStompError: (frame) => {
          console.error("❌ STOMP viewers error:", frame);
          reject(frame);
        },
        onWebSocketClose: () => {
          this.connected = false;
          console.warn("🔌 WS viewers desconectado");
        },
      });

      this.client.activate();
    });
  }

  subscribeToViewers(
    streamId: string,
    callback: ViewerCallback
  ): StompSubscription | null {
    if (!this.client || !this.connected) {
      console.warn("⚠️ ViewerSocket no conectado todavía.");
      return null;
    }

    // Ajusta este topic con tu backend:
    const destination = `/topic/streams/${streamId}/viewers`;

    return this.client.subscribe(destination, (msg: IMessage) => {
      try {
        let count = 0;
        if (msg.body) {
          // Puede venir como "123" o como JSON { "viewerCount": 123 }
          const data = JSON.parse(msg.body);
          if (typeof data === "number") count = data;
          else if (typeof data.viewerCount === "number") count = data.viewerCount;
        }
        callback(count);
      } catch {
        // si no es JSON, intenta parsear directo
        const n = Number(msg.body);
        if (!Number.isNaN(n)) {
          callback(n);
        }
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export const viewerSocket = new ViewerSocketService();
