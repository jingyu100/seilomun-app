import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import api from "../../../../api/api.js";

const CLIENT_KEY = "test_ck_AQ92ymxN341KPlO15vDvVajRKXvd";
const APP_SCHEME = "myapp"; // iOS/Android URL scheme 등록 필요(Info.plist/AndroidManifest)
const SUCCESS_URL = `${APP_SCHEME}://payment/success`;
const FAIL_URL = `${APP_SCHEME}://payment/fail`;

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
  const [paymentUrl, setPaymentUrl] = useState(""); // 서버가 주면 그대로 사용
  const [paymentHtml, setPaymentHtml] = useState(""); // 서버 URL 없으면 클라에서 생성
  const [loading, setLoading] = useState(false);

  const webviewRef = useRef(null);
  const currentOrderIdRef = useRef(null); // 서버 주문 PK(정리용)
  const currentTxnIdRef = useRef(null);   // Toss 결제용 orderId

  const calculatedFinalAmount =
    finalAmount || totalProductPrice + (isPickup ? 0 : deliveryFee);

  // 간단 유효성
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
    if (!products?.length) {
      Alert.alert("안내", "주문할 상품이 없습니다.");
      return false;
    }
    return true;
  };

  // HTML 인젝션 대비
  const escapeHtml = (s = "") =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // 서버 URL 없을 때 사용할 결제 HTML (Toss JS SDK)
  const buildPaymentHTML = ({ clientKey, orderId, orderName, amount }) => {
    const safeName = escapeHtml(orderName);
    return `
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
  <title>Toss Payment</title>
  <script src="https://js.tosspayments.com/v1"></script>
  <style>
    html,body{margin:0;padding:0;height:100%;font-family:system-ui,-apple-system,Segoe UI,Roboto}
    .wrap{display:flex;align-items:center;justify-content:center;height:100%}
    .btn{padding:14px 20px;border-radius:8px;background:#000;color:#fff;font-weight:600}
  </style>
</head>
<body>
  <div class="wrap">
    <button id="pay" class="btn">결제 진행</button>
  </div>
  <script>
    (function(){
      const tossPayments = TossPayments('${clientKey}');
      const params = {
        amount: ${Number(amount)},
        orderId: '${orderId}',
        orderName: '${safeName}',
        customerName: '고객',
        customerEmail: 'customer@example.com',
        successUrl: '${SUCCESS_URL}',
        failUrl: '${FAIL_URL}',
      };
      function go(){
        tossPayments.requestPayment('CARD', params).catch(function(e){
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type:'ERROR',
              code: e.code || e.name,
              message: e.message
            }));
          }
        });
      }
      document.getElementById('pay').addEventListener('click', go);
      // 자동 실행 원하면 아래 주석 해제
      // go();
    })();
  </script>
</body>
</html>`;
  };

  // 결제 버튼
  const handlePaymentClick = async () => {
    try {
      if (!validateOrderData()) return;
      setLoading(true);

      const first = products[0];
      const orderName =
        products.length === 1
          ? `${first.name} ${first.quantity || 1}개`
          : `${first.name} 외 ${products.length - 1}건`;

      // 1) 서버 주문 생성
      const orderData = {
        usedPoints: Number(pointsToUse) || 0,
        memo: isPickup
          ? pickupInfo.pickupRequest || "픽업 주문"
          : deliveryInfo.deliveryRequest || "배송 주문",
        isDelivery: isPickup ? "N" : "Y",
        deliveryAddress: isPickup
          ? "매장 픽업"
          : `${deliveryInfo.mainAddress || ""} ${deliveryInfo.detailAddress || ""}`.trim(),
        orderProducts: products.map((p) => ({
          productId: Number(p.id ?? p.productId),
          quantity: Number(p.quantity || 1),
          price: Number(p.discountPrice ?? p.originalPrice),
          currentDiscountRate: Number(p.currentDiscountRate || 0),
        })),
        payType: "CARD",
        orderName,
        amount: Number(calculatedFinalAmount),
      };

      const resp = await api.post("/api/orders/buy", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      // 서버 응답 다양한 형태 대응
      const data = resp.data?.data?.Update || resp.data?.data || {};
      const realOrderId = data.orderId || data.id; // 서버 주문 PK
      const txnId = data.transactionId || data.tossOrderId || realOrderId; // Toss 결제용 orderId
      const amount = Number(data.amount ?? orderData.amount);
      const name = data.orderName || orderData.orderName;

      if (!realOrderId || !txnId || !amount) {
        throw new Error("서버에서 orderId/transactionId/amount 값을 받지 못했습니다.");
      }

      currentOrderIdRef.current = realOrderId;
      currentTxnIdRef.current = String(txnId);

      // 2-A) 서버가 결제 URL을 주는 경우
      if (data.paymentUrl) {
        setPaymentUrl(String(data.paymentUrl));
        setPaymentHtml("");
        setShowWebView(true);
        return;
      }

      // 2-B) 서버 URL이 없으면 클라에서 HTML 생성
      const html = buildPaymentHTML({
        clientKey: CLIENT_KEY,
        orderId: String(txnId),
        orderName: name,
        amount,
      });
      setPaymentHtml(html);
      setPaymentUrl("");
      setShowWebView(true);
    } catch (error) {
      console.error("❌ 결제 처리 실패:", error?.response?.data || error?.message);
      Alert.alert("결제 실패", error?.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // WebView → RN 메시지
  const handleWebViewMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data || "{}");
      if (msg?.type === "ERROR") {
        if (msg.code === "USER_CANCEL") {
          Alert.alert("안내", "사용자가 결제를 취소했습니다.");
        } else {
          Alert.alert("결제 실패", msg.message || "오류가 발생했습니다.");
        }
        // 취소/오류에도 서버 정리(선택)
        const orderId = currentOrderIdRef.current;
        currentOrderIdRef.current = null;
        currentTxnIdRef.current = null;
        setShowWebView(false);
        if (orderId) {
          setTimeout(() => {
            api.post(`/api/orders/close-payment/${orderId}`).catch(() => {});
          }, 0);
        }
      }
    } catch {}
  };

  // ✅ 반드시 동기 반환(Boolean). 외부 스킴/딥링크/마켓 처리 포함.
  const handleShouldStart = (req) => {
    const url = req?.url ?? "";

    // 0) 토스 앱 스킴 직접 열기
    if (url.startsWith("supertoss://")) {
      Linking.openURL(url).catch(() => {});
      return false;
    }

    // 1) intent 스킴 → 앱 스킴 변환 후 열기, 미설치 시 마켓
    if (url.startsWith("intent://")) {
      try {
        const scheme = (url.match(/#Intent;scheme=([^;]+);/) || [])[1]; // 예: supertoss
        const path = url.replace("intent://", "").split("#Intent;")[0]; // 예: pay?payToken=...
        const appUrl = `${scheme}://${path}`; // supertoss://pay?payToken=...

        Linking.openURL(appUrl).catch(() => {
          const pkg = (url.match(/;package=([^;]+);/) || [])[1]; // viva.republica.toss
          if (pkg && Platform.OS === "android") {
            const market = `market://details?id=${pkg}`;
            Linking.openURL(market).catch(() => {
              Linking.openURL(`https://play.google.com/store/apps/details?id=${pkg}`).catch(() => {});
            });
          }
        });
      } catch {
        // 파싱 실패해도 WebView 로딩 막기
      }
      return false;
    }

    // 2) 마켓 스킴 처리
    if (url.startsWith("market://")) {
      Linking.openURL(url).catch(() => {});
      return false;
    }

    // 3) 성공/실패 딥링크 처리
    if (url.startsWith(SUCCESS_URL) || url.startsWith(FAIL_URL)) {
      const orderId = currentOrderIdRef.current;
      currentOrderIdRef.current = null;
      setShowWebView(false);

      setTimeout(() => {
        if (url.startsWith(SUCCESS_URL)) {
          Alert.alert("결제 완료", "결제가 성공적으로 완료되었습니다.");
        } else {
          Alert.alert("결제 실패", "결제가 취소되었거나 실패했습니다.");
        }
        if (orderId) {
          api.post(`/api/orders/close-payment/${orderId}`).catch(() => {});
        }
      }, 0);

      return false;
    }

    // 그 외는 그대로 로드
    return true;
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
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>결제하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView 모달 */}
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <WebView
          ref={webviewRef}
          source={
            paymentUrl
              ? { uri: paymentUrl } // 서버 제공 URL
              : { html: paymentHtml, baseUrl: "https://localhost" } // 클라 생성 HTML
          }
          onMessage={handleWebViewMessage}
          onShouldStartLoadWithRequest={handleShouldStart}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
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
