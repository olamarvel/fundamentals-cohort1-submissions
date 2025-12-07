import { useEffect, useRef, useState } from "react";

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: unknown;
  error: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      console.log("📨 WebSocket message:", event.data);
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch {
        setLastMessage(event.data);
      }
    };

    ws.onerror = (event) => {
      console.error("❌ WebSocket error:", event);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket disconnected");
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    error,
  };
}
