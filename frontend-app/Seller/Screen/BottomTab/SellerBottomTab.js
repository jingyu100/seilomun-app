import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Item = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        {icon}
        <Text style={styles.label} allowFontScaling={false}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function SellerBottomTab({ fixed = false }) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleChatPress = () => {
        // Navigate to the chat room list
        navigation.navigate("ChatRoomList");
    };

    return (
        <View style={[
            styles.wrap,
            { paddingBottom: insets.bottom || 8 },
            fixed ? styles.fixed : null
        ]}>
            <Item
                icon={<Ionicons name="home-outline" size={26} color="#222" />}
                label="홈"
                onPress={() => navigation.navigate("SellerMain")}
            />
            <Item
                icon={<Ionicons name="pricetag-outline" size={26} color="#222" />}
                label="상품관리"
                onPress={() => { /* navigation.navigate("SellerProductManage") */ }}
            />
            {/* Added Chat Tab */}
            <Item
                icon={<Ionicons name="chatbubble-outline" size={26} color="#222" />}
                label="채팅"
                onPress={handleChatPress}
            />
            <Item
                icon={<Ionicons name="notifications-outline" size={26} color="#222" />}
                label="알림"
                onPress={() => { /* navigation.navigate("SellerAlert") */ }}
            />
            <Item
                icon={<MaterialCommunityIcons name="storefront-outline" size={26} color="#222" />}
                label="매장 관리"
                onPress={() => { /* navigation.navigate("SellerStoreManage") */ }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        // Android shadow
        elevation: 6,
        // iOS shadow
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 8,
    },
    item: {
        flex: 1, // This ensures each item takes up equal space
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
    },
    label: {
        marginTop: 4,
        fontSize: 11,
        color: "#222"
    },
    fixed: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    }
});

