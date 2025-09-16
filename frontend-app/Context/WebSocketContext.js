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

  // 자동 재연결 함수
  const scheduleReconnect = useCallback(
    (delay = 3000) => {
      // 수동 해제된 경우 재연결 건너뛰기
      if (isManualDisconnectRef.current) {
        console.log("🚫 수동 해제 상태이므로 재연결 건너뛰기");
        return;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      console.log(`🔄 ${delay / 1000}초 후 자동 재연결 예약`);
      reconnectTimeoutRef.current = setTimeout(() => {
        // 재연결 조건을 더 엄격하게 체크
        if (
          !isManualDisconnectRef.current &&
          user &&
          isLoggedIn &&
          !connected &&
          !clientRef.current?.connected
        ) {
          console.log("🔄 자동 재연결 시도...");
          connectWebSocket();
        } else {
          console.log("🚫 재연결 조건 불만족 - 건너뛰기");
        }
      }, delay);
    },
    [user, isLoggedIn, connected, connectWebSocket]
  );

  const disconnectWebSocket = useCallback((reason = "manual") => {
    console.log(`🔌 WebSocket 연결 해제 시도 (${reason})`);
    setLastDisconnectReason(reason);

    // 수동 해제 플래그 설정 (로그아웃, unmount 등)
    if (reason === "logout" || reason === "unmount" || reason === "manual") {
      isManualDisconnectRef.current = true;
    }

    // 재연결 타이머 정리
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    subscriptionsRef.current.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (e) {}
    });
    subscriptionsRef.current.clear();
    setActiveSubscriptions(new Set());

    if (clientRef.current) {
      try {
        console.log("🧹 WebSocket 클라이언트 비활성화 중...");
        clientRef.current.deactivate();
        console.log("✅ WebSocket 클라이언트 비활성화 완료");
      } catch (e) {
        console.log("WebSocket 해제 오류 (무시):", e.message);
      }
      clientRef.current = null;
    }

    setConnected(false);
    setStompClient(null);
    setConnectionStatus("disconnected");
    console.log("🔌 WebSocket 상태 초기화 완료");
  }, []);

  const connectWebSocket = useCallback(() => {
    console.log("🔌 WebSocket 연결 시도...");
    console.log("user:", user);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("connected:", connected);
    console.log("clientRef.current:", clientRef.current);

    if (!user || !isLoggedIn) {
      console.log("❌ WebSocket 연결 조건 실패 - 사용자 정보 없음");
      return;
    }

    // 이미 연결되어 있다면 건너뛰기
    if (connected && clientRef.current?.connected) {
      console.log("✅ 이미 WebSocket 연결됨");
      return;
    }

    // 수동 해제 플래그 초기화 (새로운 연결 시작)
    isManualDisconnectRef.current = false;

    // 기존 클라이언트가 있다면 조용히 정리
    if (clientRef.current) {
      console.log("🧹 기존 클라이언트 정리 중...");
      try {
        // 조용히 비활성화 (onDisconnect 이벤트 방지)
        const oldClient = clientRef.current;
        clientRef.current = null; // 먼저 참조 제거
        oldClient.deactivate();
      } catch (e) {
        console.log("기존 클라이언트 정리 오류 (무시):", e.message);
      }
      setConnected(false);
    }

    console.log("📡 WebSocket 연결 진행 중...");
    setConnectionStatus("connecting");

    try {
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      console.log("✅ SockJS 소켓 생성됨");

      // 더 고유한 세션 ID 생성
      const sessionId = `${user.id}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const headers = {
        userId: user?.id ? String(user.id) : "",
        userType: user?.userType === "CUSTOMER" ? "C" : "S",
        userName: user?.nickname || "익명사용자",
        sessionId: sessionId, // 고유 세션 ID 추가
      };
      console.log("📋 연결 헤더:", headers);

      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 2000, // 2초로 단축
        connectionTimeout: 10000, // 10초로 단축 (더 빠른 반응)
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("🎉 WebSocket 연결 성공!", frame);
          setConnected(true);
          setStompClient(client);
          setConnectionStatus("connected");
          setLastDisconnectReason(null);
        },
        onDisconnect: (frame) => {
          console.log("🔌 WebSocket 연결 해제됨", frame);
          console.log(
            "연결 해제 이유:",
            frame?.headers?.["disconnect-reason"] || "알 수 없음"
          );
          console.log("현재 user 상태:", user);
          console.log("현재 isLoggedIn 상태:", isLoggedIn);
          console.log("수동 해제 여부:", isManualDisconnectRef.current);

          // RECEIPT 메시지로 인한 disconnect는 무시
          if (frame?.command === "RECEIPT") {
            console.log("📋 RECEIPT로 인한 연결 해제 - 재연결 건너뛰기");
            return;
          }

          setConnected(false);
          setStompClient(null);
          setConnectionStatus("disconnected");

          // 수동 해제가 아니고 로그인 상태일 때만 자동 재연결
          if (!isManualDisconnectRef.current && user && isLoggedIn) {
            console.log("📱 자동 연결 해제 감지 - 재연결 예약");
            scheduleReconnect(3000);
          } else {
            console.log("🚫 재연결 건너뛰기 (수동 해제 또는 로그아웃)");
          }
        },
        onStompError: (frame) => {
          console.error("❌ STOMP 오류:", frame);
          console.error("STOMP 오류 상세:", frame.headers);
          console.error("STOMP 오류 내용:", frame.body);

          // 클라이언트 정리
          if (clientRef.current) {
            try {
              clientRef.current.deactivate();
            } catch (e) {
              console.log("STOMP 오류 후 클라이언트 정리 오류:", e.message);
            }
            clientRef.current = null;
          }

          setConnected(false);
          setConnectionStatus("error");
          setLastDisconnectReason("stomp_error");

          // 세션 충돌 등의 오류인 경우 잠시 후 재연결 시도
          if (
            frame.headers?.message?.includes("Frame must be terminated") ||
            frame.headers?.message?.includes("session") ||
            frame.headers?.message?.includes("octet")
          ) {
            console.log("🔄 STOMP 프레임 오류로 인한 자동 재연결 예정...");
            setTimeout(() => {
              if (user && isLoggedIn && !connected && !clientRef.current) {
                console.log("🔄 자동 재연결 시작...");
                connectWebSocket();
              }
            }, 3000); // 3초 후 재연결
          }
        },
        onWebSocketError: (error) => {
          console.error("❌ WebSocket 오류:", error);
          console.error("WebSocket 오류 상세:", error.type, error.message);
          setConnectionStatus("error");
          setLastDisconnectReason("websocket_error");
        },
        onWebSocketClose: (event) => {
          console.log("🔌 WebSocket 소켓 닫힘:", event.code, event.reason);
          console.log("정상 종료:", event.wasClean);
          console.log("수동 해제 여부:", isManualDisconnectRef.current);

          setConnected(false);
          setConnectionStatus("disconnected");

          // 수동 해제가 아닌 비정상 종료만 재연결
          if (
            !isManualDisconnectRef.current &&
            event.code === 1006 &&
            user &&
            isLoggedIn
          ) {
            console.log("📱 비정상 연결 끊김 - 자동 재연결 예약");
            // 앱이 활성 상태면 빠른 재연결, 아니면 일반 재연결
            const delay = AppState.currentState === "active" ? 500 : 2000;
            scheduleReconnect(delay);
          } else {
            console.log("🚫 정상 종료 또는 수동 해제 - 재연결 건너뛰기");
          }
        },
        connectHeaders: headers,
        debug: (str) => {
          console.log("STOMP DEBUG:", str);
        },
      });

      console.log("🚀 WebSocket 클라이언트 활성화...");
      client.activate();
      clientRef.current = client;
    } catch (e) {
      console.error("❌ WebSocket 클라이언트 생성/활성화 실패:", e);
      setConnectionStatus("error");
      setLastDisconnectReason("activate_failed");
    }
  }, [user, isLoggedIn, connected]);

  const subscribeToRoom = useCallback(
    (chatRoomId) => {
      console.log(`🔗 채팅방 구독 시도: ${chatRoomId}`);
      console.log("stompClient:", !!stompClient);
      console.log("connected:", connected);
      console.log("이미 구독된 방:", Array.from(activeSubscriptions));

      if (!stompClient || !connected) {
        console.log("❌ 구독 실패: 클라이언트 또는 연결 상태 문제");
        return;
      }

      if (activeSubscriptions.has(chatRoomId)) {
        console.log("⚠️ 이미 구독된 채팅방:", chatRoomId);
        return;
      }

      // 기존 구독이 있다면 정리
      const existingSubscription = subscriptionsRef.current.get(chatRoomId);
      if (existingSubscription) {
        console.log("🧹 기존 구독 정리:", chatRoomId);
        try {
          existingSubscription.unsubscribe();
        } catch (e) {
          console.log("기존 구독 정리 오류 (무시):", e.message);
        }
        subscriptionsRef.current.delete(chatRoomId);
      }

      try {
        const subscription = stompClient.subscribe(
          `/queue/messages/${chatRoomId}`,
          (message) => {
            try {
              const chatMessage = JSON.parse(message.body);

              // 상대방 입장 알림 처리
              if (chatMessage.type === "JOIN" && chatMessage.content === "USER_ENTER") {
                const myUserType = user?.userType === "CUSTOMER" ? "C" : "S";
                const myUserId = user?.id;

                // 상대방이 입장한 경우에만 읽음 처리 (내가 입장한 경우 제외)
                if (chatMessage.senderId !== myUserId) {
                  console.log("📖 상대방 입장으로 인한 메시지 읽음 처리");
                  setMessages((prev) => {
                    const current = prev[chatRoomId] || [];
                    const updated = current.map((m) =>
                      m.senderType === myUserType && m.read === "N"
                        ? { ...m, read: "Y" }
                        : m
                    );
                    return { ...prev, [chatRoomId]: updated };
                  });
                } else {
                  console.log("📱 내가 입장 - 읽음 처리 건너뛰기");
                }
                return;
              }

              setMessages((prev) => ({
                ...prev,
                [chatRoomId]: [...(prev[chatRoomId] || []), chatMessage],
              }));
            } catch (err) {}
          },
          {
            userId: user?.id ? String(user.id) : "",
            userType: user?.userType === "CUSTOMER" ? "C" : "S",
          }
        );

        subscriptionsRef.current.set(chatRoomId, subscription);
        setActiveSubscriptions((prev) => new Set([...prev, chatRoomId]));

        console.log(`✅ 채팅방 ${chatRoomId} 구독 성공`);

        const enterMessage = {
          type: "JOIN",
          chatRoomId: parseInt(chatRoomId, 10),
          senderId: user?.id,
          senderType: user?.userType === "CUSTOMER" ? "C" : "S",
        };

        console.log("🚪 채팅방 입장 메시지 전송:", enterMessage);
        stompClient.publish({
          destination: "/app/chat.enterRoom",
          body: JSON.stringify(enterMessage),
        });
      } catch (e) {
        console.error("❌ 채팅방 구독 실패:", e);
      }
    },
    [stompClient, connected, user, activeSubscriptions]
  );

  const unsubscribeFromRoom = useCallback((chatRoomId) => {
    console.log(`🔗 채팅방 구독 해제 시도: ${chatRoomId}`);
    const subscription = subscriptionsRef.current.get(chatRoomId);
    if (subscription) {
      try {
        subscription.unsubscribe();
        console.log(`✅ 채팅방 ${chatRoomId} 구독 해제 성공`);
      } catch (e) {
        console.log(`❌ 채팅방 ${chatRoomId} 구독 해제 실패:`, e.message);
      }
      subscriptionsRef.current.delete(chatRoomId);
      setActiveSubscriptions((prev) => {
        const ns = new Set(prev);
        ns.delete(chatRoomId);
        return ns;
      });
    } else {
      console.log(`⚠️ 채팅방 ${chatRoomId} 구독 정보 없음`);
    }
  }, []);

  const sendMessage = useCallback(
    (chatRoomId, content = null, receiverId = null) => {
      console.log("🚀 WebSocket sendMessage 호출됨");
      console.log("stompClient:", !!stompClient);
      console.log("connected:", connected);
      console.log("content:", content);
      console.log("user:", user);

      if (!stompClient || !connected || !content || !String(content).trim()) {
        console.log("❌ sendMessage 조건 실패:");
        console.log("  - stompClient:", !!stompClient);
        console.log("  - connected:", connected);
        console.log("  - content:", content);
        return false;
      }

      const message = {
        type: "CHAT",
        chatRoomId: parseInt(chatRoomId, 10),
        senderId: user?.id,
        receiverId: receiverId,
        senderName: user?.nickname || "익명사용자",
        senderType: user?.userType === "CUSTOMER" ? "C" : "S",
        content: String(content).trim(),
      };

      console.log("📨 전송할 메시지:", message);

      try {
        stompClient.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(message),
        });
        console.log("✅ STOMP publish 성공");
        return true;
      } catch (e) {
        console.error("❌ STOMP publish 실패:", e);
        return false;
      }
    },
    [stompClient, connected, user]
  );

  const getRoomMessages = useCallback(
    (chatRoomId) => messages[chatRoomId] || [],
    [messages]
  );

  const setRoomMessages = useCallback((chatRoomId, messageList) => {
    setMessages((prev) => ({ ...prev, [chatRoomId]: messageList || [] }));
  }, []);

  const leaveRoom = useCallback(
    (chatRoomId) => {
      if (!stompClient || !connected) return;
      try {
        const leaveMessage = {
          type: "LEAVE",
          chatRoomId: parseInt(chatRoomId, 10),
          senderId: user?.id,
          senderType: user?.userType === "CUSTOMER" ? "C" : "S",
        };
        stompClient.publish({
          destination: "/app/chat.leaveRoom",
          body: JSON.stringify(leaveMessage),
        });
      } catch (e) {}
    },
    [stompClient, connected, user]
  );

  // AppState 변경 감지로 포그라운드 복귀 시 즉시 재연결
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log("📱 AppState 변경:", appStateRef.current, "→", nextAppState);

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        user &&
        isLoggedIn
      ) {
        console.log("🚀 포그라운드 복귀 감지");
        console.log("현재 연결 상태:", {
          connected,
          clientConnected: clientRef.current?.connected,
        });

        // 연결이 끊어져 있다면 즉시 재연결
        if (!connected || !clientRef.current?.connected) {
          console.log("🚀 연결 끊김 감지 - 모든 타이머 취소 후 즉시 재연결");

          // 기존 재연결 타이머 즉시 취소
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }

          // 수동 해제 플래그 해제 (포그라운드 복귀는 자동 재연결 허용)
          isManualDisconnectRef.current = false;

          // 50ms 후 즉시 재연결 (UI 업데이트 후)
          setTimeout(() => {
            connectWebSocket();
          }, 50);
        } else {
          console.log("✅ 이미 연결되어 있음 - 재연결 건너뛰기");
        }
      }

      // 백그라운드로 갈 때 수동 해제 플래그 설정
      if (nextAppState.match(/inactive|background/)) {
        console.log("📱 백그라운드 진입 - 연결 유지 플래그 설정");
        // 백그라운드 진입은 의도적 해제가 아님을 표시
        isManualDisconnectRef.current = false;
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription?.remove();
    };
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
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
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
    unsubscribeFromRoom,
    leaveRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket은 WebSocketProvider 내에서 사용되어야 합니다.");
  return ctx;
};
