import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ 추가
import useProductInfo from "../../../../Hook/useProductInfo.js";
import styles from "../ProductStyle.js";

export default function ProductBottom() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // ✅ 안전영역

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
    setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 바로 결제
  const handleBuyNow = () => {
    navigation.navigate("Payment", {
      product: {
        id: product.id,
        sellerId: product.sellerId,
        name: product.name,
        productPhotoUrl: product.productPhotoUrl ? [product.productPhotoUrl] : [],
        expiryDate: product.expiryDate,
        originalPrice: Number(product.originalPrice) || 0,
        discountPrice: parsedDisPrice,
        currentDiscountRate: Number(product.currentDiscountRate) || 0,
        quantity: quantity,
        totalPrice: totalPrice,
        stockQuantity: stockQuantity,
      },
    });
  };

  // 장바구니 추가
  const handleAddCart = async () => {
    try {
      console.log("🛒 장바구니 추가 요청:", {
        id: product.id,
        sellerId: product.sellerId,
        name: product.name,
        productPhotoUrl: product.productPhotoUrl,
        expiryDate: product.expiryDate,
        originalPrice: Number(product.originalPrice) || 0,
        discountPrice: parsedDisPrice,
        currentDiscountRate: Number(product.currentDiscountRate) || 0,
        quantity: quantity,
        totalPrice: totalPrice,
        stockQuantity: stockQuantity,
      });

      Alert.alert(`${product.name} ${quantity}개 장바구니에 추가되었습니다.`);
    } catch (error) {
      console.error(error);
      Alert.alert("장바구니 추가 실패");
    }
  };

  return (
    <View
      style={[
        styles.prodBottom,
        { paddingBottom: Math.max(insets.bottom, 12) }, // ✅ 안전영역 보정
      ]}
    >
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
