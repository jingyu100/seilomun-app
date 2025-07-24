import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../api/api.js"; 

export default function useProductInfo() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const productInfo = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        console.log("API 응답:", response.data);

        const productDto = response.data.data.Products;

        if (!productDto) {
          navigation.navigate("NotFound"); // 예외 처리
          return;
        }

        // 필요한 데이터 전처리
        const productPhotoUrls =
          productDto?.productPhotoUrl?.map((url) =>
            url.startsWith("http")
              ? url
              : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
          ) || [];

        setProduct({
          ...productDto,
          productPhotoUrl: productPhotoUrls,
        });

        console.log("✅ 상품 상태 설정 완료");
      } catch (error) {
        console.error("API 요청 실패:", error);
        navigation.navigate("NotFound");
      }
    };

    productInfo();
  }, [productId, navigation]);

  return { product };
}
