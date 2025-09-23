import React, { useRef, useState } from 'react';
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

export default function StepTabs({ 
    activeTab, 
    onTabChange, 
    isDeliveryAvailable,
}) {
    
    const underlineLeft = useRef(new Animated.Value(0)).current;
    const underlineWidth = useRef(new Animated.Value(0)).current;
    const [tabLayouts, setTabLayouts] = useState({});

    const handleLayout = (key, event) => {
        const { x, width } = event.nativeEvent.layout;
        setTabLayouts(prev => {
            const next = { ...prev, [key]: { x, width } };
            if (key === activeTab) {
                underlineLeft.setValue(x);
                underlineWidth.setValue(width);
            }
            return next;
        });
    };

    const handleTabClick = (tab) => {
        if (!isDeliveryAvailable && tab === "delivery") {
            return;
        }
        if (onTabChange) {
            onTabChange(tab);
        }
        const layout = tabLayouts[tab];
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
        <View>
            {/* 탭 영역 */}
            <View style={styles.tabUI}>
                {/* 배송 탭 */}
                <TouchableOpacity 
                    style={styles.payTabItem} 
                    onPress={() => handleTabClick("delivery")}
                    disabled={!isDeliveryAvailable}
                    onLayout={(e) => handleLayout("delivery", e)}
                >
                    <Text
                        // 배달 불가 시 'delivery' 탭에 'disabled' 클래스를 추가합니다.
                        style={[
                            styles.tabText,
                            activeTab === "delivery" && styles.activeTabText,
                            !isDeliveryAvailable && styles.disabledTabText,
                        ]}
                    >
                        배송
                    </Text>
                </TouchableOpacity>

                {/* 포장 탭 */}
                <TouchableOpacity 
                    style={styles.payTabItem} 
                    onPress={() => handleTabClick("pickup")}
                    onLayout={(e) => handleLayout("pickup", e)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "pickup" && styles.activeTabText,
                        ]}
                    >
                        포장
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 밑줄 애니메이션 */}
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
    )
}

const styles = StyleSheet.create({
    payHead_bottom: {

    },
    tabUI: {
        flexDirection: 'row',
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    payTabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
        color: '#666',
    },
    activeTabText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        height: 2,
        backgroundColor: 'black',
    },
    tabContent: {
    //   paddingTop: 16,
      paddingBottom: 16,
    },
})