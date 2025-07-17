import { StatusBar } from "expo-status-bar";
import React from "react";
import LoginScreen from "./Main_Login/LoginScreen";
import MainScreen from "./consumer/Screen/MainScreen";

export default function App() {
  return (
    <>
      <LoginScreen />
      <MainScreen />
      <StatusBar style="auto" />
    </>
  );
}
