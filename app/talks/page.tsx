'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type ChatRoom = {
  roomId: string;
  roomName: string;
  // add other properties if needed
};

export default function GroupChattingList() {
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    const response = await api.get(`${API_BASE_URL}/chat/room/group/list`);
    setChatRoomList(response.data);
  };

  const joinChatRoom = async (roomId: string) => {
    await api.post(`${API_BASE_URL}/chat/room/group/${roomId}/join`);
    router.push(`/chatpage/${roomId}`);
  };

  const createChatRoom = async () => {
    await api.post(
      `${API_BASE_URL}/chat/room/group/create?roomName=${encodeURIComponent(newRoomTitle)}`,
      null
    );
    setShowCreateRoomModal(false);
    setNewRoomTitle("");
    loadChatRooms();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto bg-white rounded shadow">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">Chat Room List</h2>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded"
            onClick={() => setShowCreateRoomModal(true)}
          >
            Create Chat Room
          </button>
        </div>
        <div className="p-6">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Room Number</th>
                <th className="py-2 px-4 border">Room Name</th>
                <th className="py-2 px-4 border">Chat</th>
              </tr>
            </thead>
            <tbody>
              {chatRoomList.map((chat) => (
                <tr key={chat.roomId}>
                  <td className="py-2 px-4 border text-center">{chat.roomId}</td>
                  <td className="py-2 px-4 border">{chat.roomName}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => joinChatRoom(chat.roomId)}
                    >
                      join
                    </button>
                  </td>
                </tr>
              ))}
              {chatRoomList.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    No chat rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b text-lg font-semibold">
              Create Chat Room
            </div>
            <div className="p-6">
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="방제목"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowCreateRoomModal(false)}
                >
                  cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={createChatRoom}
                  disabled={!newRoomTitle.trim()}
                >
                  create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}