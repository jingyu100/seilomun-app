import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useLogin from "../Hook/useLogin";
import { API_BASE_URL } from "../api/api";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, isLoggedIn } = useLogin();

  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastDisconnectReason, setLastDisconnectReason] = useState(null);

  const [messages, setMessages] = useState({}); // { [chatRoomId]: [message, ...] }
  const [activeSubscriptions, setActiveSubscriptions] = useState(new Set());

  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map()); // chatRoomId -> subscription
  const reconnectTimeoutRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const isManualDisconnectRef = useRef(false); // 수동 연결 해제 플래그

  // 🔔 외부(목록)로 새 메시지 브로드캐스트용
  const messageListenersRef = useRef(new Set());
  const addMessageListener = useCallback((fn) => {
    if (typeof fn !== "function") return () => {};
    messageListenersRef.current.add(fn);
    return () => {
      messageListenersRef.current.delete(fn);
    };
  }, []);

  // 자동 재연결
  const scheduleReconnect = useCallback(
      (delay = 3000) => {
        if (isManualDisconnectRef.current) return;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (
              !isManualDisconnectRef.current &&
              user &&
              isLoggedIn &&
              !connected &&
              !clientRef.current?.connected
          ) {
            connectWebSocket();
          }
        }, delay);
      },
      // connectWebSocket은 아래에서 useCallback으로 만들어져 참조가 안정적이라 의존성에 넣어도 괜찮습니다.
      [user, isLoggedIn, connected]
  );

  const disconnectWebSocket = useCallback((reason = "manual") => {
    setLastDisconnectReason(reason);
    if (["logout", "unmount", "manual"].includes(reason)) {
      isManualDisconnectRef.current = true;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    subscriptionsRef.current.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch {}
    });
    subscriptionsRef.current.clear();
    setActiveSubscriptions(new Set());

    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch {}
      clientRef.current = null;
    }
    setConnected(false);
    setStompClient(null);
    setConnectionStatus("disconnected");
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!user || !isLoggedIn) return;
    if (connected && clientRef.current?.connected) return;

    isManualDisconnectRef.current = false;

    if (clientRef.current) {
      try {
        const old = clientRef.current;
        clientRef.current = null;
        old.deactivate();
      } catch {}
      setConnected(false);
    }

    setConnectionStatus("connecting");
    try {
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      const sessionId = `${user.id}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

      const headers = {
        userId: user?.id ? String(user.id) : "",
        userType: user?.userType === "CUSTOMER" ? "C" : "S",
        userName: user?.nickname || "익명사용자",
        sessionId,
      };

      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 2000,
        connectionTimeout: 10000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);
          setStompClient(client);
          setConnectionStatus("connected");
          setLastDisconnectReason(null);
        },
        onDisconnect: (frame) => {
          if (frame?.command === "RECEIPT") return;
          setConnected(false);
          setStompClient(null);
          setConnectionStatus("disconnected");
          if (!isManualDisconnectRef.current && user && isLoggedIn) {
            scheduleReconnect(3000);
          }
        },
        onStompError: (frame) => {
          if (clientRef.current) {
            try {
              clientRef.current.deactivate();
            } catch {}
            clientRef.current = null;
          }
          setConnected(false);
          setConnectionStatus("error");
          setLastDisconnectReason("stomp_error");
          if (
              frame.headers?.message?.includes("Frame must be terminated") ||
              frame.headers?.message?.includes("session") ||
              frame.headers?.message?.includes("octet")
          ) {
            setTimeout(() => {
              if (user && isLoggedIn && !connected && !clientRef.current) {
                connectWebSocket();
              }
            }, 3000);
          }
        },
        onWebSocketError: () => {
          setConnectionStatus("error");
          setLastDisconnectReason("websocket_error");
        },
        onWebSocketClose: (event) => {
          setConnected(false);
          setConnectionStatus("disconnected");
          if (
              !isManualDisconnectRef.current &&
              event.code === 1006 &&
              user &&
              isLoggedIn
          ) {
            const delay = AppState.currentState === "active" ? 500 : 2000;
            scheduleReconnect(delay);
          }
        },
        connectHeaders: headers,
        debug: (s) => console.log("STOMP DEBUG:", s),
      });

      client.activate();
      clientRef.current = client;
    } catch (e) {
      setConnectionStatus("error");
      setLastDisconnectReason("activate_failed");
    }
  }, [user, isLoggedIn, connected, scheduleReconnect]);

  const subscribeToRoom = useCallback(
      (chatRoomId) => {
        if (!stompClient || !connected) return;
        if (activeSubscriptions.has(chatRoomId)) return;

        const old = subscriptionsRef.current.get(chatRoomId);
        if (old) {
          try {
            old.unsubscribe();
          } catch {}
          subscriptionsRef.current.delete(chatRoomId);
        }

        try {
          const subscription = stompClient.subscribe(
              `/queue/messages/${chatRoomId}`,
              (message) => {
                try {
                  const chatMessage = JSON.parse(message.body);

                  // ✅ 시스템 메시지(JOIN/LEAVE 등)는 화면/목록 반영하지 않음
                  if (chatMessage.type && chatMessage.type !== "CHAT") {
                    // 필요 시 JOIN에 대한 읽음 처리만 수행
                    if (
                        chatMessage.type === "JOIN" &&
                        chatMessage.content === "USER_ENTER"
                    ) {
                      const myUserType = user?.userType === "CUSTOMER" ? "C" : "S";
                      const myUserId = user?.id;
                      if (chatMessage.senderId !== myUserId) {
                        setMessages((prev) => {
                          const curr = prev[chatRoomId] || [];
                          const updated = curr.map((m) =>
                              m.senderType === myUserType && m.read === "N"
                                  ? { ...m, read: "Y" }
                                  : m
                          );
                          return { ...prev, [chatRoomId]: updated };
                        });
                      }
                    }
                    return; // 시스템 메시지는 여기서 종료
                  }

                  // ✅ CHAT만 브로드캐스트 & 스토어 적재
                  try {
                    messageListenersRef.current.forEach((fn) => {
                      fn({
                        type: "NEW_MESSAGE",
                        roomId: String(chatRoomId),
                        message: chatMessage,
                      });
                    });
                  } catch {}

                  setMessages((prev) => ({
                    ...prev,
                    [chatRoomId]: [...(prev[chatRoomId] || []), chatMessage],
                  }));
                } catch {}
              },
              {
                userId: user?.id ? String(user.id) : "",
                userType: user?.userType === "CUSTOMER" ? "C" : "S",
              }
          );

          subscriptionsRef.current.set(chatRoomId, subscription);
          setActiveSubscriptions((prev) => new Set([...prev, chatRoomId]));

          // 입장 알림(서버가 필요로 하면)
          stompClient.publish({
            destination: "/app/chat.enterRoom",
            body: JSON.stringify({
              type: "JOIN",
              chatRoomId: parseInt(chatRoomId, 10),
              senderId: user?.id,
              senderType: user?.userType === "CUSTOMER" ? "C" : "S",
            }),
          });
        } catch (e) {
          console.log("채팅방 구독 실패:", e?.message);
        }
      },
      [stompClient, connected, user, activeSubscriptions]
  );

  const subscribeToRoomsBulk = useCallback(
      (ids = []) => {
        ids.filter(Boolean).forEach((id) => subscribeToRoom(String(id)));
      },
      [subscribeToRoom]
  );

  const unsubscribeFromRoom = useCallback((chatRoomId) => {
    const sub = subscriptionsRef.current.get(chatRoomId);
    if (sub) {
      try {
        sub.unsubscribe();
      } catch {}
      subscriptionsRef.current.delete(chatRoomId);
      setActiveSubscriptions((prev) => {
        const ns = new Set(prev);
        ns.delete(chatRoomId);
        return ns;
      });
    }
  }, []);

  const sendMessage = useCallback(
      (chatRoomId, content = null, receiverId = null) => {
        if (!stompClient || !connected || !content || !String(content).trim())
          return false;

        const message = {
          type: "CHAT",
          chatRoomId: parseInt(chatRoomId, 10),
          senderId: user?.id,
          receiverId,
          senderName: user?.nickname || "익명사용자",
          senderType: user?.userType === "CUSTOMER" ? "C" : "S",
          content: String(content).trim(),
        };

        try {
          stompClient.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(message),
          });
          return true;
        } catch {
          return false;
        }
      },
      [stompClient, connected, user]
  );

  const getRoomMessages = useCallback(
      (chatRoomId) => messages[chatRoomId] || [],
      [messages]
  );
  const setRoomMessages = useCallback((chatRoomId, list) => {
    setMessages((prev) => ({ ...prev, [chatRoomId]: list || [] }));
  }, []);

  const leaveRoom = useCallback(
      (chatRoomId) => {
        if (!stompClient || !connected) return;
        try {
          stompClient.publish({
            destination: "/app/chat.leaveRoom",
            body: JSON.stringify({
              type: "LEAVE",
              chatRoomId: parseInt(chatRoomId, 10),
              senderId: user?.id,
              senderType: user?.userType === "CUSTOMER" ? "C" : "S",
            }),
          });
        } catch {}
      },
      [stompClient, connected, user]
  );

  // AppState 감지
  useEffect(() => {
    const handle = (next) => {
      if (
          appStateRef.current.match(/inactive|background/) &&
          next === "active" &&
          user &&
          isLoggedIn
      ) {
        if (!connected || !clientRef.current?.connected) {
          if (reconnectTimeoutRef.current)
            clearTimeout(reconnectTimeoutRef.current);
          isManualDisconnectRef.current = false;
          setTimeout(() => connectWebSocket(), 50);
        }
      }
      if (next.match(/inactive|background/)) {
        isManualDisconnectRef.current = false;
      }
      appStateRef.current = next;
    };
    const sub = AppState.addEventListener("change", handle);
    return () => sub?.remove();
  }, [user, isLoggedIn, connected, connectWebSocket]);

  useEffect(() => {
    if (user && isLoggedIn && !connected && !clientRef.current) {
      connectWebSocket();
    }
    if ((!user || !isLoggedIn) && (connected || clientRef.current)) {
      disconnectWebSocket("logout");
    }
  }, [user, isLoggedIn, connected, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    return () => {
      disconnectWebSocket("unmount");
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [disconnectWebSocket]);

  const value = {
    connected,
    connectionStatus,
    lastDisconnectReason,
    activeSubscriptions,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToRoom,
    subscribeToRoomsBulk,
    unsubscribeFromRoom,
    leaveRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
    addMessageListener,
  };

  return (
      <WebSocketContext.Provider value={value}>
        {children}
      </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket은 WebSocketProvider 내에서 사용되어야 합니다.");
  return ctx;
};
