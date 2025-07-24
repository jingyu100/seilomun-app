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
} from 'react-native';
import useProductInfo from "../../../../Hook/useProductInfo.js";
import styles from "../ProductStyle.js";

export default function ProductBody() {

    const parsedOriginalPrice = parseInt(originalPrice) || 0;
    const parsedDisPrice = parseInt(discountPrice) || 0;
    const discountRate = parseInt(currentDiscountRate) || 0;

    const totalPrice = parsedDisPrice * quantity;

    const [quantity, setQuantity] = useState(1);
    
    return (
        <View style={styles.quantityRow}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{quantity}</Text>

            <TouchableOpacity onPress={increaseQuantity} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}