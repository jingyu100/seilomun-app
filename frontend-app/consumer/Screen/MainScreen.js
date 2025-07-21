import React from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Screen/Header/Header";
import BottomTab from "../Screen/BottomTab/BottomTab";

export default function MainScreen() {
  const categories = [
    { icon: "storefront-outline", label: "편의점" },
    { icon: "cafe-outline", label: "빵집" },
    { icon: "cart-outline", label: "마트" },
    { icon: "restaurant-outline", label: "식당" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView style={styles.container}>
        <Header />

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color="gray"
            style={{ marginRight: 8 }}
          />
          <TextInput placeholder="검색" style={{ flex: 1 }} />
        </View>

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

        {/* 임박특가 상품 */}
        <Text style={styles.recommendationTitle}>임박특가 추천</Text>
        <View style={styles.products}>
          <View style={styles.productBox}>
            <Text>상품 1</Text>
          </View>
          <View style={styles.productBox}>
            <Text>상품 2</Text>
          </View>
        </View>

        {/* NEW 상품 추천 */}
        <Text style={styles.recommendationTitle}>NEW 상품 추천</Text>
        <View style={styles.products}>
          <View style={styles.productBox}>
            <Text>NEW 상품 1</Text>
          </View>
          <View style={styles.productBox}>
            <Text>NEW 상품 2</Text>
          </View>
        </View>
      </ScrollView>

      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  searchBar: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  category: { alignItems: "center" },
  eventBox: {
    backgroundColor: "#eee",
    padding: 20,
    height: 200,
    borderRadius: 8,
    position: "relative",
    marginBottom: 16,
  },
  eventPage: { position: "absolute", right: 10, top: 10 },
  recommendationTitle: { fontWeight: "bold", marginBottom: 8 },
  products: { flexDirection: "row", justifyContent: "space-between" },
  productBox: {
    height: 170,
    width: 100,
    flex: 1,
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 30,
  },
});
