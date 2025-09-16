import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styles from "../../Style/Login/CustomerLoginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/api";
import * as SecureStore from "expo-secure-store";
import useLogin from "../../../Hook/useLogin";

export default function CustomerLoginScreen() {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setIsLoggedIn, setUser, isLoading } = useLogin();
  const navigation = useNavigation();

  if (isLoading) return null;

  const handleLoginSubmit = async () => {
    try {
      // 1) 로그인
      const loginRes = await api.post("/api/auth/login", {
        email: loginId,
        password: loginPassword,
        userType: "CUSTOMER",
      });

      console.log("로그인", loginRes);

      // 2) 토큰 저장(응답 바디 기준)
      const { accessToken, refreshToken, userType } = loginRes.data.data ?? loginRes.data;

      if (accessToken) await AsyncStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await AsyncStorage.removeItem("refreshToken");
      }
      if (userType) await AsyncStorage.setItem("userType", userType);

      console.log("AT(saved):", await AsyncStorage.getItem("accessToken"));
      console.log("RT(saved):", await SecureStore.getItemAsync("refreshToken"));

      // 3) 내 정보 조회(토큰은 인터셉터가 자동 첨부)
      const meRes = await api.get("/api/customers/me");
      console.log("내 정보 조회", meRes);
      const payload = meRes.data?.data; // data 안의 data 객체
      const userData = {
        id: payload.id,
        email: payload.email,
        nickname: payload.username, // username이 실제 닉네임
        userType: payload.userType || "CUSTOMER",
      };

      console.log("userData", userData);

      // 4) 로컬 저장 & 전역 상태 업데이트
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("isLoggedIn", "true");

      // 전역 상태 업데이트
      setUser(userData);
      setIsLoggedIn(true);

      console.log("로그인 성공! 사용자 정보:", userData);
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
