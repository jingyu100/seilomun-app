import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import styles from '../StoreStyle.js';
import StoreMiniInfo from './StoreHeadCmp/StoreMiniInfo';
import StoreMenu from './StoreBodyCmp/StoreMenu.js';
import StoreMainInfo from './StoreBodyCmp/StoreMainInfo.js';
import StoreReview from './StoreBodyCmp/StoreReview.js';
import FavoriteButtonBox from './StoreHeadCmp/FavoriteButtonBox.js';
import Inquiry from './StoreHeadCmp/Inquriy.js';

export default function StoreHead(
    { store, sellerId, onOpenChat }
) {
  
    if (!store) return null;

    const { sellerInformationDto } = store;
    const { width: screenWidth } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState('menu');
    const [tabLayouts, setTabLayouts] = useState({});
    const underlineLeft = useRef(new Animated.Value(0)).current;
    const underlineWidth = useRef(new Animated.Value(0)).current;

    const tabs = [
        { key: 'menu', label: '메뉴', content: <StoreMenu /> },
        {
            key: 'info',
            label: '정보',
            content: (
                <StoreMainInfo
                    address={sellerInformationDto?.postCode || '가게 주소 없음'}
                    addressDetail={sellerInformationDto?.address || '가게 상세 주소 없음'}
                    phone={sellerInformationDto?.phone || '연락처 없음'}
                    operatingHours={sellerInformationDto?.operatingHours || '운영 시간 정보 없음'}
                    storeDescription={sellerInformationDto?.storeDescription || '설명 없음'}
                />
            ),
        },
        {
            key: 'review',
            label: '리뷰',
            content: (
                <View>
                    <StoreReview />
                </View>
            ),
        },
    ];

    const handleLayout = (key, event) => {
        const { x, width } = event.nativeEvent.layout;
        setTabLayouts((prev) => {
        const next = { ...prev, [key]: { x, width } };
        if (key === activeTab) {
            underlineLeft.setValue(x);
            underlineWidth.setValue(width);
        }
        return next;
        });
    };

    const handleTabPress = (key) => {
        setActiveTab(key);
        const layout = tabLayouts[key];
        if (layout) {
        Animated.timing(underlineLeft, {
            toValue: layout.x,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(underlineWidth, {
            toValue: layout.width,
            duration: 200,
            useNativeDriver: false,
        }).start();
        }
    };

    return (
        <View style={styles.storeHead}>
            <View style={styles.storeHead_Top}>
                <View style={styles.storeHead_left}>
                    <Text style={styles.storeTitle}>
                        {sellerInformationDto?.storeName || '상호 없음'}
                    </Text>
                    <StoreMiniInfo
                        rating={sellerInformationDto?.rating || '0.0'}
                        address={sellerInformationDto?.postCode || '가게 주소 없음'}
                        addressDetail={sellerInformationDto?.address || '가게 상세 주소 없음'}
                        phone={sellerInformationDto?.phone || '전화번호 없음'}
                        minOrderAmount={sellerInformationDto?.minOrderAmount || '배달 없음'}
                        deliveryFees={
                        (sellerInformationDto?.deliveryFeeDtos || [])
                            .filter((fee) => fee.deleted === false)
                            .sort((a, b) => a.ordersMoney - b.ordersMoney)
                        }

                        // 리뷰 태그로 이동
                        onGoToReviewTab={() => handleTabPress('review')}
                    />
                </View>
                    <View style={styles.storeHead_right}>
                        <Inquiry sellerId={sellerId} onOpenChat={onOpenChat} />
                        <FavoriteButtonBox sellerId={sellerId} />
                        {/* <FavoriteButtonBox />
                        <Inquiry /> */}
                    </View>
            </View>

            {/* 탭 영역 */}
            <View style={styles.storeHead_bottom}>
                <View style={styles.tabUI}>
                {tabs.map(({ key, label }) => (
                    <TouchableOpacity
                    key={key}
                    onLayout={(e) => handleLayout(key, e)}
                    onPress={() => handleTabPress(key)}
                    style={styles.storeTabItem}
                    >
                        <Text
                            style={[
                            styles.tabText,
                            activeTab === key && styles.activeTabText,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
                <Animated.View
                    style={[
                    styles.underline,
                    {
                        left: underlineLeft,
                        width: underlineWidth,
                    },
                    ]}
                />
                </View>

                {/* 탭 콘텐츠 */}
                <View style={styles.tabContent}>
                    {tabs.find((tab) => tab.key === activeTab)?.content}
                </View>
            </View>
        </View>
    );
}
