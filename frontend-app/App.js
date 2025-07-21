import { StatusBar } from "expo-status-bar";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Main_Login/LoginScreen";
import MainScreen from "./consumer/Screen/MainScreen";
import CustomerLoginScreen from "./consumer/Screen/Login/CustomerLoginScreen";
import StoreScreen from "./consumer/Screen/Store/StoreScreen";


const Stack = createNativeStackNavigator();

// 개발중인 화면 보고싶으면 initialRouteName 값 개발중인 화면 name으로 바꾸면 됨
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Store" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
