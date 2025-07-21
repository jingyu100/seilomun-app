import { View, Text, TouchableOpacity } from "react-native";

export default function StoreMiniInfo({ 
    rating, 
    address, 
    addressDetail, 
    phone, 
    minOrderAmount, 
    deliveryFees 
}) {

  const validDeliveryFees = (deliveryFees || [])
    .filter((fee) => fee.deleted === false)
    .sort((a, b) => a.ordersMoney - b.ordersMoney);

  return (
    <View>
        <TouchableOpacity
            style={styles.RatingBtn}
            onPress={() => navigation.navigate('CustomerLogin')}
        >
            <Image source={require('../../../../Image/starIcon.png')} />
            <Text>{rating}</Text>
        </TouchableOpacity>
        <Text>{address}, {addressDetail}</Text>
        <View>
            <Text>배달 주문 금액</Text>
            {validDeliveryFees.length > 0 ? (
                validDeliveryFees.map((fee, idx) => (
                    <View key={idx}>
                        <Text>{fee.ordersMoney.toLocaleString()}원 이상 </Text>
                        <Text>{fee.deliveryTip.toLocaleString()}원</Text>
                    </View>
                ))
                ) : (
                <Text>배달 없음</Text>
            )}
        </View>
    </View>
  )
}
