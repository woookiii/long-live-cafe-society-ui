'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type ChatRoom = {
  roomId: string;
  roomName:string;
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
  const { accessToken: token} = useAuth();
  const [page, setPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    loadChatRooms(page, selectedCategory);
  }, [page, selectedCategory, token]);

  const loadChatRooms = async (page: number, category: string) => {
    const endpoint = category === "all"
      ? `/chat/room/group/list/${page}`
      : `/chat/room/group/list/${category}/${page}`;
    try {
      const res = await api.get(endpoint);
      setChatRoomList(res.data);
    } catch (error) {
      console.error("Failed to load chat rooms:", error);
      setChatRoomList([]);
    }
  };

  const joinChatRoom = async (roomId: string) => {
    await api.post(`/chat/room/group/${roomId}/join`);
    router.push(`/chatpage/${roomId}`);
  };

  const createChatRoom = async () => {
    if (!newRoomTitle.trim() || !newRoomCategory) return;
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
    setPage(0); // Reset to first page to see the new room
    setSelectedCategory("all"); // Reset category to see the new room
    loadChatRooms(0, "all");
  };

  // Get unique categories from chatRoomList
  const categories = [
    "all",
    "NOVEL",
    "POETRY",
    "PLAY",
    "MOVIE",
    "PAINTING",
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(0); // Reset to first page when category changes
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
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
        {/* Category Filter */}
        <div className="px-6 pt-4 pb-2">
          <label className="mr-2 font-medium">Category:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedCategory}
            onChange={handleCategoryChange}
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
              {chatRoomList.map((chat) => (
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
              {chatRoomList.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">
                    No chat rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4">
              Page {page + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={chatRoomList.length < 5}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
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
                placeholder="Room Title"
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
                  disabled={!newRoomTitle.trim() || !newRoomCategory}
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