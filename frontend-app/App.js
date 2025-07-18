import { StatusBar } from 'expo-status-bar';
import React from 'react';
import LoginScreen from './Main_Login/LoginScreen';
import StoreScreen from './consumer/Screen/Store/StoreScreen';

export default function App() {
  return (
    <>
      <LoginScreen />
      <StatusBar style="auto" />
      <StoreScreen />
    </>
  );
}
