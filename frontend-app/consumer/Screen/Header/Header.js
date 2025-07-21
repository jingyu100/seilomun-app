import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        zIndex: 1000,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="menu" size={24} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 13, fontWeight: "bold", lineHeight: 24 }}>내 집1 ▼</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Ionicons name="notifications-outline" size={24} style={{ marginRight: 10 }} />
        <Ionicons name="cart-outline" size={24} />
      </View>
    </View>
  );
}
