import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://3.39.239.179",
  timeout: 10000,
});

// 요청마다 쿠키 헤더 직접 넣기
api.interceptors.request.use(async (config) => {
  const cookie = await AsyncStorage.getItem("cookie"); // 로그인 시 저장한 쿠키
  if (cookie) {
    config.headers.Cookie = cookie;
  }
  return config;
});

export default api;
