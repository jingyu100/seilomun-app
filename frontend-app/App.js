import { StatusBar } from 'expo-status-bar';
import React from 'react';
import LoginScreen from './Main_Login/LoginScreen';

export default function App() {
  return (
    <>
      <LoginScreen />
      <StatusBar style="auto" />
    </>
  );
}
