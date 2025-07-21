import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import LoginScreen from './Main_Login/LoginScreen';
import StoreScreen from './consumer/Screen/Store/StoreScreen';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081'], // 웹 서버 주소로 변경
  config: {
    screens: {
      Login: 'Login',
      Store: 'Store',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Store">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
