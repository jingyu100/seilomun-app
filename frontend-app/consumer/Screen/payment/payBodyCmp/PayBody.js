import React, { useRef, useEffect, useState } from 'react';
import { useRoute } from "@react-navigation/native";
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
import StepTabs from './StepTabs.js';
import PickUp from './pickupCmp/PickUp.js';
import Delivery from './deliveryCmp/Delivery';
import OrderItemsSection from './OrderItemsSection.js';
import PayInfoSection from './PayInfoSection.js';
import PayBottom from '../payBtmCmp/PayBottom.js';


export default function PayBody() {

    const route = useRoute();
    const [seller, setSeller] = useState(null); // 통합된 판매자 정보
    const [activeTab, setActiveTab] = useState("delivery");
    const [pointsToUse, setPointsToUse] = useState(0)
    const [showResultModal, setShowResultModal] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
  
    useEffect(() => {
        console.log("네비게이션 파라미터 확인:", {
          result, paymentKey, orderId, amount, code, message
        });
      
        if (result === "success" && paymentKey && orderId && amount) {
          setPaymentResult({
            type: "success",
            paymentKey,
            orderId,
            amount: parseInt(amount)
          });
          setShowResultModal(true);
        } else if (result === "fail" && code && message && orderId) {
          setPaymentResult({
            type: "fail",
            code,
            message,
            orderId
          });
          setShowResultModal(true);
        }
      }, [result, paymentKey, orderId, amount, code, message]);
      
  
    // ✨ 새로 추가: 배송 정보 state
    const [deliveryInfo, setDeliveryInfo] = useState({
      mainAddress: "",
      detailAddress: "",
      postCode: "",
      phoneFirst: "",
      phoneMiddle: "",
      phoneLast: "",
      deliveryRequest: "",
      saveAsDefault: false,
    });
  
    // ✨ 새로 추가: 픽업 정보 state
    const [pickupInfo, setPickupInfo] = useState({
      pickupRequest: "",
    });
  
    // 🆕 단일 상품과 장바구니 상품들을 모두 처리
    const { 
        product, 
        products: cartProducts, 
        fromCart, 
        sellerId: directSellerId, 
        result, 
        paymentKey, 
        orderId, 
        amount, code, message 
    } = route.params || {};
  
    // 상품 배열 통합 처리
    const products = React.useMemo(() => {
      if (fromCart && cartProducts) {
        // 장바구니에서 온 경우
        console.log("장바구니에서 온 상품들:", cartProducts);
        return cartProducts;
      } else if (product) {
        // 단일 상품에서 온 경우
        console.log("단일 상품:", product);
        return [product];
      }
      return [];
    }, [product, cartProducts, fromCart]);
  
    console.log("최종 처리된 상품들:", products);
  
    // 🆕 판매자 정보 가져오기 (첫 번째 상품의 판매자 기준)
    useEffect(() => {
      const fetchSellerInfo = async () => {
        if (!products || products.length === 0) {
          console.log("상품 정보가 없습니다:", products);
          return;
        }
  
        // 첫 번째 상품의 판매자 ID 가져오기
        const firstProduct = products[0];
        let sellerId = directSellerId || firstProduct?.sellerId || firstProduct?.seller?.id;
  
        console.log("직접 전달받은 sellerId:", directSellerId);
        console.log(
          "상품에서 추출한 sellerId:",
          firstProduct?.sellerId || firstProduct?.seller?.id
        );
        console.log("최종 사용할 sellerId:", sellerId);
  
        // sellerId가 없으면 상품 정보를 다시 조회해서 sellerId 얻기
        if (!sellerId && firstProduct?.productId) {
          try {
            console.log("sellerId가 없어서 상품 정보 재조회:", firstProduct.productId);
            const productResponse = await api.get(
              `/api/products/${firstProduct.productId}`
            );
  
            const productData = productResponse.data?.data?.Products;
            sellerId = productData?.sellerId || productData?.seller?.id;
            console.log("재조회로 얻은 sellerId:", sellerId);
          } catch (error) {
            console.error("상품 정보 재조회 실패:", error);
          }
        }
  
        if (!sellerId) {
          console.log("sellerId를 찾을 수 없습니다:", firstProduct);
          return;
        }
  
        try {
          console.log("판매자 정보 조회 시작. sellerId:", sellerId);
  
          const response = await api.get(`/api/sellers/${sellerId}`);
          console.log("판매자 정보 응답:", response.data);
  
          const sellerData = response.data.data.seller;
          setSeller(sellerData);
          console.log("판매자 정보 설정 완료:", sellerData);
  
          // ✨ 배달 불가 매장이면 '포장' 탭으로 즉시 전환
          if (sellerData.deliveryAvailable !== "Y") {
            setActiveTab("pickup");
          }
        } catch (error) {
          console.error("판매자 정보 조회 실패:", error);
        }
      };
  
      fetchSellerInfo();
    }, [products]);
  
    // 🆕 장바구니 상품들의 판매자가 모두 동일한지 확인
    useEffect(() => {
      if (products && products.length > 1) {
        const firstSellerId = products[0]?.sellerId || products[0]?.seller?.id;
        const allSameSeller = products.every((product) => {
          const sellerId = product?.sellerId || product?.seller?.id;
          return sellerId === firstSellerId;
        });
  
        if (!allSameSeller) {
            Alert.alert("안내", "서로 다른 판매자의 상품들은 함께 주문할 수 없습니다.");
          // 필요시 이전 페이지로 리다이렉트
          // navigate(-1);
        }
      }
    }, [products]);
  
    // 주문 상품 총액 계산
    const totalProductPrice = products.reduce((total, product) => {
      return (
        total +
        (product.totalPrice ||
          (product.discountPrice || product.originalPrice) * (product.quantity || 1))
      );
    }, 0);
  
    // 동적 배달비 계산 함수 - 백엔드 구조에 맞게 수정
    const calculateDeliveryFee = (orderAmount, sellerData) => {
      console.log("🚚 배송비 계산 시작");
      console.log("주문 금액:", orderAmount);
      console.log("판매자 데이터:", sellerData);
  
      // 배송 불가능한 경우
      if (!sellerData || sellerData.deliveryAvailable !== "Y") {
        console.log("❌ 배송 불가능 - 픽업만 가능");
        return 0; // 픽업만 가능
      }
  
      // 배송비 단계별 적용
      const deliveryRules = sellerData.deliveryFeeDtos || [];
      console.log("배송비 규칙들:", deliveryRules);
  
      // 중복 제거를 위해 ordersMoney 기준으로 고유한 규칙만 필터링
      const uniqueRules = deliveryRules.filter(
        (rule, index, self) =>
          index === self.findIndex((r) => r.ordersMoney === rule.ordersMoney)
      );
  
      // 주문 금액 기준으로 오름차순 정렬
      const sortedRules = [...uniqueRules].sort((a, b) => a.ordersMoney - b.ordersMoney);
      console.log("정렬된 고유 규칙들:", sortedRules);
  
      // 주문 금액에 적용 가능한 가장 높은 기준 찾기
      let applicableFee = sortedRules[0]?.deliveryTip || 3000; // 첫 번째 규칙의 배송비를 기본값으로
      console.log("초기 배송비:", applicableFee);
  
      for (const rule of sortedRules) {
        console.log(`규칙 확인: ${rule.ordersMoney}원 이상 → ${rule.deliveryTip}원`);
        if (orderAmount >= rule.ordersMoney) {
          applicableFee = rule.deliveryTip;
          console.log(
            `✅ 적용된 배송비: ${applicableFee}원 (${rule.ordersMoney}원 이상 조건)`
          );
        }
      }
  
      console.log("🎯 최종 배송비:", applicableFee);
      return applicableFee;
    };
  
    // 실제 배달비 계산 (배송 탭일 때만)
    const deliveryFee =
      activeTab === "delivery" ? calculateDeliveryFee(totalProductPrice, seller) : 0;
  
    // 최종 결제 금액 계산 (포인트 포함)
    const finalAmount = totalProductPrice + deliveryFee - pointsToUse;
  
    // 디버깅용 로그
    console.log("=== 결제 정보 업데이트 ===");
    console.log("총 상품 금액:", totalProductPrice);
    console.log("배송비:", deliveryFee);
    console.log("사용한 포인트:", pointsToUse);
    console.log("최종 결제 금액:", finalAmount);
    console.log("배송 정보:", deliveryInfo);
    console.log("픽업 정보:", pickupInfo);
    console.log("장바구니에서 온 것인가:", fromCart);
    console.log("======================");
  
    const handleTabChange = (tab) => {
      // 배달 불가 매장은 '배달' 탭으로 변경 불가
      if (seller?.deliveryAvailable !== "Y" && tab === "delivery") {
        return;
      }
      setActiveTab(tab);
    };
  
    const isDeliveryAvailable = seller ? seller.deliveryAvailable === "Y" : false;

    return (
        <View>
            {/* 탭 영역 */}
            <View style={styles.payHead_bottom}>

                <StepTabs 
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    isDeliveryAvailable={isDeliveryAvailable}
                />
                <ScrollView 
                    style={styles.dlvContainer} 
                    contentContainerStyle={styles.dlvGap}
                    showsVerticalScrollIndicator={false} // 세로 스크롤바 숨김 (옵션)
                >
                        {/* 탭에 따른 컴포넌트 렌더링 */}
                        {activeTab === "delivery" && (
                        <Delivery
                            deliveryInfo={deliveryInfo}
                            setDeliveryInfo={setDeliveryInfo}
                        />
                        )}
                        {activeTab === "pickup" && (
                        <PickUp
                            seller={seller}
                            pickupInfo={pickupInfo}
                            setPickupInfo={setPickupInfo}
                        />
                        )}
                            
                        <OrderItemsSection products={products} deliveryFee={deliveryFee} />
                        <PayInfoSection
                            totalProductPrice={totalProductPrice}
                            deliveryFee={deliveryFee}
                            seller={seller}
                            isPickup={activeTab === "pickup"}
                            pointsToUse={pointsToUse}
                            setPointsToUse={setPointsToUse}
                            finalAmount={finalAmount}
                        />
                </ScrollView>                
            </View>

            {/* 결제 버튼 */}
            <PayBottom 
                products={products}
                deliveryFee={deliveryFee}
                isPickup={activeTab === "pickup"}
                finalAmount={finalAmount}
                deliveryInfo={deliveryInfo}
                pickupInfo={pickupInfo}
                pointsToUse={pointsToUse}
                style= {styles.payBottom}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    payHead_bottom: {

    },
    dlvContainer: {
        width: '100%',
        // height: '100%',
        backgroundColor: '#e3e3e3',
    },
    dlvGap: {
        paddingBottom: 400,
        gap: 8,
    },
    payTabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
        color: '#666',
    },
    activeTabText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        height: 2,
        backgroundColor: 'black',
    },
    tabContent: {
    //   paddingTop: 16,
      paddingBottom: 16,
    },
    payBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      },
})