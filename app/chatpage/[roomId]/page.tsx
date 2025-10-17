'use client'

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client as StompClient } from "webstomp-client";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

type Message = {
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
};

export default function ChatPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState<StompClient | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { accessToken: token, username, userId } = useAuth();

  useEffect(() => {
  if (!sessionStorage.getItem("chatpageRefreshed")) {
    sessionStorage.setItem("chatpageRefreshed", "true");
    window.location.reload();
  }
  }, []);
  
  useEffect(() => {
  return () => {
    sessionStorage.removeItem("chatpageRefreshed");
  };
  }, []);

  useEffect(() => {
    if (!roomId || !token) return;
    
    fetchHistory();
    connectWebsocket();

    return () => {//unmount action
      disconnectWebSocket();
    };
  }, [roomId, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    const res = await api.get(`/chat/history/${roomId}`);
    console.log("history fetching");
    setMessages(res.data);
  };

  const connectWebsocket = () => {
    if (!token || !roomId) return;
    if (stompClient && stompClient.connected) return;
    const sockJs = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/connect`);

    const client = Stomp.over(sockJs);
    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        client.subscribe(
          `/topic/${roomId}`,
          (message) => {
            const parseMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, parseMessage]);
          },
          { Authorization: `Bearer ${token}` }
        );
      }
    );
    setStompClient(client);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !token || !userId) return;
    const message = {
      senderId: userId,
      senderName: username,
      message: newMessage,
    };
    if (stompClient) {
      stompClient.send(`/publish/${roomId}`, JSON.stringify(message));
    }
    setNewMessage("");
  };

  const disconnectWebSocket = async () => {
    if (stompClient && stompClient.connected) {
      stompClient.unsubscribe(`/topic/${roomId}`);
      stompClient.disconnect();
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded shadow">
          <div className="text-center text-2xl font-bold py-4 border-b">chat</div>
          <div
            className="chat-box h-72 overflow-y-auto border-b px-4 py-2"
            ref={chatBoxRef}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.senderId === userId ? "text-right" : "text-left"
                }`}
              >
                <span className="font-semibold">{msg.senderName}: </span>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="p-4 flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              type="text"
              placeholder="chat about anything"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-24"
              onClick={sendMessage}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}