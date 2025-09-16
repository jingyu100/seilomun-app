import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedLogin = await AsyncStorage.getItem("isLoggedIn");

        if (storedUser && storedLogin === "true") {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("인증 상태 초기화 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const isLoggedInFromStorage = await AsyncStorage.getItem("isLoggedIn");

        if (isLoggedInFromStorage !== "true") {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
