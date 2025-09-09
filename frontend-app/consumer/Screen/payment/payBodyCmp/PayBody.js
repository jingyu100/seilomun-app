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
import TakeOut from './takeoutCmp/TakeOut';
import Delivery from './deliveryCmp/Delivery';


export default function PayBody() {

    const [activeTab, setActiveTab] = useState('menu');
    const [tabLayouts, setTabLayouts] = useState({});
    const underlineLeft = useRef(new Animated.Value(0)).current;
    const underlineWidth = useRef(new Animated.Value(0)).current;

    const tabs = [
        { 
            key: 'delivery', 
            label: '배달', 
            content:  
                <Delivery
            
                />
        },
        {
            key: 'take out',
            label: '포장',
            content: (
                <TakeOut

                />
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
        <View>
            

            
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
    )
}