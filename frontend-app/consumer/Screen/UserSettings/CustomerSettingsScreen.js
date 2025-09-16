import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SimpleHeader from "../Header/SimpleHeader";
import BottomTab from "../BottomTab/BottomTab";
import useLogin from "../../../Hook/useLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function CustomerSettingsScreen() {
  const { user, setIsLoggedIn, setUser } = useLogin();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            // 로컬 저장소에서 사용자 정보 삭제
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("isLoggedIn");
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("userType");
            await SecureStore.deleteItemAsync("refreshToken");

            // 전역 상태 초기화
            setUser(null);
            setIsLoggedIn(false);

            // 로그인 화면으로 이동
            navigation.navigate("CustomerLogin");
          } catch (error) {
            console.error("로그아웃 실패:", error);
            Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <SimpleHeader title="개인 정보 변경" />
      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>이름</Text>
            <Text style={styles.rowValue}>YungJin</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>아이디</Text>
            <Text style={styles.rowValue}>사용자 명</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>비밀번호 변경</Text>
            <Text style={styles.rowArrow}>›</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>휴대폰 번호 변경</Text>
            <Text style={styles.rowArrow}>›</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>생년 월일 변경</Text>
            <Text style={styles.rowArrow}>›</Text>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <BottomTab fixed backgroundColor="#fff" borderColor="#eee" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerBox: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  userName: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 6 },
  headerTabs: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  headerTab: { color: "#777" },
  headerTabActive: { color: "#333", fontWeight: "600" },
  headerDivider: { marginHorizontal: 8, color: "#bbb" },
  section: { paddingHorizontal: 16, paddingTop: 60, marginBottom: 16 },
  sectionTitle: { color: "#888", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 15, color: "#111" },
  rowValue: { fontSize: 13, color: "#999" },
  rowArrow: { fontSize: 20, color: "#999" },
  separator: { height: 1, backgroundColor: "#efefef" },
  logoutButton: {
    backgroundColor: "#ff4444",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
