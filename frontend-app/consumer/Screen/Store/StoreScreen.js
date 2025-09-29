import React, { useRef } from 'react';
import { View, Animated, Image, ScrollView, SafeAreaView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import useStoreInfo from "../../../Hook/useStoreInfo.js";
import styles from './StoreStyle.js';
import BottomTab from '../BottomTab/BottomTab.js';
import StoreHead from "./StoreComponents/StoreHead.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext";
import useLogin from "../../../Hook/useLogin";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StoreScreen() {

    const { store, sellerId } = useStoreInfo();
    const navigation = useNavigation();
    const { user, isLoggedIn } = useLogin();
    const { chatRooms } = useChatRooms();
    const insets = useSafeAreaInsets();


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

    const handleOpenChat = () => {
        if (!isLoggedIn) {
            Alert.alert("로그인 필요", "채팅을 시작하려면 로그인이 필요합니다.", [
                { text: "취소", style: "cancel" },
                { text: "로그인", onPress: () => navigation.navigate("CustomerLogin") }
            ]);
            return;
        }

        if (user?.userType === 'SELLER' && user?.id === sellerId) {
            Alert.alert("안내", "자신과는 채팅할 수 없습니다.");
            return;
        }

        const existingRoom = chatRooms.find(room => String(room.sellerId) === String(sellerId));

        if (existingRoom) {
            navigation.navigate("CustomerChatting", {
                chatRoomId: existingRoom.chatRoomId,
                sellerId: existingRoom.sellerId,
                sellerStoreName: existingRoom.sellerStoreName,
            });
        } else {
            navigation.navigate("CustomerChatting", {
                sellerId: sellerId,
                sellerStoreName: sellerInformationDto?.storeName || '상점',
            });
        }
    };

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('Main');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
                showsVerticalScrollIndicator={false}
            >
                <View style={{ backgroundColor: '#fff', minHeight: '100%' }}>
                    <View style={styles.storeMargin}>
                        <StoreHead
                            store={store}
                            sellerId={sellerId}
                            onOpenChat={handleOpenChat}
                        />
                        <View>
                            {/* 여기에 리뷰, 기타 내용이 추가되면 다 보여짐 */}
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* 투명 헤더와 아이콘 */}
            <View style={[headerStyles.header, { paddingTop: insets.top, paddingBottom: 10 }]}>
                <TouchableOpacity onPress={handleGoBack} style={headerStyles.iconContainer}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={headerStyles.rightIcons}>
                    <TouchableOpacity style={headerStyles.iconContainer}>
                        <Ionicons name="notifications-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={headerStyles.iconContainer}>
                        <Ionicons name="cart-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <BottomTab />
        </SafeAreaView>
    )
}

const headerStyles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    iconContainer: {
        padding: 5,
    },
    rightIcons: {
        flexDirection: 'row',
    }
});