import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  isLoggedIn = false,
  onPressLogin,
  onPressLogout,
  nickname,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        zIndex: 1000,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="menu" size={24} style={{ marginRight: 8 }} />
        {isLoggedIn && nickname ? (
          <Text style={{ fontSize: 13, fontWeight: "bold", lineHeight: 24 }}>
            {nickname}
          </Text>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="notifications-outline" size={24} style={{ marginRight: 10 }} />
        <Ionicons name="cart-outline" size={24} style={{ marginRight: 10 }} />
        {isLoggedIn ? (
          <TouchableOpacity
            onPress={onPressLogout}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 12 }}>로그아웃</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onPressLogin}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#0a7",
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#0a7" }}>로그인</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
