import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import styles from "../../Style/Login/CustomerLoginStyle";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/api";

export default function CustomerLoginScreen() {
  const navigation = useNavigation();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) return;
    if (!id || !password) {
      Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: id,
        password: password,
        userType: "CUSTOMER",
      });

      const accessToken = res?.data?.data?.accessToken || res?.data?.accessToken;
      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
      }

      try {
        const info = await api.get("/api/customers");
        const customer = info?.data?.data?.customer;
        if (customer) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify({
              id: customer.id,
              email: customer.email,
              nickname: customer.nickname,
              userType: "CUSTOMER",
            })
          );
        }
      } catch (e) {
        // 사용자 정보 조회 실패해도 로그인 성공으로 간주하고 진행
        console.warn("사용자 정보 조회 실패:", e?.message);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.error("로그인 실패:", error);
      Alert.alert("로그인 실패", "아이디 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/spLogo.png")} style={styles.logo} />

      <TextInput
        placeholder="아이디"
        placeholderTextColor="#999"
        value={id}
        onChangeText={setId}
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
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        <Text style={styles.loginButtonText}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Text>
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
