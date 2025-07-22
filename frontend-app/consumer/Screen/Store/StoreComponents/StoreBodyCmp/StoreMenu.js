import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function StoreMenu({
  // sellerId,
  // id,
  // index,
  // productId,
  // thumbnailUrl,
  // name,
  // date,
  // expiryDate,
  // description,
  // originalPrice,
  // discountPrice,
  // maxDiscountRate,
  // minDiscountRate,
  // currentDiscountRate,
}) {

  const navigation = useNavigation();

  // const handlePress = () => {
  //   navigation.navigate("ProductDetail", {
  //     sellerId,
  //     productId: id,
  //   });
  // };

  // const handlePress = () => {
  //   navigation.navigate(

  //   )
  // };

  return (
    <TouchableOpacity 
      style={styles.storeMenu} 
      // onPress={handlePress}
    >
      <Image 
        // source={{ 
        //   uri: thumbnailUrl 
        // }} 
        source={require('../../../../../assets/noImage.jpg')}
        style={styles.image} 
      />
      {/* <Text style={styles.title} numberOfLines={1}>{name}</Text>
      <View style={styles.productContainer}>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountPrice}>
            {discountPrice.toLocaleString()}원
          </Text>
          <Text style={styles.originalPrice}>
            {originalPrice.toLocaleString()}원
          </Text>
          <Text style={styles.discountRate}>
            {currentDiscountRate}%
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View> */}
      <View>
        <Text style={styles.title} numberOfLines={1}>제품 이름</Text>
        <View style={styles.productContainer}>
            <Text style={styles.date}>2025-07-25</Text>
            <View style={styles.priceRow}>
                <Text style={styles.discountPrice}>
                    5,900원
                </Text>
                <Text style={styles.originalPrice}>
                    7,900원
                </Text>
                <Text style={styles.discountRate}>
                    23%
                </Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
                강렬하고 얼얼한 크림에 푸주, 포두부, 분모자, 치즈비엔나 등 다양한 토핑의 조화
            </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    storeMenu: {
        flexDirection: 'row',
        width: 'auto',
        height: 'auto',
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 15,
        marginBottom: 20,
        justifyContent: "flex-start",
        // justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 130,
        height: 130,
        resizeMode: "cover",
        borderRadius: 5,
        marginRight: 10,
    },
    title: {
        fontSize: 19,
        fontWeight: "600",
        width: '45%',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: "gray",
        marginBottom: 4,
    },
    productContainer: {

    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 15,
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    originalPrice: {
        fontSize: 13,
        color: "gray",
        textDecorationLine: "line-through",
        marginBottom: 'auto',
    },
    discountRate: {
        fontSize: 13,
        color: "red",
        fontWeight: "bold",
        top: -2,
        marginBottom: 'auto',
    },
    description: {
        fontSize: 14,
        color: "#444",
        width: '45%',
        marginBottom: 8,
    },
});
