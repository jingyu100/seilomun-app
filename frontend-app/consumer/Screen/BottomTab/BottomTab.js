import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TabItem = ({ icon, label, focused, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={focused ? "black" : "gray"} />
    <Text style={{ color: focused ? "black" : "gray" }}>{label}</Text>
  </TouchableOpacity>
);

export default function BottomTab({
  backgroundColor = "#fff",
  borderColor = "#ccc",
  fixed = false,
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleChatPress = () => {
    // 채팅방 목록으로 이동
    navigation.navigate("ChatRoomList");
  };

  return (
    <View
      style={[
        styles.bottomTab,
        {
          backgroundColor,
          borderColor,
          paddingBottom: insets?.bottom || 8,
        },
        fixed ? styles.fixed : null,
      ]}
    >
      <TabItem icon="document-text-outline" label="주문내역" />
      <TabItem icon="chatbubble-outline" label="채팅" onPress={handleChatPress} />
      <TabItem icon="home-sharp" label="홈" focused />
      <TabItem icon="heart-outline" label="즐겨찾기" />
      <TabItem icon="person-outline" label="마이페이지" />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  tabItem: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  fixed: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
