import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import api from "../api/api.js";

const getThumbnailUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
};

export default function useSellerProducts() {
  const route = useRoute();
  const { sellerId } = route.params || {}; // 👈 네비게이션으로 넘긴 파라미터에서 추출
  const [products, setProducts] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const fetchProducts = async () => {
      setError(null);
      try {
        const res = await api.get(`/api/products/seller/${sellerId}`);

        const transformed = res.data.map((product) => ({
          ...product,
          thumbnailUrl: getThumbnailUrl(product.photoUrl?.[0]),
        }));

        console.log("thumbnailUrl", transformed);

        setProducts(transformed);
      } catch (error) {

        console.error("제품 정보 요청 실패:", error);
        
        setError(error);
      }
    };

    fetchProducts();
  }, [sellerId]);

  return { products, error };
}
