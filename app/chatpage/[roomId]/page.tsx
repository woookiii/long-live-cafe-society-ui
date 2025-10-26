'use client'

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client as StompClient } from "webstomp-client";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chatRoomImageUrl, setChatRoomImageUrl] = useState<string | null>(null);

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
    fetchChatRoomImage();

    return () => {//unmount action
      disconnectWebSocket();
    };
  }, [roomId, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatRoomImage = async () => {
    if (!roomId) return;
    try {
      const res = await api.get(`/files/${roomId}`);
      if (res.data) {
        setChatRoomImageUrl(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch signature image:", error);
      // It might return 404 if no image is set, so we can ignore it.
      setChatRoomImageUrl(null);
    }
  };

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

  // Image upload logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const getPresignedUrl = async () => {
    if (!imageFile) return;
    const res = await api.post("/files/pre-signed-url", null, {
      params: { filename: imageFile.name, chatRoomId: roomId },
    });
    return { url: res.data.url, file: res.data.file };
  };

  const uploadToS3 = async () => {
    if (!imageFile) return;
    setUploading(true);
    try {
      const presigned = await getPresignedUrl();
      if (!presigned) throw new Error("Failed to get presigned URL");
      const { url, file } = presigned;

      await axios.put(url, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      // Call endpoint to save metadata
      await api.post("/files/save-metadata", null, {
        params: { filename: file, chatRoomId: roomId },
      });

      alert("Signature image updated!");
      setShowImageModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchChatRoomImage(); // Refetch the image to display the new one
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-10 gap-8 px-8">
      {/* Left side: Image and Upload Button */}
      <div className="flex flex-col items-center gap-4 w-1/4 max-w-sm">
        {chatRoomImageUrl ? (
          <img
            src={chatRoomImageUrl}
            alt="Room Signature"
            className="w-full rounded-lg object-cover shadow-md"
            style={{ aspectRatio: "1 / 1" }}
          />
        ) : (
          <div
            className="w-full bg-gray-200 rounded-lg flex items-center justify-center shadow-md"
            style={{ aspectRatio: "1 / 1" }}
          >
            <span className="text-gray-500">No Image Set</span>
          </div>
        )}
        <button
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowImageModal(true)}
        >
          Set Room Image
        </button>
      </div>

      {/* Right side: Chat Box */}
      <div className="w-3/4 max-w-3xl">
        <div className="bg-white rounded shadow">
          <div className="flex items-center justify-center py-4 border-b px-4">
            <h2 className="text-2xl font-bold">chat</h2>
          </div>
          <div
            className="chat-box h-[30rem] overflow-y-auto border-b px-4 py-2"
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

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b text-lg font-semibold">
              Set Chat Room Image
            </div>
            <div className="p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded px-3 py-2 mb-4"
              />
              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="preview" className="max-h-40 mx-auto rounded" />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowImageModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={uploadToS3}
                  disabled={!imageFile || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}