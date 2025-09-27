import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWebSocket } from "../../../Context/WebSocketContext";
import useLogin from "../../../Hook/useLogin";
import useUserStatus from "../../../Hook/useUserStatus";
import api from "../../../api/api";
import { useChatRooms } from "../../../Context/ChatRoomsContext";

export default function CustomerChatting() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useLogin();

  const { updateLastMessage, updateUnreadCount, addChatRoom } = useChatRooms();

  const { sellerId, sellerStoreName, chatRoomId: initialChatRoomId, customerId } =
  route.params || {};

  const targetUserId = user?.userType === "CUSTOMER" ? sellerId : customerId;
  const targetUserType = user?.userType === "CUSTOMER" ? "SELLER" : "CUSTOMER";

  const { getStatusText, getStatusColor } = useUserStatus(
      targetUserId,
      targetUserType
  );

  const [chatRoomId, setChatRoomId] = useState(initialChatRoomId);

  useEffect(() => {
    if (initialChatRoomId && initialChatRoomId !== chatRoomId) {
      setChatRoomId(initialChatRoomId);
    }
  }, [initialChatRoomId, chatRoomId]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef(null);

  const {
    connected, connectionStatus, subscribeToRoom, unsubscribeFromRoom,
    sendMessage, getRoomMessages, setRoomMessages, leaveRoom,
  } = useWebSocket();

  // 현재 방 메시지
  const messages = getRoomMessages(chatRoomId || "");

  // 읽음 처리(리스트 뱃지 0으로)
  const markAsRead = useCallback(
      async (roomId, msgs) => {
        try {
          const myType = user?.userType === "CUSTOMER" ? "C" : "S";
          const hasUnreadFromOther = (msgs || []).some(
              (m) =>
                  m &&
                  (m.senderType && m.senderType !== myType) &&
                  (m.read === "N" || m.read === false)
          );
          if (!hasUnreadFromOther) return;

          try {
            await api.post(`/api/chat/rooms/${roomId}/read`);
          } catch (e1) {
            try {
              await api.post(`/api/chat/messages/read`, { chatRoomId: roomId });
            } catch (e2) {
              await api.put(`/api/chat/rooms/${roomId}/read`);
            }
          }
          updateUnreadCount(roomId, 0);
        } catch (e) {
          console.log("읽음 처리 실패:", e?.message);
        }
      },
      [user?.userType, updateUnreadCount]
  );

  // 방 생성/조회
  const createOrGetChatRoom = useCallback(async () => {
    if (chatRoomId) return;

    const body =
        user?.userType === "SELLER"
            ? customerId
                ? { customerId }
                : null
            : sellerId
                ? { sellerId }
                : null;
    if (!body) return;

    setIsLoading(true);
    try {
      const response = await api.post("/api/chat/rooms", body);
      let roomId;
      if (response.data?.data?.chatRoomId) roomId = response.data.data.chatRoomId;
      else if (response.data?.chatRoomId) roomId = response.data.chatRoomId;
      else return;

      setChatRoomId(roomId);

      // 방을 처음 만들었으면 리스트에도 추가
      addChatRoom({
        chatRoomId: roomId,
        sellerId,
        customerId,
        sellerStoreName,
        lastMessage: "",
        lastMessageTime: null,
        unreadCount: 0,
      });
    } catch (error) {
      console.error("채팅방 생성/조회 실패:", error);
      Alert.alert("오류", "채팅방을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [sellerId, customerId, chatRoomId, user?.userType, addChatRoom, sellerStoreName]);

  // 이력 로딩 (시스템 메시지 제외)
  const loadChatMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      let resp;
      try {
        resp = await api.get(`/api/chat/rooms/${chatRoomId}/messages`);
      } catch (e) {
        if (e?.response?.status === 404 || e?.response?.status === 405) {
          resp = await api.get(`/api/chat/rooms/${chatRoomId}`);
        } else {
          throw e;
        }
      }

      const root = resp?.data?.data ?? resp?.data ?? {};
      const extract = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (!obj || typeof obj !== "object") return [];
        const keys = [
          "messages",
          "chatMessages",
          "messageList",
          "chatMessageList",
          "chatMessageDtos",
          "chatMessageDtoList",
          "chatMessageResponseDtos",
          "content",
        ];
        for (const k of keys) if (Array.isArray(obj[k])) return obj[k];
        for (const v of Object.values(obj)) {
          const arr = extract(v);
          if (arr.length) return arr;
        }
        return [];
      };

      const chatMessages = extract(root)
          .filter((m) => !m?.type || m.type === "CHAT") // ✅ 화면엔 CHAT만
          .sort(
              (a, b) =>
                  new Date(a.timestamp ?? a.createdAt) -
                  new Date(b.timestamp ?? b.createdAt)
          );

      setRoomMessages(chatRoomId, chatMessages);
      await markAsRead(chatRoomId, chatMessages);
    } catch (error) {
      console.error("채팅 메시지 로드 실패:", error);
    }
  }, [chatRoomId, setRoomMessages, markAsRead]);

  // 전송
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !chatRoomId || !connected || !targetUserId)
      return;

    const success = sendMessage(chatRoomId, inputMessage.trim(), targetUserId);
    if (success) {
      // 리스트의 마지막 메시지/시간 즉시 갱신
      updateLastMessage(
          chatRoomId,
          inputMessage.trim(),
          new Date().toISOString()
      );
      setInputMessage("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      Alert.alert("전송 실패", "메시지를 전송할 수 없습니다.");
    }
  }, [
    inputMessage,
    chatRoomId,
    connected,
    sendMessage,
    targetUserId,
    updateLastMessage,
  ]);

  // 구독 관리(중복 방지)
  const subscribedRef = useRef(null);
  useEffect(() => {
    if (!connected) return;

    if (subscribedRef.current && subscribedRef.current !== chatRoomId) {
      unsubscribeFromRoom(subscribedRef.current);
      subscribedRef.current = null;
    }
    if (chatRoomId && subscribedRef.current !== chatRoomId) {
      subscribeToRoom(chatRoomId);
      subscribedRef.current = chatRoomId;
    }
    return () => {
      if (subscribedRef.current) {
        unsubscribeFromRoom(subscribedRef.current);
        subscribedRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId, connected]);

  // 이력 로드
  useEffect(() => {
    if (chatRoomId) loadChatMessages();
  }, [chatRoomId, loadChatMessages]);

  // 메시지 → 목록 동기화(중복 방지)
  const lastSyncedRef = useRef(null);
  useEffect(() => {
    if (!chatRoomId || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (!last || (last.type && last.type !== "CHAT")) return;

    const key = `${chatRoomId}-${last?.timestamp ?? last?.createdAt}-${last?.content ?? ""}`;
    if (lastSyncedRef.current === key) return;
    lastSyncedRef.current = key;

    updateLastMessage(
        chatRoomId,
        last.content,
        last.timestamp ?? last.createdAt
    );
  }, [messages, chatRoomId, updateLastMessage]);

  // 생성/조회
  useEffect(() => {
    createOrGetChatRoom();
  }, [createOrGetChatRoom]);

  // leave
  useEffect(() => {
    return () => {
      if (chatRoomId) leaveRoom(chatRoomId);
    };
  }, [chatRoomId, leaveRoom]);

  // 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const parseDate = (s) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const renderMessage = (message, index) => {
    const messageTime = message.timestamp || message.createdAt;
    const isMyMessage =
        message.senderType === (user?.userType === "CUSTOMER" ? "C" : "S");
    const currentTime = parseDate(messageTime).getTime();
    const prevTime = messages[index - 1]
        ? parseDate(
            messages[index - 1].timestamp || messages[index - 1].createdAt
        ).getTime()
        : 0;
    const showTimestamp = index === 0 || currentTime - prevTime > 60000;

    return (
        <View
            key={index}
            style={[
              styles.messageContainer,
              isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
        >
          {!isMyMessage && (
              <Text style={styles.senderName}>{message.senderName}</Text>
          )}
          <View
              style={[
                styles.messageBubble,
                isMyMessage ? styles.myBubble : styles.otherBubble,
              ]}
          >
            <Text
                style={[
                  styles.messageText,
                  isMyMessage ? styles.myMessageText : styles.otherMessageText,
                ]}
            >
              {message.content}
            </Text>
          </View>
          {showTimestamp && (
              <Text style={styles.timestamp}>
                {parseDate(messageTime).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
          )}
          {isMyMessage && message.read === "N" && (
              <Text style={styles.unreadIndicator}>1</Text>
          )}
        </View>
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{sellerStoreName || "채팅"}</Text>
            <View style={styles.statusContainer}>
              <View
                  style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
              />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View
                style={[
                  styles.connectionStatus,
                  {
                    backgroundColor: connected
                        ? "#4CAF50"
                        : connectionStatus === "connecting"
                            ? "#FF9800"
                            : "#F44336",
                  },
                ]}
            >
              <Text style={styles.connectionText}>
                {connectionStatus === "connecting"
                    ? "재연결 중..."
                    : connected
                        ? "연결됨"
                        : "연결 끊김"}
              </Text>
            </View>
          </View>
        </View>

        {/* 메시지 영역 */}
        <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>채팅방을 불러오는 중...</Text>
                </View>
            ) : messages.filter((m) => !m?.type || m.type === "CHAT").length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>첫 메시지를 보내보세요!</Text>
                </View>
            ) : (
                messages
                    .filter((m) => !m?.type || m.type === "CHAT") // ✅ 시스템 메시지 제외
                    .map((m, i) => renderMessage(m, i))
            )}
          </ScrollView>

          {/* 입력 영역 */}
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="메시지를 입력하세요..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                editable={connected && !!chatRoomId}
            />
            <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: inputMessage.trim() && connected ? 1 : 0.5 },
                ]}
                onPress={handleSendMessage}
                disabled={!inputMessage.trim() || !connected}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: { padding: 4 },
  headerCenter: { flex: 1, alignItems: "center", marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  statusText: { fontSize: 12, color: "#666" },
  headerRight: { alignItems: "flex-end" },
  connectionStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  connectionText: { fontSize: 12, color: "white", fontWeight: "500" },
  chatContainer: { flex: 1 },
  messagesContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  messagesContent: { padding: 16, paddingBottom: 8 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: { fontSize: 16, color: "#666" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: { fontSize: 16, color: "#999" },
  messageContainer: { marginBottom: 12 },
  myMessage: { alignItems: "flex-end" },
  otherMessage: { alignItems: "flex-start" },
  senderName: { fontSize: 12, color: "#666", marginBottom: 4, marginLeft: 8 },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: { backgroundColor: "#007AFF" },
  otherBubble: { backgroundColor: "white", borderWidth: 1, borderColor: "#e0e0e0" },
  messageText: { fontSize: 16, lineHeight: 20 },
  myMessageText: { color: "white" },
  otherMessageText: { color: "#333" },
  timestamp: { fontSize: 11, color: "#999", marginTop: 4, marginHorizontal: 8 },
  unreadIndicator: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "600",
    marginTop: 4,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: "#f8f8f8",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
