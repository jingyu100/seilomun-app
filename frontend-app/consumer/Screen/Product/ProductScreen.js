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
import useProductInfo from '../../../Hook/useProductInfo.js';
import styles from './ProductStyle.js';
import Header from '../Header/Header.js';
import BottomTab from '../BottomTab/BottomTab.js';
import ProductHead from './productHeadCmp/ProductHead.js';
import ProductBody from './productBodyCmp/ProductBody.js';
import ProductBottom from './productBottomCmp/ProductBottom.js';

export default function ProductScreen() {

  const route = useRoute();

  const { product } = useProductInfo();

  const productImages = (product?.productPhotoUrl || []).map((url) =>
    url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
  );
  

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [productImages]);

  useEffect(() => {
    if (!Array.isArray(productImages) || productImages.length <= 1 || !isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [productImages, isAutoPlay]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const imageScale = scrollY.interpolate({
    inputRange: [-500, 0],
    outputRange: [8, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 0],
    outputRange: [0, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
        {/* <Header /> */}

        <Animated.Image
            source={
            Array.isArray(productImages) && productImages.length > 0
                ? { uri: productImages[currentImageIndex] }
                : require('../../../assets/noImage.jpg')
            }
            style={[
            styles.productImages,
            {
                transform: [
                { scale: imageScale },
                { translateY: imageTranslateY },
                ],
            },
            ]}
            resizeMode="cover"
        />

        {/* Product Head */}
        <Animated.ScrollView
            style={styles.productUI}
            onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
        >
            <View style={{ backgroundColor: '#fff' }}>
            <View style={styles.productMargin}>
                <ProductHead
                product={product}
                />
            </View>
            </View>
        </Animated.ScrollView>

        {/* Product Body */}
        {/* <View>
            <ProductBody />
        </View> */}

        {/* 바로구매, 장바구니 */}
        <ProductBottom />
            
    </SafeAreaView>
  );
}
