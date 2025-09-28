// frontend-app/Seller/Screen/SellerLoginScreen.js
import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import styles from "../Style/SellerLoginStyle";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import api from "../../api/api";
import useLogin from "../../Hook/useLogin";

export default function SellerLoginScreen() {

    // 🔸 DTO에 맞춰 'email', 'password' 로 명명합니다.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigation = useNavigation();
    const { setIsLoggedIn, setUser, isLoading } = useLogin();

    if (isLoading) return null;

    const handleSellerLogin = async () => {
        if (submitting) return;
        if (!email || !password) {
            Alert.alert("오류", "이메일과 비밀번호를 입력해 주세요.");
            return;
        }

        setSubmitting(true);
        try {
            // 1) 통합 로그인 - LoginRequestDto { email, password, userType }
            const loginRes = await api.post("/api/auth/login", {
                email,
                password,
                userType: "SELLER",
            });


            // ApiResponseJson 규격: { data: {...} } 또는 바로 본문
            const data = loginRes?.data?.data ?? loginRes?.data ?? {};
            const accessToken = data?.accessToken;
            const refreshToken = data?.refreshToken;
            const userType = data?.userType ?? "SELLER";

            // 2) 토큰 저장 (AT: AsyncStorage, RT: SecureStore)
            if (accessToken) await AsyncStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                await SecureStore.setItemAsync("refreshToken", refreshToken);
                // 혹시 예전 저장분이 있다면 정리
                await AsyncStorage.removeItem("refreshToken");
            }
            await AsyncStorage.setItem("userType", userType);

            // 3) 판매자 식별 정보 조회 (sellerId, sellerName)
            //    GET /api/sellers  →  { data: { seller: { sellerId, sellerName } } }
            const sellersRes = await api.get("/api/sellers");
            const sellersData = sellersRes?.data?.data ?? {};
            const seller = sellersData?.seller ?? {};
            const sellerId = seller?.sellerId ?? null;
            const sellerName = seller?.sellerName ?? null;

            // 4) (선택) 판매자 상세 정보 - storeName 등 (id/email은 여기서 오지 않음)
            //    GET /api/sellers/me → { data: { storeName, sellerInformationDto: {...} } }
            let storeName = null;
            try {
                const meRes = await api.get("/api/sellers/me");
                const meData = meRes?.data?.data ?? {};
                storeName = meData?.storeName ?? null;
            } catch (e) {
                // 상세는 선택 사항이므로 조용히 무시
                console.log("판매자 상세 조회 건너뜀:", e?.message);
            }

            // 5) 앱 전역 user 객체 구성 (컨텍스트/스토리지 용)
            //    └ DTO 키를 그대로 반영: sellerId, sellerName (+선택 storeName)
            const userData = {
                id: sellerId,
                nickname: sellerName,
                storeName: storeName,
                userType: "SELLER",
            };

            await AsyncStorage.setItem("user", JSON.stringify(userData));
            await AsyncStorage.setItem("isLoggedIn", "true");

            setUser(userData);
            setIsLoggedIn(true);

            // 6) 메인으로 이동 (필요 시 판매자 전용 홈으로 교체)
            navigation.replace("SellerMain", {storeName: storeName ?? sellerName ?? "매장 이름",
                sellerId: sellerId ?? null,
                sellerName: sellerName ?? null,});
        } catch (err) {
            console.warn("판매자 로그인 실패:", err);
            Alert.alert("로그인 실패", "이메일 또는 비밀번호를 확인해 주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/spLogo.png")} style={styles.logo} />

            <TextInput
                placeholder="이메일"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="비밀번호"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSellerLogin}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={styles.loginButtonText}>로그인</Text>
                )}
            </TouchableOpacity>

            <View style={styles.footerLinks}>
                <Text style={styles.footerText}>아이디 찾기</Text>
                <Text style={styles.footerDot}>|</Text>
                <Text style={styles.footerText}>비밀번호 찾기</Text>
            </View>
        </View>
    );

}
