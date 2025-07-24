import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function StoreProducts({
  sellerId,
  id,
  index,
  productId,
  thumbnailUrl,
  name,
  date,
  expiryDate,
  description,
  originalPrice,
  discountPrice,
  maxDiscountRate,
  minDiscountRate,
  currentDiscountRate,
}) {

    const parsedOriginalPrice = Number(originalPrice);
    const parsedDiscountPrice = Number(discountPrice);

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("Product", {
        sellerId,
        productId: id,
        });
    };

  return (
    <TouchableOpacity 
      style={styles.storeMenu} 
      onPress={handlePress}
    >
        <Image 
        source={{ 
            uri: thumbnailUrl 
        }} 
        // source={require('../../../../../assets/noImage.jpg')}
        style={styles.image} 
        />
        <View>
            <Text style={styles.title} numberOfLines={1}>{name}</Text>
            <View style={styles.productContainer}>
                <Text style={styles.date}>{date}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.discountPrice}>
                        {parsedDiscountPrice.toLocaleString()}원
                    </Text>
                    <Text style={styles.originalPrice}>
                        {parsedOriginalPrice.toLocaleString()}원
                    </Text>
                    <Text style={styles.discountRate}>
                        {currentDiscountRate}%
                    </Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
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
        paddingVertical: 18,
        // marginBottom: 20,
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
        width: '85%',
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
        width: '90%',
        marginBottom: 8,
    },
});
