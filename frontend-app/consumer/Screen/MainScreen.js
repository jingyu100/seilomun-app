import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {
  const categories = [
    { icon: "storefront-outline", label: "편의점" },
    { icon: "cafe-outline", label: "빵집" },
    { icon: "cart-outline", label: "마트" },
    { icon: "restaurant-outline", label: "식당" },
    { icon: "ellipsis-horizontal", label: "더보기" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu" size={24} />
          <Text style={styles.headerText}>내 집1 ▼</Text>
          <View style={styles.headerIcons}>
            <Ionicons
              name="notifications-outline"
              size={24}
              style={{ marginRight: 10 }}
            />
            <Ionicons name="cart-outline" size={24} />
          </View>
        </View>

        {/* Search */}
        <TextInput placeholder="검색" style={styles.searchBar} />

        {/* Categories */}
        <View style={styles.categories}>
          {categories.map((category, index) => (
            <View key={index} style={styles.category}>
              <Ionicons name={category.icon} size={28} />
              <Text>{category.label}</Text>
            </View>
          ))}
        </View>

        {/* Event */}
        <View style={styles.eventBox}>
          <Text style={{ fontSize: 16 }}>이벤트 내용</Text>
          <Text style={styles.eventPage}>1 / 19</Text>
        </View>

        {/* Products */}
        <Text style={styles.recommendationTitle}>소비자 맞춤 추천 상품</Text>
        <View style={styles.products}>
          <View style={styles.productBox}>
            <Text>상품 1</Text>
          </View>
          <View style={styles.productBox}>
            <Text>상품 2</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomTab}>
        <TabItem icon="document-text-outline" label="주문내역" />
        <TabItem icon="chatbubble-outline" label="채팅" />
        <TabItem icon="home" label="홈" focused />
        <TabItem icon="heart-outline" label="즐겨찾기" />
        <TabItem icon="person-outline" label="마이페이지" />
      </View>
    </SafeAreaView>
  );
}

function TabItem({ icon, label, focused }) {
  return (
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons name={icon} size={24} color={focused ? "black" : "gray"} />
      <Text style={{ color: focused ? "black" : "gray" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  searchBar: { backgroundColor: "#eee", padding: 10, borderRadius: 8, marginBottom: 16 },
  categories: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  category: { alignItems: "center" },
  eventBox: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 8,
    position: "relative",
    marginBottom: 16,
  },
  eventPage: { position: "absolute", right: 10, top: 10 },
  recommendationTitle: { fontWeight: "bold", marginBottom: 8 },
  products: { flexDirection: "row", justifyContent: "space-between" },
  productBox: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 12,
    marginRight: 8,
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  tabItem: { alignItems: "center" },
});
