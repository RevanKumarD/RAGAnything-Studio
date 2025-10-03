"use client";

import { useEffect, useRef, useState } from "react";

export interface WebSocketMessage {
  type: string;
  data?: any;
  [key: string]: any;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnect = true,
  reconnectInterval = 3000,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(reconnect);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        onConnect?.();
        console.log("WebSocket connected");
      };

      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        console.log("WebSocket disconnected");

        // Attempt reconnection
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
    }
  };

  const disconnect = () => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  };

  const sendMessage = (message: WebSocketMessage | string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const data = typeof message === "string" ? message : JSON.stringify(message);
      wsRef.current.send(data);
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
};
