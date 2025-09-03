import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { useCart } from "../../Context/CartContext"; // 네이티브용 별도 구현 필요
import useStoreInfo from "../../../../Hook/useStoreInfo.js";
// import LikeButtonBox from "./LikeButtonBox"; // 네이티브용 별도 구현 필요
import styles from "../ProductStyle.js";

export default function ProductHeadTitle({
    productId,
    productPhotoUrl,
    name,
    expiryDate,
    description,
    originalPrice,
    discountPrice,
    currentDiscountRate,
    stockQuantity,
}) {

    const { store, sellerId } = useStoreInfo();

    const sellerInformationDto = store?.sellerInformationDto;
    const storeImages = sellerInformationDto?.sellerPhotoUrls;
    const storeAddress= sellerInformationDto?.postCode || '가게 주소 없음';
    const storeAddressDetail= sellerInformationDto?.address || '가게 상세 주소 없음';
    
    const navigation = useNavigation();
    // const { addToCart } = useCart();

    const parsedOriginalPrice = parseInt(originalPrice) || 0;
    const parsedDisPrice = parseInt(discountPrice) || 0;
    const discountRate = parseInt(currentDiscountRate) || 0;

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
          if (quantity >= stockQuantity) {
          Alert.alert("최대 수량입니다.");
          return;
        }
        setQuantity(q => q + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(q => (q > 1 ? q - 1 : 1));
    };


  return (
    <View style={styles.prodHeadDtl}>
        <View style={styles.prodHdDtl_Head}>
            <Image 
                source={
                    storeImages && storeImages.length > 0
                    ? { uri: storeImages[0] }
                    : require('../../../../assets/noImage.jpg')
                }
                style={ styles.storeImage }
            />
            <View style={styles.prodHdDtlHd_Bottom}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.address}>
                    {storeAddress}, {storeAddressDetail}
                </Text>
            </View>
        </View>

      
      <Text style={styles.description} numberOfLines={1} >{description}</Text>
      
      <Text style={styles.stock}>
        {stockQuantity > 0 ? `남은 수량: ${stockQuantity}` : "품절"}
      </Text>

      <View style={{
        flexDirection: 'row',
      }}>
        <View style={styles.priceBox}>
            <Text style={styles.discountedPrice}>
            {parsedDisPrice.toLocaleString()}원
            </Text>
        </View>

        <View style={styles.priceBox}>
            <Text style={styles.originalPrice}>
            {parsedOriginalPrice.toLocaleString()}원
            </Text>
        </View>

        <View style={styles.discountBox}>
            <Text style={styles.discountRate}>{discountRate}%</Text>
        </View>
      </View>

      <Text style={styles.expiry}>{expiryDate}까지</Text>

    </View>
  );
}
