import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../api/config";

export default function useStoreInfo() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const storeInfo = async () => {
      try {
        const response = await api.get(`/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);

        const sellerInformationDto = response.data.data.seller;
        console.log(sellerInformationDto);
        if (!sellerInformationDto) {
          navigate("/404", { replace: true });
          return;
        }

        //이미지 URL 생성
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

        // sellerPhotoUrls가 여전히 비어 있으면 기본 이미지 적용
        if (sellerPhotoUrls.length === 0) {
          sellerPhotoUrls = ["/image/product1.jpg"];
        }

        // 최종 setStore
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
        navigate("/404", { replace: true });
      }
    };

    storeInfo();
  }, [sellerId, navigate]);

  return { store, sellerId };

  // const { sellerRegisterDto, sellerInformationDto, sellerPhotoDto } = store;
}
