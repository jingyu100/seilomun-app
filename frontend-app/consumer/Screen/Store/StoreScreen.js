import React, { useRef } from 'react';
import { View, Text, Animated, Image, ScrollView, SafeAreaView, } from 'react-native';
import useStoreInfo from "../../../Hook/useStoreInfo.js";
import styles from './StoreStyle.js';
import Header from '../Header/Header.js';
import BottomTab from '../BottomTab/BottomTab.js';
import StoreHead from "./StoreComponents/StoreHead.js";

export default function StoreScreen() {
    
    const { store, sellerId } = useStoreInfo();

    const sellerInformationDto = store?.sellerInformationDto;
    const storeImages = sellerInformationDto?.sellerPhotoUrls;

    // 가게 이미지 크기 자동 늘어나는 효과
    const scrollY = useRef(new Animated.Value(0)).current;

    const imageScale = scrollY.interpolate({
        inputRange: [-500, 0],
        outputRange: [8, 1],
        extrapolate: 'clamp',
    });

    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, 0],
        outputRange: [0, 0],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView style={styles.container}>
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
            <Animated.Image
                source={
                    storeImages && storeImages.length > 0
                        ? { uri: storeImages[0] }
                        : require('../../../assets/noImage.jpg')
                }
                style={[
                    styles.storeImage,
                    {
                        transform: [
                            { scale: imageScale },
                            { translateY: imageTranslateY },
                        ],
                    },
                ]}
                resizeMode="cover"
            />
                 
                <Animated.ScrollView
                    style={styles.storeUI}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                <View style={{ backgroundColor: '#fff', }}>
                    <View style={styles.storeMargin}>
                        <StoreHead
                            testID='storeHead'
                            store={store}
                            sellerId={sellerId}
                            // onOpenChat={handleOpenChat}
                        />

                        <View testID="storeBdoy">
                            {/* 여기에 리뷰, 기타 내용이 추가되면 다 보여짐 */}
                            
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>
            <BottomTab />
        </SafeAreaView>
    )
}