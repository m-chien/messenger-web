"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";

interface WebSocketContextType {
  client: Client | null;
  connected: boolean;
  userId: number | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  connected: false,
  userId: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const stompClientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      setConnected(false);
      setUserId(null);
      return;
    }

    let parsedUserId: number | null = user?.id || null;
    if (!parsedUserId) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        parsedUserId = Number(payload.sub);
      } catch (e) {
        console.error("Token decoding error:", e);
      }
    }
    setUserId(parsedUserId);

    if (stompClientRef.current?.active) {
      setConnected(true);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // console.log("[STOMP Debug]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket Connected Globally");
      setConnected(true);
    };

    client.onDisconnect = () => {
      console.log("⚠️ WebSocket Disconnected");
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"], frame.body);
      setConnected(false);
    };

    client.onWebSocketClose = () => {
      setConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
      setConnected(false);
    };
  }, [token, user?.id]);

  return (
    <WebSocketContext.Provider
      value={{
        client: stompClientRef.current,
        connected,
        userId,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
