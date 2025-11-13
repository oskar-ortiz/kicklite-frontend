type MessageCallback = (message: ChatMessage) => void;
type ConnectionCallback = () => void;

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'subscription' | 'follow' | 'system';
}

class ChatSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectCallbacks: ConnectionCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private baseUrl: string) {}

  connect(streamId: string) {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(`${this.baseUrl}/chat/${streamId}`);
    
    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.connectCallbacks.forEach(callback => callback());
    };

    this.socket.onmessage = (event) => {
      const message: ChatMessage = JSON.parse(event.data);
      this.messageCallbacks.forEach(callback => callback(message));
    };

    this.socket.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(streamId), 1000 * this.reconnectAttempts);
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'message', content: message }));
    }
  }

  onMessage(callback: MessageCallback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  onConnect(callback: ConnectionCallback) {
    this.connectCallbacks.push(callback);
    return () => {
      this.connectCallbacks = this.connectCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const chatSocket = new ChatSocketService(
 import.meta.env.VITE_WS_URL || 'ws://localhost:30000'

);