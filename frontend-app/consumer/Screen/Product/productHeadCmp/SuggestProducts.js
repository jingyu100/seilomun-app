import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SuggestProducts({
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
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
            <View style={styles.productContainer}>
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
                <Text style={styles.date}>{date}</Text>
            </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    storeMenu: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        paddingVertical: 6,
        // marginBottom: 20,
        justifyContent: "flex-start",
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    image: {
        width: 130,
        height: 130,
        borderColor: "#ccc",
        borderWidth: 0.7,
        resizeMode: "cover",
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: "400",
        width: 130,
        marginBottom: 7,
    },
    date: {
        fontSize: 11,
        color: "gray",
        marginBottom: 4,
    },
    productContainer: {

    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        marginBottom: 4,
    },
    discountPrice: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#000",
    },
    originalPrice: {
        fontSize: 10,
        color: "gray",
        textDecorationLine: "line-through",
        marginBottom: 'auto',
    },
    discountRate: {
        fontSize: 12,
        color: "red",
        fontWeight: "bold",
        top: -2,
        marginBottom: 'auto',
    },
});
