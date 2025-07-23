import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import KakaoMapApi from '../../../../../GlobalCmp/KakaoMapApi';
import styles from '../../StoreStyle';

export default function StoreMainInfo(
    {
        address,
        addressDetail,
        phone,
        operatingHours,
        storeDescription,
    }
) {
    return(
        <View style={styles.storeMainInfo}>
            <View style={{
                // borderBottom: "1px solid #a7a7a7",
            }}>
                <KakaoMapApi
                    address='부산 연제구 연수로 115' 
                />
            </View>
            <Text>
                미니 인포
            </Text>
        </View>
    )
}