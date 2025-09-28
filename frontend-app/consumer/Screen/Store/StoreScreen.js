import React, { useRef } from 'react';
import { View, Text, Animated, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import useStoreInfo from "../../../Hook/useStoreInfo.js";
import styles from './StoreStyle.js';
import Header from '../Header/Header.js';
import BottomTab from '../BottomTab/BottomTab.js';
import StoreHead from "./StoreComponents/StoreHead.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext";
import useLogin from "../../../Hook/useLogin";

export default function StoreScreen() {

    const { store, sellerId } = useStoreInfo();
    const navigation = useNavigation();
    const { user, isLoggedIn } = useLogin();
    const { chatRooms } = useChatRooms();


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

        // 판매자와의 기존 채팅방 확인
        const existingRoom = chatRooms.find(room => String(room.sellerId) === String(sellerId));

        if (existingRoom) {
            // 기존 채팅방이 있으면 바로 이동
            navigation.navigate("CustomerChatting", {
                chatRoomId: existingRoom.chatRoomId,
                sellerId: existingRoom.sellerId,
                sellerStoreName: existingRoom.sellerStoreName,
            });
        } else {
            // 없으면, CustomerChatting 화면으로 이동하여 새로 생성
            navigation.navigate("CustomerChatting", {
                sellerId: sellerId,
                sellerStoreName: sellerInformationDto?.storeName || '상점',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
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
                            onOpenChat={handleOpenChat}
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
