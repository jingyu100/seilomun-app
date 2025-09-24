import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import api from "../../../../api/api";

// 숫자 포맷팅 유틸 함수
const formatNumber = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "0";
  return value.toLocaleString();
};

const PayInfoSection = ({
  totalProductPrice,
  deliveryFee,
  seller,
  isPickup,
  pointsToUse,
  setPointsToUse,
  finalAmount,
}) => {
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const fetchCurrentPoints = async () => {
      try {
        const response = await api.get("/api/customers/points?page=0&size=1");
        setCurrentPoints(response.data.data.currentPoints);
      } catch (error) {
        console.error("현재 포인트 조회 실패:", error);
      }
    };

    fetchCurrentPoints();
  }, []);

  // 배송비 상태 메시지
  const getDeliveryStatus = () => {
    if (!seller) return "";

    if (seller.deliveryAvailable !== "Y") {
      return " (픽업만 가능)";
    }

    const minOrderAmount = parseInt(seller.minOrderAmount) || 0;
    if (totalProductPrice < minOrderAmount) {
      return ` (최소 주문금액 ${formatNumber(minOrderAmount)}원 미달)`;
    }

    if (deliveryFee === 0) {
      return " (무료배송)";
    }

    const deliveryRules = seller.deliveryFeeDtos || [];
    const sortedRules = [...deliveryRules].sort((a, b) => a.ordersMoney - b.ordersMoney);

    for (const rule of sortedRules) {
      if (totalProductPrice < rule.ordersMoney && rule.deliveryTip < deliveryFee) {
        const remaining = rule.ordersMoney - totalProductPrice;
        return ` (${formatNumber(remaining)}원 더 주문 시 배송비 ${formatNumber(rule.deliveryTip)}원)`;
      }
    }

    return "";
  };

  // 전액사용 버튼
  const handleUseAllPoints = () => {
    const maxUsablePoints = Math.min(currentPoints, totalProductPrice);
    setPointsToUse(maxUsablePoints);
  };

  return (
    <View style={styles.dlvContent}>
      <View style={styles.dlvMargin}>
      {/* 타이틀 */}
        <Text style={styles.paymentTitle}>결제정보</Text>

        {/* 박스 영역 */}
        <View style={styles.paymentBox}>
          <View style={styles.paymentRow}>
            <Text style={styles.label}>주문상품</Text>
            <Text style={styles.value}>{formatNumber(totalProductPrice)}원</Text>
          </View>

          {!isPickup && (
            <View style={styles.paymentRow}>
              <Text style={styles.label}>
                배송비
                <Text style={styles.statusText}>{getDeliveryStatus()}</Text>
              </Text>
              <Text style={styles.value}>{formatNumber(deliveryFee)}원</Text>
            </View>
          )}

          {/* 포인트 */}
          <View style={styles.paymentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                포인트사용
                <Text style={styles.subLabel}> (보유: {formatNumber(currentPoints)}원)</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.useAllBtn} onPress={handleUseAllPoints}>
              <Text style={styles.useAllText}>전액사용</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pointRow}>
            <Text style={styles.minus}>-</Text>
            <TextInput
              style={styles.pointInput}
              keyboardType="numeric"
              value={String(pointsToUse)}
              onChangeText={(text) => {
                const value = Math.max(0, parseInt(text) || 0);
                const maxValue = Math.min(currentPoints, totalProductPrice);
                setPointsToUse(Math.min(value, maxValue));
              }}
            />
            <Text style={styles.unit}>원</Text>
          </View>

          {/* 최종금액 */}
          <View style={styles.finalRow}>
            <Text style={styles.finalLabel}>최종결제금액</Text>
            <Text style={styles.finalAmount}>{formatNumber(Math.max(0, finalAmount))}원</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dlvContent: {
    backgroundColor: '#fff',
  },
  dlvMargin: {
    marginHorizontal: 15,
    marginVertical: 19,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  paymentBox: {
    flexDirection: 'column',
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    color: "gray",
  },
  subLabel: {
    fontSize: 12,
    color: "#888",
    marginLeft: 6,
  },
  useAllBtn: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  useAllText: {
    fontSize: 12,
    color: "#333",
    backgroundColor: '#fff',
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  minus: {
    fontSize: 16,
    marginRight: 4,
    // color: "#f00",
  },
  pointInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    width: 80,
    marginRight: 6,
    textAlign: "right",
  },
  unit: {
    fontSize: 14,
    color: "#000",
  },
  finalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  finalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  finalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});

export default PayInfoSection;
