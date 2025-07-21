import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import styles from '../../StoreStyle.js';

export default function StoreMiniInfo({ 
    // rating, 
    // address, 
    // addressDetail, 
    // phone, 
    // minOrderAmount, 
    // deliveryFee,
    onGoToReviewTab,
}) {

    // const validDeliveryFees = (deliveryFees || [])
    //     .filter((fee) => fee.deleted === false)
    //     .sort((a, b) => a.ordersMoney - b.ordersMoney);

    // const ratingLength= 

  return (
    <View>
        <TouchableOpacity
            style={styles.ratingBtn}
            onPress={() => navigation.navigate('CustomerLogin')}
        >
            <Image
                style={styles.ratingImg} 
                source={require('../../../../../assets/starIcon.png')} 
            />
            <Text style={styles.ratingTxt}>
                {/* {rating} */}
                4.7(492)
            </Text>
        </TouchableOpacity>
        <Text style={styles.address}>
            {/* {address}, {addressDetail} */}
            대구광역시 북구 복현로 35, 3층 본관 300호
        </Text>
        <View>
        <Text>배달 주문 금액</Text>
                {/* {validDeliveryFees.length > 0 ? (
                    validDeliveryFees.map((fee, idx) => (
                        <View key={idx} style={styles.deliveryTip}>
                            <Text>{fee.ordersMoney.toLocaleString()}원 이상 </Text>
                            <Text>{fee.deliveryTip.toLocaleString()}원</Text>
                        </View>
                    ))
                    ) : (
                    <Text>배달 없음</Text>
                )} */}
                <View style={styles.deliveryTip}>
                    <Text>14,000원 이상  </Text>
                    <Text>1,000원</Text>
                </View>
        </View>
    </View>
  )
}
