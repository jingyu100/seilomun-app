import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProductInfo from "../../../../Hook/useProductInfo.js";
import styles from "../ProductStyle.js";

export default function ProductBottom() {

    const navigation = useNavigation();

    const { product } = useProductInfo();
    const [quantity, setQuantity] = useState(1);

    if (!product) return <Text>상품 정보를 불러올 수 없습니다.</Text>;

    const parsedDisPrice = Number(product.discountPrice) || 0;
    const stockQuantity = Number(product.stockQuantity) || 0;
    const totalPrice = parsedDisPrice * quantity;

    const increaseQuantity = () => {
        if (quantity >= stockQuantity) {
            Alert.alert("최대 수량입니다.");
            return;
        }
        setQuantity(q => q + 1);
    };

    const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleBuyNow = () => {
        navigation.navigate("Payment", {
            productId: product.id,
            name: product.name,
            price: parsedDisPrice,
            quantity: quantity,
            totalPrice: totalPrice,
        });
    };

    const handleAddCart = async () => {
        try {
            Alert.alert(`${product.name} ${quantity}개 장바구니에 추가되었습니다.`);
        } catch (error) {
            console.error(error);
            Alert.alert("장바구니 추가 실패");
        }
    };

    return (
        <View style={styles.prodBottom}>
            <View style={styles.totalBox}>
                <Text style={styles.label}>TOTAL</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQuantity}>
                        <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={increaseQuantity}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>

                    <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}원</Text>
                </View>
            </View>

            <View style={styles.btnRow}>
                <TouchableOpacity
                    style={[styles.buyBtn, stockQuantity === 0 && styles.disabledBtn]}
                    onPress={handleBuyNow}
                    disabled={stockQuantity === 0}
                >
                    <Text style={styles.btnText}>바로구매하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cartBtn, stockQuantity === 0 && styles.disabledBtn]}
                    onPress={handleAddCart}
                    disabled={stockQuantity === 0}
                >
                    <Text style={styles.btnText}>장바구니</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
