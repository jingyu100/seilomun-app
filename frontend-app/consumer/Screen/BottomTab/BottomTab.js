import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const TabItem = ({ icon, label, focused }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Ionicons name={icon} size={24} color={focused ? "black" : "gray"} />
    <Text style={{ color: focused ? "black" : "gray" }}>{label}</Text>
  </TouchableOpacity>
);

export default function BottomTab({
  backgroundColor = "#fff",
  borderColor = "#ccc",
  fixed = true,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bottomTab,
        {
          backgroundColor,
          borderColor,
          paddingBottom: Math.max(insets?.bottom || 0, 8),
        },
        fixed ? styles.fixed : null,
      ]}
    >
      <TabItem icon="document-text-outline" label="주문내역" />
      <TabItem icon="chatbubble-outline" label="채팅" />
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
    elevation: 8,
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
