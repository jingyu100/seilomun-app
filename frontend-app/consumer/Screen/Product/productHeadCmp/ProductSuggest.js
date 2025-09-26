import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import useSellerProducts from '../../../../Hook/useSellerProducts.js';
import styles from "../ProductStyle.js";
import SuggestProducts from './SuggestProducts.js';

export default function ProductSuggest({ product }) {
  const { products } = useSellerProducts();

  // products 배열이나 product 자체가 없으면 렌더링하지 않음
  if (!products || !Array.isArray(products) || !product) return null;

  // 현재 상품 제외 + null 제거
  const filteredProducts = products.filter(
    (p) => p && p.id && p.id !== product.id
  );

  // 랜덤으로 섞고 앞 6개 선택
  const suggestList = [...filteredProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

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
            <Text style={{ color: '#60db58' }}>또 다른 제품</Text>
            {"\u00A0"}
            <Text>골라 담아 보세요</Text>
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
                    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${item.productPhotoUrl?.[0]}`
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
  );
}
