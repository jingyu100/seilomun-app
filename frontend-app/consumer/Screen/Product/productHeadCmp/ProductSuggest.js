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
  FlatList,
} from 'react-native';
import useSellerProducts from '../../../../Hook/useSellerProducts.js';
import styles from "../ProductStyle.js";
import SuggestProducts from './SuggestProducts.js';


export default function ProductSuggest({ product }) {

    const { products } = useSellerProducts();

    if (!products) return null;

    // // 같은 판매자의 다른 상품만 추천
    // const suggestList = products.filter(
    //     (p) => p.sellerId === product?.sellerId && p.id !== product?.id
    // );

    // 현재 상품 제외
    const filteredProducts = products.filter((p) => p.id !== product.id);

    // 배열을 랜덤으로 섞고 앞에서 6개만 자르기
    const suggestList = [...filteredProducts]
        .sort(() => Math.random() - 0.5) // 랜덤 정렬
        .slice(0, 6); // 앞에서 6개 선택

    if (suggestList.length === 0) {
        return (
        <View>
            <Text>추천할 상품이 없습니다.</Text>
        </View>
        );
    }

    return (
        <View>
            <View style={styles.prodSuggest}>
                <View style={styles.prodSuggest_inner}>
                    <Text style={styles.prodSuggest_title}>
                        <Text style={{
                            color: '#60db58',
                        }}>
                            또 다른 제품
                        </Text>
                        {"\u00A0"} {/* <-- 스페이스바 같은 띄워쓰기 하는 법 */}
                        <Text>
                            골라 담아 보세요
                        </Text>
                    </Text>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={suggestList}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        renderItem={({ item, index }) => (
                            <SuggestProducts
                                id={item.id}
                                index={index}
                                productId={item.id}
                                sellerId={item.sellerId}
                                thumbnailUrl={
                                item.productPhotoUrl?.[0]?.startsWith("http")
                                    ? item.productPhotoUrl[0]
                                    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${item.productPhotoUrl[0]}`
                                }
                                name={item.name}
                                date={item.expiryDate}
                                expiryDate={item.expiryDate}
                                description={item.description}
                                originalPrice={item.originalPrice}
                                maxDiscountRate={item.maxDiscountRate}
                                minDiscountRate={item.minDiscountRate}
                                discountPrice={item.discountPrice}
                                currentDiscountRate={item.currentDiscountRate || "현재 할인"}
                            />
                        )}
                    />
                </View>
            </View>
        </View>
    )
}