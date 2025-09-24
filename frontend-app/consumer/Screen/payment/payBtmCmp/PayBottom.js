import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import api, { S3_BASE_URL } from '../../../../api/api.js';

export default function PayBottom({
    roducts = [],
    deliveryFee,
    totalProductPrice,
    isPickup = false,
    finalAmount, // 부모에서 계산된 최종 금액
    deliveryInfo, // ✨ 새로 추가: 배송 정보
    pickupInfo, // ✨ 새로 추가: 픽업 정보
    pointsToUse = 0, // ✨ 새로 추가: 사용할 포인트
}) {
    
    const navigation = useNavigation();
  const currentOrderIdRef = useRef(null);

  // 최종 결제 금액 계산
  const calculatedFinalAmount =
    finalAmount || totalProductPrice + (isPickup ? 0 : deliveryFee);

  // ✨ 유효성 검사
  const validateOrderData = () => {
    if (!isPickup) {
      if (!deliveryInfo?.mainAddress?.trim()) {
        Alert.alert("안내", "배송 주소를 입력해주세요.");
        return false;
      }
      if (
        !deliveryInfo.phoneFirst ||
        !deliveryInfo.phoneMiddle ||
        !deliveryInfo.phoneLast
      ) {
        Alert.alert("안내", "휴대전화 번호를 모두 입력해주세요.");
        return false;
      }
    }
    return true;
  };

  const handlePaymentClick = async () => {
    try {
      if (!validateOrderData()) return;

      if (!products || products.length === 0) {
        Alert.alert("안내", "주문할 상품이 없습니다.");
        return;
      }

      // 주문명 생성
      const firstProduct = products[0];
      const orderName =
        products.length === 1
          ? `${firstProduct.name} ${firstProduct.quantity || 1}개`
          : `${firstProduct.name} 외 ${products.length - 1}건`;

      // 주문 데이터
      const orderData = {
        usedPoints: pointsToUse || 0,
        memo: isPickup
          ? pickupInfo?.pickupRequest || "픽업 주문"
          : deliveryInfo?.deliveryRequest || "배송 주문",
        isDelivery: isPickup ? "N" : "Y",
        deliveryAddress: isPickup
          ? "매장 픽업"
          : `${deliveryInfo.mainAddress} ${deliveryInfo.detailAddress}`.trim(),
        orderProducts: products.map((product) => ({
          productId: product.id || product.productId,
          quantity: product.quantity || 1,
          price: product.discountPrice || product.originalPrice,
          currentDiscountRate: product.currentDiscountRate || 0,
        })),
        payType: "CARD",
        orderName: orderName,
        yourSuccessUrl: "http://localhost:3000/payment?result=success", // RN에서는 WebView success 처리 필요
        yourFailUrl: "http://localhost:3000/payment?result=fail",
      };

      console.log("📦 주문 데이터:", orderData);

      const response = await api.post("/api/orders/buy", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const paymentData = response.data?.data?.Update;
      if (!paymentData) {
        throw new Error("서버에서 결제 정보를 받지 못했습니다.");
      }

      currentOrderIdRef.current = paymentData.orderId;
      console.log("💾 Order ID:", paymentData.orderId);

      // ✅ 여기서 TossPayments 결제창을 띄워야 함
      // → React Native에서는 WebView 또는 서버 연동 방식 필요
      Alert.alert("결제 진행", `결제 금액: ${calculatedFinalAmount}원`);
    } catch (error) {
      console.error("❌ 결제 처리 실패:", error);
      Alert.alert("에러", error.message || "결제 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "안내",
      "결제를 취소하고 이전 페이지로 돌아가시겠습니까?",
      [
        { text: "아니오" },
        { text: "예", onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentSummary}>
        <Text style={styles.label}>TOTAL</Text>
        <Text style={styles.finalAmount}>
          {calculatedFinalAmount.toLocaleString()}원
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>취소하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handlePaymentClick}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingTop: 13,
    paddingHorizontal: 18,
  },
  paymentSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    color: "#333",
  },
  finalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 'auto',
    color: "#000",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});