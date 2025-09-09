import React, { useRef, useEffect, useState } from 'react';
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Animated,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PayBody from './payBodyCmp/PayBody';


export default function PaymentScreen() {

    return (
        <SafeAreaView>
            
            <View>
                <View>결제</View>
            </View>

            {/* 결제 바디 부분 */}
            <PayBody />            

        </SafeAreaView>
    )
}