import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useSellerProducts from "../../../../../Hook/useSellerProducts.js";
import StoreProducts from "./StoreProducts.js";

export default function StoreMenu() {

    const { products }= useSellerProducts(); 
    const [sortType, setSortType] = useState("BASIC");

    const productList= useMemo(() => {
        if (!products) return [];
        
        const sortedProducts = [...products];
        switch (sortType) {
            case "LATEST":
              return sortedProducts.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
              });
      
            case "LOW_PRICE":
              return sortedProducts.sort((a, b) => a.discountPrice - b.discountPrice);
      
            case "HIGH_PRICE":
              return sortedProducts.sort((a, b) => b.discountPrice - a.discountPrice);
      
            case "HIGH_RATING":
              return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
            case "LOW_RATING":
              return sortedProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      
            case "EXPIRING":
              return sortedProducts.sort((a, b) => {
                const rateA = a.currentDiscountRate || 0;
                const rateB = b.currentDiscountRate || 0;
                return rateB - rateA;
              });
      
            case "BASIC":
            default:
              // 기본 정렬 - 원본 배열 그대로
              return sortedProducts;
        }
    }, [products, sortType]);

    if (!productList || productList.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>등록된 제품이 없습니다.</Text>
            </View>
        );
      }

  return (
    <View>
        <View>

        </View>

        <View>
            {productList.map((item, index) => (
                <StoreProducts
                key={item.id?.toString() || index.toString()}
                id={item.id}
                index={index}
                productId={item.id}
                sellerId={item.sellerId}
                thumbnailUrl={
                    item.productPhotoUrl?.[0]?.startsWith("http")
                    ? item.productPhotoUrl[0]
                    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${item.productPhotoUrl[0]}`
                }
                name={item.name}
                date={item.expiryDate}
                expiryDate={item.expiryDate}
                description={item.description}
                originalPrice={item.originalPrice}
                maxDiscountRate={item.maxDiscountRate}
                minDiscountRate={item.minDiscountRate}
                discountPrice={item.discountPrice}
                currentDiscountRate={item.currentDiscountRate || "현재 할인"}
                />
            ))}
        </View>
    </View>
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
});
