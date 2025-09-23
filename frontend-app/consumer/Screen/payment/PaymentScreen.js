import React, { useRef, useEffect, useState } from 'react';
import { useRoute } from "@react-navigation/native";
import {
    StyleSheet,
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
        <SafeAreaView style={styles.container}>
            <View style={styles.payHead}>
                <View style={styles.payTitle}>
                    <Text style={styles.payTitleTxt}>결제</Text>
                </View>
            </View>
            {/* 결제 바디 부분 */}
            <PayBody />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',

    },
    payHead: {
        position: 'static',
    },
    payTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },  
    payTitleTxt: {
        fontSize: 22,
        fontWeight: 500,        
    }
})