import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SellerBottomTab from "./BottomTab/SellerBottomTab";

// Mock data for the bar chart
const salesData = [
    { month: "3월", amount: 85 },
    { month: "4월", amount: 112 },
    { month: "5월", amount: 98 },
    { month: "6월", amount: 135 },
    { month: "7월", amount: 121 },
];
const maxAmount = Math.max(...salesData.map(d => d.amount));


export default function SellerMainScreen({ route, navigation }) {
    const storeName =
        route?.params?.storeName || route?.params?.sellerName || "매장 이름";

    const onPressMenu = (key) => {
        switch (key) {
            case "store":
                Alert.alert("가게관리", "준비 중입니다.");
                break;
            case "product":
                Alert.alert("상품관리", "준비 중입니다.");
                break;
            case "review":
                Alert.alert("리뷰관리", "준비 중입니다.");
                break;
            case "event":
                Alert.alert("이벤트관리", "준비 중입니다.");
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{storeName}</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* 전체 메뉴 카드 */}
                <View style={styles.card}>
                    <Text style={[styles.cardTitle, { marginBottom: 16 }]}>전체 메뉴</Text>
                    <View style={styles.menuRow}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => onPressMenu("store")}>
                            <MaterialCommunityIcons name="storefront-outline" size={28} color="#333" />
                            <Text style={styles.menuLabel}>가게관리</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => onPressMenu("product")}>
                            <Ionicons name="pricetag-outline" size={28} color="#333" />
                            <Text style={styles.menuLabel}>상품관리</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => onPressMenu("review")}>
                            <Ionicons name="star-outline" size={28} color="#333" />
                            <Text style={styles.menuLabel}>리뷰관리</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => onPressMenu("event")}>
                            <Ionicons name="gift-outline" size={28} color="#333" />
                            <Text style={styles.menuLabel}>이벤트관리</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 월간 매출 카드 */}
                <View style={styles.card}>
                    <View style={styles.salesHeader}>
                        <Text style={styles.cardTitle}>월간 매출</Text>
                        <TouchableOpacity onPress={() => Alert.alert("매출 상세", "준비 중입니다.")}>
                            <Text style={styles.detailsLink}>자세히 보기 ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.salesBody}>
                        <Text style={styles.totalSalesText}>이번 달 총 매출 (7월)</Text>
                        <Text style={styles.totalSalesValue}>1,210,000원</Text>
                        <View style={styles.chartWrapper}>
                            <View style={styles.chartContainer}>
                                {salesData.map((item, index) => {
                                    const barHeight = (item.amount / maxAmount) * 100;
                                    return (
                                        <View key={index} style={styles.barContainer}>
                                            <View style={[styles.bar, { height: `${barHeight}%` }]} />
                                            <Text style={styles.barLabel}>{item.month}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Tab */}
            <SellerBottomTab />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f7f7f7" },
    header: {
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111",
    },

    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },

    card: {
        borderWidth: 1,
        borderColor: "#f0f0f0",
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222"
    },

    menuRow: { flexDirection: "row", justifyContent: "space-around", paddingTop: 12 },
    menuItem: { alignItems: "center" },
    menuLabel: { fontSize: 13, color: "#333", marginTop: 8 },

    salesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailsLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    salesBody: {
        alignItems: 'flex-start',
        marginTop: 20,
        width: '100%',
    },
    totalSalesText: {
        fontSize: 15,
        color: '#555',
    },
    totalSalesValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111',
        marginVertical: 8,
    },
    chartWrapper: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        paddingBottom: 8,
        marginTop: 16,
        width: '100%',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 150,
        width: '100%',
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    bar: {
        width: '80%',
        maxWidth: 30,
        backgroundColor: '#27ae60',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
        color: '#555',
    },
});

