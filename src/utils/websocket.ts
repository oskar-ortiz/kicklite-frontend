import { Client, type IMessage, type IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../services/api/api.config";

export const WS_URL = `${API_URL}/ws`;

interface ConnectOptions {
  topic: string;
  onMessage: (msg: any) => void;
}

export function createWebSocketClient({ topic, onMessage }: ConnectOptions) {
  const socket = new SockJS(WS_URL);

  const client = new Client({
    webSocketFactory: () => socket as any,
    reconnectDelay: 5000,
    debug: () => {},
  });

  client.onConnect = () => {
    console.log("🔗 WebSocket conectado:", WS_URL);

    client.subscribe(topic, (message: IMessage) => {
      try {
        const body = JSON.parse(message.body);
        onMessage(body);
      } catch {
        console.error("❌ WS: mensaje inválido:", message.body);
      }
    });
  };

  client.onStompError = (frame: IFrame) => {
    console.error("❌ STOMP error:", frame.headers["message"]);
  };

  client.activate();

  return client;
}
