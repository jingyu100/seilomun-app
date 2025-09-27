import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import useLogin from "../Hook/useLogin";
import api from "../api/api";
import { useWebSocket } from "./WebSocketContext";

const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
  const { user } = useLogin();
  const {
    addMessageListener,
    subscribeToRoomsBulk,
    connected,
  } = useWebSocket();

  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const removeDuplicateRooms = useCallback(
      (rooms) =>
          rooms.filter(
              (room, idx, self) =>
                  idx === self.findIndex((r) => r.chatRoomId === room.chatRoomId)
          ),
      []
  );

  // 목록 가져오기
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/api/chat/rooms");
      const rooms = (res.data?.data?.chatRooms || []).map((r) => ({
        ...r,
        chatRoomId: r.chatRoomId ?? r.id,
      }));
      const unique = removeDuplicateRooms(rooms);
      setChatRooms(unique);

      // 웹소켓 연결되어 있으면 한번에 구독
      if (connected) {
        subscribeToRoomsBulk(unique.map((r) => String(r.chatRoomId)));
      }
    } catch (err) {
      console.error("채팅방 목록 불러오기 실패:", err);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  }, [user, removeDuplicateRooms, connected, subscribeToRoomsBulk]);

  // 로그인 변경 시 새로고침
  useEffect(() => {
    if (!user) {
      setChatRooms([]);
      return;
    }
    fetchChatRooms();
  }, [user, fetchChatRooms]);

  // 새 메시지 들어오면 목록 갱신
  useEffect(() => {
    const remove = addMessageListener((evt) => {
      if (!evt || evt.type !== "NEW_MESSAGE") return;
      const { roomId, message } = evt;
      if (message?.type && message.type !== "CHAT") return; // 시스템 메시지 무시

      const id = String(roomId);
      const ts =
          message.timestamp ?? message.createdAt ?? new Date().toISOString();

      setChatRooms((prev) => {
        const exists = prev.find((r) => String(r.chatRoomId) === id);
        const myType = user?.userType === "CUSTOMER" ? "C" : "S";
        const isFromOther =
            message.senderType && message.senderType !== myType;

        if (!exists) {
          // 방이 없으면 추가
          return [
            ...prev,
            {
              chatRoomId: id,
              sellerId: message.senderType === "S" ? message.senderId : null,
              customerId: message.senderType === "C" ? message.senderId : null,
              sellerStoreName: message.senderType === "S" ? message.senderName : "",
              lastMessage: message.content ?? "",
              lastMessageTime: ts,
              unreadCount: isFromOther ? 1 : 0,
            },
          ];
        }

        // 기존 방 갱신
        return prev.map((r) =>
            String(r.chatRoomId) === id
                ? {
                  ...r,
                  lastMessage: message.content ?? r.lastMessage,
                  lastMessageTime: ts,
                  unreadCount: isFromOther ? (r.unreadCount ?? 0) + 1 : r.unreadCount ?? 0,
                }
                : r
        );
      });
    });
    return remove;
  }, [addMessageListener, user]);

  // 외부에서 사용할 조작 함수들
  const addChatRoom = useCallback((newRoom) => {
    setChatRooms((prev) => {
      const id = newRoom.chatRoomId ?? newRoom.id;
      const exists = prev.find((r) => String(r.chatRoomId) === String(id));
      return exists
          ? prev.map((r) =>
              String(r.chatRoomId) === String(id)
                  ? { ...r, ...newRoom, chatRoomId: String(id) }
                  : r
          )
          : [...prev, { ...newRoom, chatRoomId: String(id) }];
    });
  }, []);

  const updateLastMessage = useCallback((chatRoomId, lastMessage, lastMessageTime) => {
    setChatRooms((prev) =>
        prev.map((room) =>
            String(room.chatRoomId) === String(chatRoomId)
                ? { ...room, lastMessage, lastMessageTime }
                : room
        )
    );
  }, []);

  const updateUnreadCount = useCallback((chatRoomId, unreadCount) => {
    setChatRooms((prev) =>
        prev.map((room) =>
            String(room.chatRoomId) === String(chatRoomId)
                ? { ...room, unreadCount }
                : room
        )
    );
  }, []);

  const value = useMemo(
      () => ({
        chatRooms,
        setChatRooms,
        addChatRoom,
        fetchChatRooms,
        updateLastMessage,
        updateUnreadCount,
        loading,
      }),
      [
        chatRooms,
        addChatRoom,
        fetchChatRooms,
        updateLastMessage,
        updateUnreadCount,
        loading,
      ]
  );

  return (
      <ChatRoomsContext.Provider value={value}>
        {children}
      </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  const ctx = useContext(ChatRoomsContext);
  if (!ctx) throw new Error("useChatRooms must be used within a ChatRoomsProvider");
  return ctx;
}
