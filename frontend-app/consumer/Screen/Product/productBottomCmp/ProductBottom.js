import React, { useRef, useEffect, useState } from 'react';
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Animated,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import useProductInfo from "../../../../Hook/useProductInfo.js";
import styles from "../ProductStyle.js";

export default function ProductBottom({
    productId,
    productPhotoUrl,
    name,
    expiryDate,
    description,
    originalPrice,
    discountPrice,
    currentDiscountRate,
    stockQuantity,
}) {

    const route = useRoute();
    
    const { product } = useProductInfo();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (product?.productPhotoUrl) {
        const processedImages = product.productPhotoUrl.map((url) =>
            url.startsWith("http")
            ? url
            : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
        );
        setImages(processedImages);
        setCurrentImageIndex(0);
        } else {
        setImages([]);
        }
    }, [product]);

    const handleBuyNow = () => {
        navigation.navigate("Payment", {
        product: {
            id: productId,
            sellerId,
            name,
            productPhotoUrl: Array.isArray(productPhotoUrl)
            ? productPhotoUrl
            : [productPhotoUrl],
            expiryDate,
            originalPrice: parsedOriginalPrice,
            discountPrice: parsedDisPrice,
            currentDiscountRate: discountRate,
            quantity,
            totalPrice,
            stockQuantity,
        },
        });
    };
    
    const handleAddCart = async () => {
        try {
        // await addToCart(...); // Context 구현 필요
        Alert.alert(`${name} ${quantity}개 장바구니에 추가되었습니다.`);
        } catch (error) {
        console.error("장바구니 추가 실패:", error);
        Alert.alert("장바구니 추가 실패");
        }
    };

    const parsedOriginalPrice = parseInt(originalPrice) || 0;
    const parsedDisPrice = parseInt(discountPrice) || 0;
    const discountRate = parseInt(currentDiscountRate) || 0;

    const [quantity, setQuantity] = useState(1);

    const totalPrice = parsedDisPrice * quantity;


    
    return (
        <View style={[styles.prodBottom, ]}>
            <View style={styles.totalBox}>
                <Text style={styles.label}>TOTAL</Text>
                <Text style={styles.totalPrice}>
                    {totalPrice.toLocaleString()}원
                </Text>
            </View>
            <View style={styles.btnRow}>
                <TouchableOpacity
                    style={[
                        styles.buyBtn,
                        stockQuantity === 0 && styles.disabledBtn,
                    ]}
                    onPress={handleBuyNow}
                    disabled={stockQuantity === 0}
                >
                    <Text style={styles.btnText}>바로구매하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.cartBtn,
                        stockQuantity === 0 && styles.disabledBtn,
                    ]}
                    onPress={handleAddCart}
                    disabled={stockQuantity === 0}
                >
                    <Text style={styles.btnText}>장바구니</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}