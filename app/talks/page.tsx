'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type ChatRoom = {
  roomId: string;
  roomName: string;
  roomCategory: string;
  roomDescription: string;
};

export default function GroupChattingList() {
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newRoomCategory, setNewRoomCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    const res = await api.get(`/chat/room/group/list`);
    console.log(res.data);
    setChatRoomList(res.data);
  };

  const joinChatRoom = async (roomId: string) => {
    await api.post(`/chat/room/group/${roomId}/join`);
    router.push(`/chatpage/${roomId}`);
  };

  const createChatRoom = async () => {
    await api.post(
      `/chat/room/group/create`,
      {
        roomName: newRoomTitle,
        description: newRoomDescription,
        category: newRoomCategory,
      }
    );
    setShowCreateRoomModal(false);
    setNewRoomTitle("");
    setNewRoomDescription("");
    setNewRoomCategory("");
    loadChatRooms();
  };

  // Get unique categories from chatRoomList
  const categories = [
    "all",
    ...Array.from(new Set(chatRoomList.map((room) => room.roomCategory)))
  ];

  // Filtered chat rooms
  const filteredChatRooms = selectedCategory === "all"
    ? chatRoomList
    : chatRoomList.filter((room) => room.roomCategory === selectedCategory);

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
        {/* Category Filter */}
        <div className="px-6 pt-4 pb-2">
          <label className="mr-2 font-medium">Category:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="p-6">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Room Name</th>
                <th className="py-2 px-4 border">Chat</th>
              </tr>
            </thead>
            <tbody>
              {filteredChatRooms.map((chat) => (
                <tr key={chat.roomId}>
                  <td className="py-2 px-4 border align-top">
                    <div className="flex items-start relative">
                      {/* Category badge */}
                      <span className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">
                        {chat.roomCategory}
                      </span>
                      {/* todo image */}
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate max-w-xs block text-base">{chat.roomName}</span>
                        <span className="text-gray-500 text-sm truncate max-w-xs block mt-1">{chat.roomDescription}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border text-center align-top">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                      onClick={() => joinChatRoom(chat.roomId)}
                    >
                      join
                    </button>
                  </td>
                </tr>
              ))}
              {filteredChatRooms.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">
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
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                rows={3}
              />
              <select
                className="w-full border rounded px-3 py-2 mb-4"
                value={newRoomCategory}
                onChange={(e) => setNewRoomCategory(e.target.value)}
              >
                <option value="" disabled>Select Category</option>
                <option value="NOVEL">Novel</option>
                <option value="POETRY">Poetry</option>
                <option value="PLAY">Play</option>
                <option value="MOVIE">Movie</option>
                <option value="PAINTING">Painting</option>
              </select>
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