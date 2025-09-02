import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api/api.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./header/Header.js";
import BottomTab from "./bottomTab/BottomTab.js";

export default function MainScreen() {
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        const res = await api.get("/api/products/search", {
          params: {
            keyword: "",
            filterType: "EXPIRING_SOON",
            sortType: "EXPIRING",
            page: 0,
            size: 99,
          },
        });
        const productList = res?.data?.content || [];
        setProducts(productList);
        console.log("임박특가 상품:", productList);
      } catch (error) {
        console.error("임박특가 조회 실패", error);
      }
    };

    const fetchLatestProducts = async () => {
      try {
        const res = await api.get("/api/products/search", {
          params: {
            keyword: "",
            filterType: "RECENT",
            sortType: "LATEST",
            page: 0,
            size: 99,
          },
        });
        const productList = res?.data?.content || [];
        setLatestProducts(productList);
        console.log("받은 최신 상품 목록:", productList);
      } catch (error) {
        console.error("최신 상품 조회 실패", error);
      }
    };

    fetchExpiringProducts();
    fetchLatestProducts();
  }, []);

  const getThumbnailUrl = (product) => {
    const url = product.thumbnailUrl;
    if (!url) return "https://via.placeholder.com/100x100.png?text=No+Image";
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  const categories = [
    { icon: "storefront-outline", label: "편의점" },
    { icon: "cafe-outline", label: "빵집" },
    { icon: "cart-outline", label: "마트" },
    { icon: "restaurant-outline", label: "식당" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <Header />
      <ScrollView style={styles.container}>
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
        {/* Event (배너 이미지 추가) */}
        <View style={styles.eventBox}>
          <Image
            source={require("../Image/BannerSP1.jpg")}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

        {/* 임박특가 상품 */}
        <Text style={styles.recommendationTitle}>임박특가 추천</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 30 }}
        >
          <View style={{ flexDirection: "row" }}>
            {products.map((product) => (
              <View key={product.id} style={styles.productBox}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    overflow: "hidden", // 추가!
                    marginBottom: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: getThumbnailUrl(product) }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    width: "100%",
                    marginBottom: 4,
                  }}
                >
                  {product.name}
                </Text>

                <View
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 13, color: "#000" }}>
                    {product.discountedPrice.toLocaleString()}원
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginLeft: 4,
                      textDecorationLine: "line-through",
                    }}
                  >
                    {product.originalPrice.toLocaleString()}원
                  </Text>
                  <Text style={{ fontSize: 12, color: "red", marginLeft: 4 }}>
                    {product.discountRate}%
                  </Text>
                </View>

                <Text style={{ fontSize: 11, color: "#777" }}>{product.expiryDate}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* NEW 상품 추천 */}
        <Text style={styles.recommendationTitle}>NEW 상품 추천</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 30 }}
        >
          <View style={{ flexDirection: "row" }}>
            {latestProducts.map((product) => (
              <View key={product.id} style={styles.productBox}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    overflow: "hidden", // 추가!
                    marginBottom: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: getThumbnailUrl(product) }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    width: "100%",
                    marginBottom: 4,
                  }}
                >
                  {product.name}
                </Text>

                <View
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 13, color: "#000" }}>
                    {product.discountedPrice.toLocaleString()}원
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginLeft: 4,
                      textDecorationLine: "line-through",
                    }}
                  >
                    {product.originalPrice.toLocaleString()}원
                  </Text>
                  <Text style={{ fontSize: 12, color: "red", marginLeft: 4 }}>
                    {product.discountRate}%
                  </Text>
                </View>

                <Text style={{ fontSize: 11, color: "#777" }}>{product.expiryDate}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchBar: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  category: { alignItems: "center" },
  eventBox: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    alignItems: "center",
  },
  eventPage: { position: "absolute", right: 10, top: 10 },
  recommendationTitle: { fontWeight: "bold", marginBottom: 8, marginHorizontal: 16 },
  products: { flexDirection: "row", justifyContent: "space-between" },
  productBox: {
    height: 200, // 170 → 200
    width: 150,
    padding: 16, // 20 → 16 (약간 줄이기)
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 30,
    flexShrink: 0,
  },
  eventImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  },
});
