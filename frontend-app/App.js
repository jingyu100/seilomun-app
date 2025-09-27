// App.js
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
import SellerBusinessNumberScreen from "./Seller/Screen/SellerBusinessNumberScreen";
import StoreScreen from "./consumer/Screen/Store/StoreScreen";
import CustomerRegisterScreen from "./consumer/Screen/Login/CustomerRegisterScreen";
import CustomerSettingsScreen from "./consumer/Screen/UserSettings/CustomerSettingsScreen";
import CustomerChatting from "./consumer/Screen/chatting/CustomerChatting";
import ChatRoomList from "./consumer/Screen/chatting/ChatRoomList";
import ProductScreen from "./consumer/Screen/Product/ProductScreen.js";
import PaymentScreen from "./consumer/Screen/payment/PaymentScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <LoginProvider>
        <WebSocketProvider>
<<<<<<< HEAD
          <ChatRoomsProvider>
            <NavigationContainer>
              <Stack.Navigator
                  initialRouteName="CustomerSettings"
                  screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
                <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
                {/* 테스트용 initialParams는 나중에 제거 */}
                <Stack.Screen name="Store" component={StoreScreen} initialParams={{ sellerId: 1 }} />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
                <Stack.Screen name="CustomerSettings" component={CustomerSettingsScreen} />
                <Stack.Screen name="ChatRoomList" component={ChatRoomList} />
                <Stack.Screen name="CustomerChatting" component={CustomerChatting} />
              </Stack.Navigator>
            </NavigationContainer>
          </ChatRoomsProvider>
=======
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
              <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
              <Stack.Screen name="SellerBusinessNumberScreen" component={SellerBusinessNumberScreen} />
              {/* 나중에 initialParams={{ sellerId: 1 }} 이거 지우기 */}
              <Stack.Screen name="Store" component={StoreScreen} initialParams={{ sellerId: 1 }} />
              <Stack.Screen name="Product" component={ProductScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
              <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
              <Stack.Screen name="CustomerSettings" component={CustomerSettingsScreen} />
              <Stack.Screen name="ChatRoomList" component={ChatRoomList} />
              <Stack.Screen name="CustomerChatting" component={CustomerChatting} />
            </Stack.Navigator>
          </NavigationContainer>
>>>>>>> f1fa0b29553ab930642d94d4bfe30c5fb6336c3a
        </WebSocketProvider>
      </LoginProvider>
  );
}
