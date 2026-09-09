import { useEffect, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BACKEND_WS_URL = 'http://localhost:8080/ws';

export const useSocket = (roomId?: number) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Khởi tạo STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(BACKEND_WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log('[STOMP]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      // Nếu có roomId thì subscribe vào topic của phòng đó
      if (roomId) {
        client.subscribe(`/topic/chatroom/${roomId}`, (message: IMessage) => {
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
          }
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = useCallback((content: string, type: string = 'text', attachments: any[] = []) => {
    if (stompClient && isConnected && roomId) {
      const messageDto = {
        message: content,
        type: type,
        attachments: attachments
      };
      
      stompClient.publish({
        destination: `/app/chat.send/${roomId}`,
        body: JSON.stringify(messageDto)
      });
    } else {
      console.error("Socket not connected or roomId missing");
    }
  }, [stompClient, isConnected, roomId]);

  return { isConnected, messages, sendMessage, stompClient };
};
