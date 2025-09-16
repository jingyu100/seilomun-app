import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWebSocket } from "../../../Context/WebSocketContext";
import useLogin from "../../../Hook/useLogin";
import useUserStatus from "../../../Hook/useUserStatus";
import api from "../../../api/api";

export default function CustomerChatting() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useLogin();

  // 라우트에서 채팅방 정보 받기 (sellerId, sellerStoreName 등)
  const {
    sellerId,
    sellerStoreName,
    chatRoomId: initialChatRoomId,
    customerId,
  } = route.params || {};

  // 상대방 정보 결정
  const targetUserId = user?.userType === "CUSTOMER" ? sellerId : customerId;
  const targetUserType = user?.userType === "CUSTOMER" ? "SELLER" : "CUSTOMER";

  // 상대방 온라인 상태 확인
  const { getStatusText, getStatusColor } = useUserStatus(targetUserId, targetUserType);

  const [chatRoomId, setChatRoomId] = useState(initialChatRoomId);

  // initialChatRoomId가 변경되면 업데이트 (채팅방 목록에서 온 경우)
  useEffect(() => {
    if (initialChatRoomId && initialChatRoomId !== chatRoomId) {
      console.log("📋 initialChatRoomId로 chatRoomId 업데이트:", initialChatRoomId);
      setChatRoomId(initialChatRoomId);
    }
  }, [initialChatRoomId, chatRoomId]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef(null);

  const {
    connected,
    connectionStatus,
    subscribeToRoom,
    unsubscribeFromRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
    leaveRoom,
  } = useWebSocket();

  // 현재 채팅방의 메시지들
  const messages = getRoomMessages(chatRoomId || "");

  // 채팅방 생성 또는 조회
  const createOrGetChatRoom = useCallback(async () => {
    console.log("=== createOrGetChatRoom 호출됨 ===");
    console.log("sellerId:", sellerId);
    console.log("chatRoomId:", chatRoomId);

    // 이미 chatRoomId가 있으면 건너뛰기 (채팅방 목록에서 온 경우)
    if (chatRoomId) {
      console.log("✅ 이미 chatRoomId가 있음:", chatRoomId);
      return;
    }

    // sellerId가 없으면 건너뛰기
    if (!sellerId) {
      console.log("❌ sellerId가 없음");
      return;
    }

    console.log("API 호출 시작...");
    setIsLoading(true);
    try {
      const response = await api.post("/api/chat/rooms", {
        sellerId: sellerId,
      });

      console.log("✅ 채팅방 API 전체 응답:", response.data);
      console.log("✅ response.data.data:", response.data.data);

      // 백엔드 ApiResponseJson 구조 분석
      let roomId;
      if (response.data.data) {
        roomId = response.data.data.chatRoomId;
      } else if (response.data.chatRoomId) {
        roomId = response.data.chatRoomId;
      } else {
        console.error("chatRoomId를 찾을 수 없습니다. 응답 구조:", response.data);
        return;
      }

      setChatRoomId(roomId);
      console.log("채팅방 생성/조회 성공:", roomId);
    } catch (error) {
      console.error("❌ 채팅방 생성/조회 실패:", error);
      console.error("❌ 에러 응답:", error.response?.data);
      console.error("❌ 에러 상태:", error.response?.status);
      Alert.alert("오류", "채팅방을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [sellerId, chatRoomId]);

  // 기존 채팅 메시지 불러오기
  const loadChatMessages = useCallback(async () => {
    console.log("=== loadChatMessages 호출됨 ===");
    console.log("chatRoomId:", chatRoomId);

    if (!chatRoomId) {
      console.log("chatRoomId가 없어서 메시지 로드 중단");
      return;
    }

    try {
      const response = await api.get(`/api/chat/rooms/${chatRoomId}`);
      console.log("채팅 메시지 API 전체 응답:", response.data);

      // ApiResponseJson 구조에 맞게 수정
      const messageData = response.data.data || response.data;
      const chatMessages = messageData.ok || messageData || [];

      console.log("파싱된 메시지들:", chatMessages);
      console.log("첫 번째 메시지 구조:", chatMessages[0]);

      setRoomMessages(chatRoomId, chatMessages);

      console.log("기존 채팅 메시지 로드:", chatMessages.length, "개");
    } catch (error) {
      console.error("채팅 메시지 로드 실패:", error);
    }
  }, [chatRoomId]);

  // 메시지 전송
  const handleSendMessage = useCallback(() => {
    console.log("📤 메시지 전송 시도...");
    console.log("inputMessage:", inputMessage);
    console.log("chatRoomId:", chatRoomId);
    console.log("connected:", connected);

    if (!inputMessage.trim()) {
      console.log("❌ 빈 메시지");
      return;
    }
    if (!chatRoomId) {
      console.log("❌ chatRoomId 없음");
      return;
    }
    if (!connected) {
      console.log("❌ WebSocket 연결 안됨");
      Alert.alert("연결 오류", "채팅 서버에 연결되지 않았습니다.");
      return;
    }

    console.log("✅ 조건 통과, sendMessage 호출...");
    const success = sendMessage(chatRoomId, inputMessage.trim(), sellerId);
    console.log("sendMessage 결과:", success);

    if (success) {
      console.log("✅ 메시지 전송 성공");
      setInputMessage("");
      // 스크롤을 맨 아래로
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      console.log("❌ 메시지 전송 실패");
      Alert.alert("전송 실패", "메시지를 전송할 수 없습니다.");
    }
  }, [inputMessage, chatRoomId, connected, sendMessage, sellerId]);

  // 채팅방 구독/해제
  useEffect(() => {
    if (chatRoomId && connected) {
      console.log("🔗 채팅방 구독 및 메시지 로드:", chatRoomId);
      subscribeToRoom(chatRoomId);

      return () => {
        console.log("🔗 채팅방 구독 해제:", chatRoomId);
        unsubscribeFromRoom(chatRoomId);
      };
    }
  }, [chatRoomId, connected]);

  // 메시지 로드는 별도 useEffect로 분리 (한 번만 실행)
  useEffect(() => {
    if (chatRoomId) {
      loadChatMessages();
    }
  }, [chatRoomId]); // chatRoomId가 변경될 때만 실행

  // 컴포넌트 마운트 시 채팅방 생성/조회
  useEffect(() => {
    createOrGetChatRoom();
  }, [createOrGetChatRoom]);

  // 컴포넌트 언마운트 시 채팅방 나가기
  useEffect(() => {
    return () => {
      if (chatRoomId) {
        leaveRoom(chatRoomId);
      }
    };
  }, [chatRoomId, leaveRoom]);

  // 새 메시지가 오면 스크롤 맨 아래로
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 안전한 날짜 파싱 함수
  const parseDate = (dateString) => {
    if (!dateString) return new Date();

    try {
      // ISO 8601 형식 처리
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return new Date();
      }
      return date;
    } catch (error) {
      console.warn("Date parsing error:", error, dateString);
      return new Date();
    }
  };

  // 메시지 아이템 렌더링
  const renderMessage = (message, index) => {
    // timestamp 또는 createdAt 필드 사용
    const messageTime = message.timestamp || message.createdAt;

    // 디버깅 완료: 메시지 렌더링 로그 제거
    // console.log(`메시지 ${index} 디버깅:`, { ... });
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
        {!isMyMessage && <Text style={styles.senderName}>{message.senderName}</Text>}
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{sellerStoreName || "채팅"}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
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
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>첫 메시지를 보내보세요!</Text>
            </View>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
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
            editable={connected}
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  connectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectionText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: "#007AFF",
  },
  otherBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    marginHorizontal: 8,
  },
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
