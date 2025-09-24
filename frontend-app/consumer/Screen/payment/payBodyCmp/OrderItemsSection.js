import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import { S3_BASE_URL } from "../../../../api/api.js";

const OrderItemsSection = ({ products = [], deliveryFee = 0 }) => {

  const getImageUrl = (photoArray) => {
    if (!photoArray || photoArray.length === 0) return null;
  
    const path = photoArray[0]; // 첫 번째 요소 꺼내기
  
    // 배열 안에 또 배열이 있는 경우 (["url"]) → 풀어주기
    const realPath = Array.isArray(path) ? path[0] : path;
  
    if (typeof realPath !== "string") {
      console.log("⚠️ 예상치 못한 photoUrl 값:", realPath);
      return null;
    }
  
    return realPath.startsWith("http")
      ? realPath
      : `${S3_BASE_URL}${realPath}`;
  };
  
  const renderItem = ({ item }) => {
    const imageUrl =
      getImageUrl(item.productPhotoUrl) ||
      getImageUrl(item.photoUrl) ||
      null;

    const expiryDate = item.expiryDate
      ? new Date(item.expiryDate).toLocaleDateString("ko-KR")
      : "유통기한 없음";

    const price =
      item.totalPrice ||
      (item.discountPrice || item.originalPrice) * (item.quantity || 1);

    return (
      <View style={styles.orderItem}>
            <Image source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("../../../../assets/noImage.jpg")
              }
              style={styles.productImg}
              onError={(e) => console.log("이미지 로딩 실패:", e.nativeEvent.error)}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetail}>
                    {expiryDate}까지 {"\n"}수량: {item.quantity || 1}개
                </Text>
                <Text style={styles.productPrice}>
                    <Text style={{ fontWeight: "bold" }}>
                        {price.toLocaleString()}원
                    </Text>
                </Text>
            </View>
      </View>
    );
  };

  return (
    <View style={styles.dlvContent}>
      <View style={styles.dlvMargin}>
        <Text style={styles.orderTitle}>주문상품</Text>

        <View style={styles.orderBox}>
            {products.length === 0 ? (
                <Text style={styles.noProducts}>주문할 상품이 없습니다.</Text>
            ) : (
                <View>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                    />


                    <View style={styles.orderFooter}>
                        <Text>배송비</Text>
                        <Text style={styles.price}>{deliveryFee.toLocaleString()}원</Text>
                    </View>
                </View>
            )}
        </View>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  orderBox: {
    elevation: 2,
    flexDirection: 'column',
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  dlvContent: {
    backgroundColor: '#fff',
  },
  dlvMargin: {
    marginHorizontal: 15,
    marginVertical: 19,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  noProducts: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  orderItem: {
    height: 'auto',
    flexDirection: "row",
    marginBottom: 12,
  },
  productImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#000",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default OrderItemsSection;
