import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://3.39.239.179"; // 여기서만 주소 변경하면 됨!

export const S3_BASE_URL = "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 요청마다 쿠키 헤더 직접 넣기
api.interceptors.request.use(async (config) => {
  const cookie = await AsyncStorage.getItem("cookie"); // 웹 대비용 백업 가능
  const accessToken = await AsyncStorage.getItem("accessToken"); // 앱 인증용

  if (cookie) {
    config.headers.Cookie = cookie;
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
