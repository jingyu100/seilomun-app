import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useLogin from "../../../Hook/useLogin";
import { useChatRooms } from "../../../Context/ChatRoomsContext";
import { S3_BASE_URL } from "../../../api/api";

export default function ChatRoomList() {
  const navigation = useNavigation();
  const { user } = useLogin();
  const { chatRooms, fetchChatRooms, loading } = useChatRooms();
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // 새로고침 핸들러
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchChatRooms();
    } finally {
      setRefreshing(false);
    }
  };

  // 채팅방 클릭 핸들러
  const handleChatRoomPress = (chatRoom) => {
    console.log("📋 채팅방 선택:", chatRoom);
    navigation.navigate("CustomerChatting", {
        chatRoomId: chatRoom.chatRoomId,      // (위 1)로 이제 정상 값
        sellerId: chatRoom.sellerId,
        customerId: chatRoom.customerId,      // 판매자일 때 필요
        sellerStoreName: chatRoom.sellerStoreName,
    });
  };

  // 상대방 이름 결정
  const getRoomTitle = (room) => {
    return user?.userType === "SELLER"
      ? room.customerNickname || "고객"
      : room.sellerStoreName || "매장";
  };

  // 프로필 이미지 URL 가져오기 (웹과 동일한 로직)
  const getProfileImageUrl = (room) => {
    const imageUrl =
      user?.userType === "SELLER" ? room.customerPhotoUrl : room.sellerPhotoUrl;

    if (!imageUrl || imageUrl.trim() === "") {
      return null;
    }

    // 이미 완전한 URL인 경우
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // S3 기본 URL 추가
    return `${S3_BASE_URL}${imageUrl}`;
  };

  // 프로필 이니셜 가져오기
  const getProfileInitial = (room) => {
    const name = getRoomTitle(room);
    return name === "고객" || name === "매장" ? name[0] : name.charAt(0).toUpperCase();
  };

  // 마지막 메시지 텍스트
  const getLastMessageText = (room) => {
    return room.lastMessage && room.lastMessage.trim() !== ""
      ? room.lastMessage
      : "새 대화를 시작해보세요";
  };

  // 시간 포맷팅
  const formatTime = (timeString) => {
    if (!timeString) return "";

    try {
      const date = new Date(timeString);
      const now = new Date();
      const diff = now - date;

      // 오늘인 경우 시간만 표시
      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // 일주일 이내인 경우 요일 표시
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString("ko-KR", { weekday: "short" });
      }

      // 그 외의 경우 날짜 표시
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채팅</Text>
        <View style={styles.headerRight}>
          <Text style={styles.chatCount}>({chatRooms.length})</Text>
        </View>
      </View>

      {/* 채팅방 목록 */}
      <ScrollView
        style={styles.chatList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>채팅방을 불러오는 중...</Text>
          </View>
        ) : chatRooms.length > 0 ? (
          chatRooms.map((chatRoom) => {
            const profileImageUrl = getProfileImageUrl(chatRoom);
            const profileInitial = getProfileInitial(chatRoom);

            return (
              <TouchableOpacity
                key={chatRoom.chatRoomId || chatRoom.id}
                style={styles.chatRoomItem}
                onPress={() => handleChatRoomPress(chatRoom)}
              >
                {/* 프로필 이미지/이니셜 */}
                <View style={styles.profileContainer}>
                  {profileImageUrl && !failedImages.has(chatRoom.chatRoomId) ? (
                    <Image
                      source={{ uri: profileImageUrl }}
                      style={styles.profileImage}
                      onError={() => {
                        console.log("프로필 이미지 로드 실패:", profileImageUrl);
                        setFailedImages(
                          (prev) => new Set([...prev, chatRoom.chatRoomId])
                        );
                      }}
                    />
                  ) : (
                    <View style={styles.profileCircle}>
                      <Text style={styles.profileInitial}>{profileInitial}</Text>
                    </View>
                  )}
                </View>

                {/* 채팅방 정보 */}
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatRoomName} numberOfLines={1}>
                      {getRoomTitle(chatRoom)}
                    </Text>
                    <Text style={styles.chatTime}>
                      {formatTime(chatRoom.lastMessageTime)}
                    </Text>
                  </View>
                  <View style={styles.chatFooter}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {getLastMessageText(chatRoom)}
                    </Text>
                    {chatRoom.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>
                          {chatRoom.unreadCount > 99 ? "99+" : chatRoom.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>아직 채팅방이 없습니다</Text>
            <Text style={styles.emptySubtext}>
              상품 문의나 주문 관련 대화를 시작해보세요
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerRight: {
    alignItems: "center",
  },
  chatCount: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  chatList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  chatRoomItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
