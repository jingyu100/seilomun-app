// MainScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

const MainScreen = () => {
  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Text style={styles.location}>내 집1 ▼</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} />
          <Ionicons name="cart-outline" size={24} style={{ marginLeft: 10 }} />
        </View>
      </View>

      {/* 검색창 */}
      <View style={styles.searchBox}>
        <TextInput placeholder="검색어를 입력하세요" style={styles.searchInput} />
        <Ionicons name="search" size={20} color="#aaa" />
      </View>

      {/* 카테고리 */}
      <View style={styles.categories}>
        {["편의점", "빵집", "마트", "식당", "더보기"].map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <Entypo name="shop" size={24} />
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      {/* 이벤트 배너 */}
      <View style={styles.eventBanner}>
        <Text>이벤트 내용</Text>
        <Text style={styles.eventIndex}>1 / 19</Text>
      </View>

      {/* 추천 상품 */}
      <Text style={styles.recommendTitle}>소비자 맞춤 추천 상품</Text>
      <ScrollView horizontal style={styles.productScroll}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.productBox}>
            <Text>상품 {item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        {["주문내역", "채팅", "홈", "즐겨찾기", "마이페이지"].map((item, index) => (
          <TouchableOpacity key={index} style={styles.tabItem}>
            <Ionicons name="home-outline" size={20} />
            <Text style={styles.tabLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: { fontSize: 16, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchInput: { flex: 1, height: 40 },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryItem: { alignItems: "center" },
  eventBanner: {
    backgroundColor: "#f9f9f9",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
    position: "relative",
  },
  eventIndex: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 12,
    color: "#666",
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productScroll: { marginBottom: 20 },
  productBox: {
    width: 100,
    height: 100,
    backgroundColor: "#eee",
    marginRight: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, marginTop: 4 },
});
