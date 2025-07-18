import { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import api, { API_BASE_URL } from "../api/config";

export default function useStoreInfo() {
  const route = useRoute();
  const navigation = useNavigation();
  const sellerId = route.params?.sellerId;
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const storeInfo = async () => {
      try {
        const response = await api.get(`/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);

        const sellerInformationDto = response.data.data.seller;

        if (!sellerInformationDto) {
          console.warn("판매자 정보 없음");
          return;
        }

        // 이미지 URL 처리
        let sellerPhotoUrls = [];

        if (
          Array.isArray(sellerInformationDto.sellerPhotos) &&
          sellerInformationDto.sellerPhotos.length > 0
        ) {
          const filteredPhotos = sellerInformationDto.sellerPhotos.filter(
            (photo) => photo.photoUrl && !photo.photoUrl.endsWith(".txt")
          );

          if (filteredPhotos.length > 0) {
            sellerPhotoUrls = filteredPhotos.map(
              (photo) =>
                `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${photo.photoUrl}`
            );
          }
        }

        // 기본 이미지 (URL 또는 require)
        if (sellerPhotoUrls.length === 0) {
          sellerPhotoUrls = [require('../assets/noImage.jpg')];;
        }

        setStore({
          sellerInformationDto: {
            ...sellerInformationDto,
            sellerPhotoUrls,
          },
          sellerPhotoDto: null,
          sellerRegisterDto: null,
        });
      } catch (error) {
        console.error("API 요청 실패:", error);
        navigation.replace("NotFoundScreen");
      }
    };

    storeInfo();
  }, [sellerId]);

  return { store, sellerId };
}
