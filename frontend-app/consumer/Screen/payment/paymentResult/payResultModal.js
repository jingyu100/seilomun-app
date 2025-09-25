import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../../../api/api.js";

export default function PayResultModal({ result, onClose }) {
  const navigation = useNavigation();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        let response;

        if (result.type === "success") {
          response = await api.get("/api/orders/toss/success", {
            params: {
              paymentKey: result.paymentKey,
              orderId: result.orderId,
              amount: result.amount,
            },
          });

          const successData = response.data.data?.성공;
          if (!successData) throw new Error("결제 성공 데이터를 받지 못했습니다.");

          setPaymentData({
            type: "success",
            data: successData,
            message:
              response.data.data?.message || "결제가 성공적으로 완료되었습니다.",
          });
        } else if (result.type === "fail") {
          response = await api.get("/api/orders/toss/fail", {
            params: {
              code: result.code,
              message: result.message,
              orderId: result.orderId,
            },
          });

          const failData = response.data.data?.실패;
          if (!failData) throw new Error("결제 실패 데이터를 받지 못했습니다.");

          setPaymentData({
            type: "fail",
            data: failData,
            message: response.data.data?.message || "결제가 실패되었습니다.",
          });
        }
      } catch (err) {
        console.error("결제 결과 조회 실패:", err);
        setError(
          err.response?.data?.data?.error ||
            err.message ||
            "결과 조회에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentResult();
  }, [result]);

  const handleGoHome = () => {
    navigation.navigate("Home"); // 네이티브 홈 화면 네임 맞춰야 함
  };

  const handleViewOrders = () => {
    navigation.navigate("OrderList"); // 주문 내역 화면 네임 맞춰야 함
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.modalBox}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.message}>결제 결과를 확인하고 있습니다...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={styles.icon}>❌</Text>
            <Text style={styles.title}>오류가 발생했습니다</Text>
            <Text style={styles.message}>{error}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleClose}
              >
                <Text style={styles.btnText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleGoHome}
              >
                <Text style={styles.btnText}>홈으로 가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : paymentData?.type === "success" ? (
          <ScrollView contentContainerStyle={styles.centerBox}>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.title}>결제가 완료되었습니다!</Text>
            <Text style={styles.message}>{paymentData.message}</Text>

            <View style={styles.detailBox}>
              <Text>주문명: {paymentData.data.orderName || "주문"}</Text>
              <Text>
                결제 금액:{" "}
                {paymentData.data.totalAmount
                  ? `${parseInt(
                      paymentData.data.totalAmount
                    ).toLocaleString()}원`
                  : "금액 정보 없음"}
              </Text>
              <Text>
                결제 방법: {paymentData.data.method || "결제 방법 정보 없음"}
              </Text>
              <Text>
                결제 일시:{" "}
                {paymentData.data.approvedAt
                  ? new Date(paymentData.data.approvedAt).toLocaleString()
                  : "결제 일시 정보 없음"}
              </Text>
              <Text>
                주문 번호: {paymentData.data.orderId || "주문 번호 정보 없음"}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleViewOrders}
              >
                <Text style={styles.btnText}>주문 내역 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleGoHome}
              >
                <Text style={styles.btnText}>쇼핑 계속하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.centerBox}>
            <Text style={styles.icon}>❌</Text>
            <Text style={styles.title}>결제에 실패했습니다</Text>
            <Text style={styles.message}>
              {paymentData?.message || "결제가 실패되었습니다."}
            </Text>

            <View style={styles.detailBox}>
              <Text>
                주문 번호:{" "}
                {paymentData?.data?.orderId || "주문 번호 정보 없음"}
              </Text>
              <Text>
                오류 코드:{" "}
                {paymentData?.data?.errorCode || "오류 코드 정보 없음"}
              </Text>
              <Text>
                오류 메시지:{" "}
                {paymentData?.data?.errorMessage || "오류 메시지 정보 없음"}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleClose}
              >
                <Text style={styles.btnText}>다시 시도</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleGoHome}
              >
                <Text style={styles.btnText}>홈으로 가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  centerBox: {
    alignItems: "center",
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  detailBox: {
    marginVertical: 10,
    width: "100%",
    gap: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: "100%",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
