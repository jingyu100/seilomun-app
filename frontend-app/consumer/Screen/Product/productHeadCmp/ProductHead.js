import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import useProductInfo from "../../../../Hook/useProductInfo.js";
import styles from "../ProductStyle.js";
import ProductHeadTitle from "./ProductHeadTitle.js";

export default function ProductHead() {
  
    const route = useRoute();

    const { productId } = route.params;
    const { product } = useProductInfo();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (product?.productPhotoUrl) {
        const processedImages = product.productPhotoUrl.map((url) =>
            url.startsWith("http")
            ? url
            : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
        );
        setImages(processedImages);
        setCurrentImageIndex(0);
        } else {
        setImages([]);
        }
    }, [product]);

    if (!product) return <Text>상품 정보를 불러올 수 없습니다.</Text>;

    return (
        <View style={styles.prodHead}>
            <View style={styles.PHLeft}>
            </View>

            <View style={styles.right}>
                <ProductHeadTitle
                    productId={product.id}
                    productPhotoUrl={product.productPhotoUrl?.[0] || ""}
                    name={product.name || "제품명 없음"}
                    expiryDate={product.expiryDate || "유통기한 없음"}
                    description={product.description || "제품 설명 없음"}
                    originalPrice={product.originalPrice || 0}
                    maxDiscountRate={product.maxDiscountRate || 0}
                    minDiscountRate={product.minDiscountRate || 0}
                    currentDiscountRate={product.currentDiscountRate || 0}
                    discountPrice={product.discountPrice || 0}
                    stockQuantity={product.stockQuantity || 0}
                />
            </View>
            
        </View>
    );
}


// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     padding: 16,
//   },
//   left: {
//     flex: 1,
//     marginRight: 12,
//   },
//   imageContainer: {
//     position: "relative",
//     width: "100%",
//     height: 280,
//     borderRadius: 8,
//     overflow: "hidden",
//     backgroundColor: "#eee",
//   },
//   mainImage: {
//     width: "100%",
//     height: "100%",
//   },
//   counter: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   arrow: {
//     fontSize: 30,
//     color: "#fff",
//   },
//   prevBtn: {
//     position: "absolute",
//     left: 10,
//     top: "45%",
//     zIndex: 10,
//   },
//   nextBtn: {
//     position: "absolute",
//     right: 10,
//     top: "45%",
//     zIndex: 10,
//   },
//   thumbnailRow: {
//     marginTop: 10,
//     flexDirection: "row",
//   },
//   thumbnailWrapper: {
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     padding: 2,
//   },
//   activeThumbnail: {
//     borderColor: "blue",
//   },
//   thumbnail: {
//     width: 60,
//     height: 60,
//     borderRadius: 4,
//   },
//   right: {
//     flex: 1.2,
//   },
// });
