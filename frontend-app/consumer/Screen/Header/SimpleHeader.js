import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SimpleHeader({ title = "", onBack }) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View
      style={{
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      <TouchableOpacity
        onPress={handleBack}
        style={{ paddingHorizontal: 12, paddingVertical: 8 }}
      >
        <Ionicons name="chevron-back" size={22} color="#111" />
      </TouchableOpacity>

      <View style={{ position: "absolute", left: 0, right: 0, alignItems: "center" }}>
        <Text style={{ fontSize: 17, fontWeight: "600", color: "#111" }}>{title}</Text>
      </View>
    </View>
  );
}
