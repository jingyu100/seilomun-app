import { StatusBar } from "expo-status-bar";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginProvider } from "./Context/LoginContext";
import { WebSocketProvider } from "./Context/WebSocketContext";
import { ChatRoomsProvider } from "./Context/ChatRoomsContext";
import LoginScreen from "./Main_Login/LoginScreen";
import MainScreen from "./consumer/Screen/MainScreen";
import CustomerLoginScreen from "./consumer/Screen/Login/CustomerLoginScreen";
import SellerLoginScreen from "./Seller/Screen/SellerLoginScreen";
import StoreScreen from "./consumer/Screen/Store/StoreScreen";
import CustomerRegisterScreen from "./consumer/Screen/Login/CustomerRegisterScreen";
import CustomerSettingsScreen from "./consumer/Screen/UserSettings/CustomerSettingsScreen";
import CustomerChatting from "./consumer/Screen/chatting/CustomerChatting";
import ChatRoomList from "./consumer/Screen/chatting/ChatRoomList";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LoginProvider>
      <ChatRoomsProvider>
        <WebSocketProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="CustomerSettings"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
              <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
              <Stack.Screen name="Store" component={StoreScreen} />
              <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
              <Stack.Screen name="CustomerSettings" component={CustomerSettingsScreen} />
              <Stack.Screen name="ChatRoomList" component={ChatRoomList} />
              <Stack.Screen name="CustomerChatting" component={CustomerChatting} />
            </Stack.Navigator>
          </NavigationContainer>
        </WebSocketProvider>
      </ChatRoomsProvider>
    </LoginProvider>
  );
}
