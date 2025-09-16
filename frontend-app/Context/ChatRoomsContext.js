import React, { createContext, useContext, useState, useEffect } from "react";
import useLogin from "../Hook/useLogin";
import api from "../api/api";

const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
  const { user } = useLogin();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- 유틸 ---------- */
  const removeDuplicateRooms = (rooms) =>
    rooms.filter(
      (room, idx, self) => idx === self.findIndex((r) => r.chatRoomId === room.chatRoomId)
    );

  /* ---------- ① 목록 가져오기 함수 ---------- */
  const fetchChatRooms = async () => {
    if (!user) return; // 로그인 안 했으면 호출 X

    console.log("📋 채팅방 목록 조회 시작...");
    setLoading(true);

    try {
      const res = await api.get("/api/chat/rooms");
      console.log("📋 채팅방 목록 API 응답:", res.data);

      const rooms = res.data.data?.chatRooms || [];
      const uniqueRooms = removeDuplicateRooms(rooms);

      console.log(`📋 채팅방 목록: ${uniqueRooms.length}개`);
      setChatRooms(uniqueRooms);
    } catch (err) {
      console.error("채팅방 목록 불러오기 실패:", err);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ② 로그인 상태가 바뀔 때마다 목록 새로고침 ---------- */
  useEffect(() => {
    if (!user) {
      console.log("📋 로그아웃으로 인한 채팅방 목록 초기화");
      setChatRooms([]);
      return;
    }
    fetchChatRooms(); // ← 함수 "호출"만
  }, [user]);

  /* ---------- ③ 새 채팅방 추가(또는 갱신) ---------- */
  const addChatRoom = (newRoom) => {
    console.log("📋 채팅방 추가/갱신:", newRoom);
    setChatRooms((prev) => {
      const exists = prev.find((r) => r.chatRoomId === newRoom.chatRoomId);
      return exists
        ? prev.map((r) =>
            r.chatRoomId === newRoom.chatRoomId ? { ...r, ...newRoom } : r
          ) // 최신 정보로 갱신
        : [...prev, newRoom];
    });
  };

  /* ---------- ④ 채팅방 마지막 메시지 업데이트 ---------- */
  const updateLastMessage = (chatRoomId, lastMessage, lastMessageTime) => {
    console.log(`📋 채팅방 ${chatRoomId} 마지막 메시지 업데이트:`, lastMessage);
    setChatRooms((prev) =>
      prev.map((room) =>
        room.chatRoomId === chatRoomId ? { ...room, lastMessage, lastMessageTime } : room
      )
    );
  };

  /* ---------- ⑤ 안읽은 메시지 수 업데이트 ---------- */
  const updateUnreadCount = (chatRoomId, unreadCount) => {
    setChatRooms((prev) =>
      prev.map((room) =>
        room.chatRoomId === chatRoomId ? { ...room, unreadCount } : room
      )
    );
  };

  /* ---------- ⑥ Context value ---------- */
  const value = {
    chatRooms,
    setChatRooms,
    addChatRoom,
    fetchChatRooms,
    updateLastMessage,
    updateUnreadCount,
    loading,
  };

  return <ChatRoomsContext.Provider value={value}>{children}</ChatRoomsContext.Provider>;
}

export function useChatRooms() {
  const context = useContext(ChatRoomsContext);
  if (!context) {
    throw new Error("useChatRooms must be used within a ChatRoomsProvider");
  }
  return context;
}
