import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styles from "../../Style/Login/CustomerLoginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/api";
import * as SecureStore from "expo-secure-store";

export default function CustomerLoginScreen() {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigation = useNavigation();

  const handleLoginSubmit = async () => {
    try {
      // 1) 로그인
      const loginRes = await api.post("/api/auth/login", {
        email: loginId,
        password: loginPassword,
        userType: "CUSTOMER",
      });

      console.log(loginRes);

      // 2) 토큰 저장(응답 바디 기준)
      const { accessToken, refreshToken, userType } = loginRes.data.data ?? loginRes.data;
      if (accessToken) await AsyncStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await AsyncStorage.removeItem("refreshToken");
      }
      if (userType) await AsyncStorage.setItem("userType", userType);

      // 3) 내 정보 조회(토큰은 인터셉터가 자동 첨부)
      const meRes = await api.get("/api/customers");
      const customer = meRes.data?.data?.customer ?? meRes.data?.customer ?? {};
      const userData = {
        id: customer.id,
        email: customer.email,
        nickname: customer.nickname,
        userType: userType || "CUSTOMER",
      };

      // 4) 로컬 저장 & 이동
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("isLoggedIn", "true");

      // TODO: 전역 상태(setUser, setIsLoggedIn)를 쓰는 경우 여기서 호출
      // setUser(userData); setIsLoggedIn(true);

      navigation.navigate("Main");
    } catch (error) {
      console.warn("로그인 또는 사용자 정보 조회 실패:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/spLogo.png")} style={styles.logo} />

      <TextInput
        placeholder="아이디"
        placeholderTextColor="#999"
        value={loginId}
        onChangeText={setLoginId}
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호"
        placeholderTextColor="#999"
        secureTextEntry
        value={loginPassword}
        onChangeText={setLoginPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.snsLoginText}>간편하게 로그인</Text>
      <View style={styles.snsContainer}>
        <Image source={require("../../../assets/google.png")} style={styles.snsIcon} />
        <Image source={require("../../../assets/naver.png")} style={styles.snsIcon} />
        <Image source={require("../../../assets/kakao.png")} style={styles.snsIcon} />
      </View>

      <View style={styles.footerLinks}>
        <Text style={styles.footerText}>아이디 찾기</Text>
        <Text style={styles.footerDot}>|</Text>
        <Text style={styles.footerText}>비밀번호 찾기</Text>
        <Text style={styles.footerDot}>|</Text>

        <TouchableOpacity onPress={() => navigation.navigate("CustomerRegister")}>
          <Text style={styles.footerText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
