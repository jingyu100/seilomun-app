import { StatusBar } from "expo-status-bar";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Main_Login/LoginScreen";
import MainScreen from "./consumer/Screen/MainScreen";
import CustomerLoginScreen from "./consumer/Screen/Login/CustomerLoginScreen";
import SellerLoginScreen from "./seller/Screen/SellerLoginScreen";
import StoreScreen from "./consumer/Screen/Store/StoreScreen";
import CustomerRegisterScreen from "./consumer/Screen/Login/CustomerRegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
        <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
