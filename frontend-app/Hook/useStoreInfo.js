import { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import api from "../api/api.js";
import { Alert } from "react-native";

export default function useStoreInfo() {
  const route = useRoute();
  const navigation = useNavigation();
  const sellerId = route.params?.sellerId;
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!sellerId) {
      console.warn("sellerId 없음");
      return;
    }

    const storeInfo = async () => {
      try {
        const response = await api.get(`/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);
        console.log("API 호출 시도, sellerId:", sellerId);

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

        // 기본 이미지 (local)
        if (sellerPhotoUrls.length === 0) {
          sellerPhotoUrls = ["local"]; // 나중에 분기처리용
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
        Alert.alert("오류", "판매자 정보를 불러오는 데 실패했습니다.");
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace("NotFoundScreen");
        }
      }
    };

    storeInfo();
  }, [sellerId]);

  return { store, sellerId };
}
