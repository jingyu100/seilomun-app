import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import useStoreInfo from "../../../Hook/useStoreInfo.js";
import styles from './StoreStyle.js';
import Header from '../Header/Header.js';
import BottomTab from '../BottomTab/BottomTab.js';
import StoreHead from "./StoreComponents/StoreHead.js";

export default function StoreScreen() {
    // const { store, sellerId } = useStoreInfo();

    // const sellerInformationDto = store?.sellerInformationDto;
    // const storeImages = sellerInformationDto?.sellerPhotoUrls;

    return (
        <View style={styles.container}>
            <Header />
            {/* <Image 
                source={
                    storeImages && storeImages.length > 0
                        ? { uri: storeImages[0] }
                        : require('../../../assets/noImage.jpg')
                }
                 style={styles.storeImage}
                 resizeMode="cover" // object-fit: cover 대체용
            /> */}
            <Image 
                source={require('../../../assets/noImage.jpg')}
                style={styles.storeImage} 
                resizeMode="cover" // object-fit: cover 대체용
            />
                 
            <ScrollView style={styles.storeUI}>
                <View style={{ backgroundColor: '#fff', }}>
                    <View style={styles.storeMargin}>
                        <StoreHead
                            testID='storeHead'
                            // store={store}
                            // sellerId={sellerId}
                            // onOpenChat={handleOpenChat}
                        />


                        <View testID="storeBdoy">
                            {/* 여기에 리뷰, 기타 내용이 추가되면 다 보여짐 */}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <BottomTab />
        </View>
    )
}