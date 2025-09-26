import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import api from "../../../../api/api.js";

export default function PayBottom({
  products = [],
  deliveryFee = 0,
  totalProductPrice = 0,
  isPickup = false,
  finalAmount,
  deliveryInfo = {},
  pickupInfo = {},
  pointsToUse = 0,
}) {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const currentOrderIdRef = useRef(null);

  const calculatedFinalAmount =
    finalAmount || totalProductPrice + (isPickup ? 0 : deliveryFee);

  // 1️⃣ 주문 데이터 유효성 검사
  const validateOrderData = () => {
    if (!isPickup) {
      if (!deliveryInfo.mainAddress?.trim()) {
        Alert.alert("안내", "배송 주소를 입력해주세요.");
        return false;
      }
      if (
        !deliveryInfo.phoneFirst?.trim() ||
        !deliveryInfo.phoneMiddle?.trim() ||
        !deliveryInfo.phoneLast?.trim()
      ) {
        Alert.alert("안내", "휴대전화 번호를 모두 입력해주세요.");
        return false;
      }
    }
    return true;
  };

  // 2️⃣ 결제 버튼 클릭
  const handlePaymentClick = async () => {
    try {
      if (!validateOrderData()) return;
      if (!products || products.length === 0) {
        Alert.alert("안내", "주문할 상품이 없습니다.");
        return;
      }

      setLoading(true);

      const firstProduct = products[0];
      const orderName =
        products.length === 1
          ? `${firstProduct.name} ${firstProduct.quantity || 1}개`
          : `${firstProduct.name} 외 ${products.length - 1}건`;

      // 서버로 보낼 주문 데이터
      const orderData = {
        usedPoints: Number(pointsToUse),
        memo: isPickup
          ? pickupInfo.pickupRequest || "픽업 주문"
          : deliveryInfo.deliveryRequest || "배송 주문",
        isDelivery: isPickup ? "N" : "Y",
        deliveryAddress: isPickup
          ? "매장 픽업"
          : `${deliveryInfo.mainAddress || ""} ${deliveryInfo.detailAddress || ""}`.trim(),
        orderProducts: products.map((p) => ({
          productId: Number(p.id || p.productId),
          quantity: Number(p.quantity || 1),
          price: Number(p.discountPrice || p.originalPrice),
          currentDiscountRate: Number(p.currentDiscountRate || 0),
        })),
        payType: "CARD",
        orderName,
      };

      console.log("📦 서버로 보낼 주문 데이터:", orderData);

      // 2-1️⃣ 서버 호출: 결제 URL 생성
      const response = await api.post("/api/orders/pay/native", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const { paymentUrl, orderId } = response.data?.data || {};
      if (!paymentUrl || !orderId) {
        throw new Error("서버에서 결제 URL을 받지 못했습니다.");
      }

      currentOrderIdRef.current = orderId;
      setPaymentUrl(paymentUrl);
      setShowWebView(true);
    } catch (error) {
      const errorDetails = error.response?.data
        ? `서버 응답 데이터: ${JSON.stringify(error.response.data)}`
        : error.message;

      console.error("❌ 결제 처리 실패:", error); // 전체 에러 객체를 출력하여 디버깅 도구에서 확인
      console.error("❌ 상세 에러:", errorDetails); // 상세 내용을 문자열로 출력

      // 사용자에게는 일반적인 오류 메시지를 제공
      Alert.alert("결제 실패", error.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ WebView 메시지 수신
  const handleWebViewMessage = async (event) => {
    const data = event.nativeEvent.data;
    console.log("💬 WebView 메시지:", data);

    if (!currentOrderIdRef.current) return;

    try {
      if (data === "success") {
        Alert.alert("결제 완료", "결제가 성공적으로 완료되었습니다.");
      } else if (data === "fail" || data === "cancel") {
        Alert.alert("결제 취소", "결제가 취소되었습니다.");
      }

      // 공통: 결제 종료 처리
      await api.post(`/api/orders/close-payment/${currentOrderIdRef.current}`);
      currentOrderIdRef.current = null;
    } catch (err) {
      console.error("❌ close-payment 처리 실패:", err);
    } finally {
      setShowWebView(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.summary}>
          <Text style={styles.label}>총 결제 금액</Text>
          <Text style={styles.amount}>{calculatedFinalAmount.toLocaleString()}원</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => Alert.alert("취소", "이전 화면으로 돌아갑니다.")}
          >
            <Text>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePaymentClick}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>결제하기</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView 모달 */}
      <Modal visible={showWebView} animationType="slide">
        <WebView
          source={{ uri: paymentUrl }}
          onMessage={handleWebViewMessage}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={{ flex: 1 }} size="large" />}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  summary: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  label: { fontSize: 16 },
  amount: { fontSize: 18, fontWeight: "bold" },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  payButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#000",
    alignItems: "center",
  },
});
