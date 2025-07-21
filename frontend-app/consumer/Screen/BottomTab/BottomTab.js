import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TabItem = ({ icon, label, focused }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Ionicons name={icon} size={24} color={focused ? "black" : "gray"} />
    <Text style={{ color: focused ? "black" : "gray" }}>{label}</Text>
  </TouchableOpacity>
);

export default function BottomTab() {
  return (
    <View style={styles.bottomTab}>
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
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  tabItem: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
});
