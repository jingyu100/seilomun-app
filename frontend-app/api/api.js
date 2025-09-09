import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = "http://3.39.239.179"; // 여기서만 주소 변경하면 됨!

export const S3_BASE_URL = "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // withCredentials: true, // 쿠키 기반을 쓸 거면 켜고, 수동 Cookie 헤더는 제거 권장,
});

// 요청마다 쿠키 헤더 직접 넣기
api.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};
  // (선택) 쿠키를 쓰는 서버에서만
  // const cookie = await AsyncStorage.getItem("cookie");
  // if (cookie) config.headers.Cookie = cookie;

  // Bearer 토큰
  const accessToken = await AsyncStorage.getItem("accessToken");
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

// ========== 응답 인터셉터: 401 → refresh → 재시도 ==========
let isRefreshing = false;
let waiters = [];
const notifyAll = (token) => {
  waiters.forEach((r) => r(token));
  waiters = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config ?? {};
    if (status === 401 && !original._retry) {
      original._retry = true;

      // 이미 갱신 중이면 새 AT 나올 때까지 대기
      if (isRefreshing) {
        const newAT = await new Promise((resolve) => waiters.push(resolve));
        if (!newAT) return Promise.reject(error);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAT}`;

        return api(original);
      }

      isRefreshing = true;
      try {
        const rt = await SecureStore.getItemAsync("refreshToken");
        if (!rt) throw error;

        const refreshResp = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken: rt },
          { timeout: 10000 }
        );

        const payload = refreshResp.data?.data ?? refreshResp.data ?? {};
        const nextAT = payload.accessToken;
        const nextRT = payload.refreshToken;

        if (nextAT) await AsyncStorage.setItem("accessToken", nextAT);
        if (nextRT) await SecureStore.setItemAsync("refreshToken", nextRT);

        notifyAll(nextAT || null);

        original.headers = original.headers ?? {};
        if (nextAT) original.headers.Authorization = `Bearer ${nextAT}`;
        return api(original);
      } catch (e) {
        // 갱신 실패 -> 토큰 정리
        await AsyncStorage.removeItem("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        notifyAll(null);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
