import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export default function useUserStatus(targetUserId, targetUserType) {
  const [userStatus, setUserStatus] = useState({
    isAvailable: false,
    status: "OFFLINE",
  });
  const [loading, setLoading] = useState(false);

  // 상대방 온라인 상태 확인 함수
  const checkUserStatus = useCallback(async () => {
    if (!targetUserId || !targetUserType) return;

    setLoading(true);
    try {
      // 상태 확인 로그 축소: 5초마다 출력하는 것은 너무 빈번
      // console.log(`👤 사용자 상태 확인: ${targetUserType}/${targetUserId}`);
      const response = await api.get(
        `/api/users/status/${targetUserType}/${targetUserId}`
      );

      if (response.data && response.data.data) {
        const statusData = {
          isAvailable: response.data.data.isAvailable,
          status: response.data.data.status,
        };
        // 상태가 변경된 경우에만 로그 출력
        if (JSON.stringify(statusData) !== JSON.stringify(userStatus)) {
          console.log("👤 상태 변경:", statusData);
        }
        setUserStatus(statusData);
      }
    } catch (error) {
      console.error("상대방 상태 확인 실패:", error);
      setUserStatus({
        isAvailable: false,
        status: "OFFLINE",
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, targetUserType]);

  // 상태 텍스트 반환
  const getStatusText = useCallback(() => {
    if (targetUserType === "CUSTOMER") {
      return userStatus.isAvailable ? "온라인" : "오프라인";
    } else {
      // 판매자의 경우
      switch (userStatus.status) {
        case "OPEN":
          return "영업중";
        case "CLOSED":
          return "영업종료";
        case "BREAK":
          return "브레이크타임";
        default:
          return "상태 확인 불가";
      }
    }
  }, [userStatus, targetUserType]);

  // 상태 색상 반환
  const getStatusColor = useCallback(() => {
    if (userStatus.isAvailable) {
      return "#28a745"; // 초록색
    } else {
      return "#6c757d"; // 회색
    }
  }, [userStatus]);

  // 컴포넌트 마운트 시 상태 확인 및 주기적 업데이트
  useEffect(() => {
    if (!targetUserId || !targetUserType) return;

    // 즉시 상태 확인
    checkUserStatus();

    // 10초마다 상태 업데이트 (로그 부담 줄이기)
    const statusInterval = setInterval(checkUserStatus, 10000);

    return () => clearInterval(statusInterval);
  }, [targetUserId, targetUserType, checkUserStatus]);

  return {
    userStatus,
    loading,
    getStatusText,
    getStatusColor,
    refreshStatus: checkUserStatus,
  };
}
