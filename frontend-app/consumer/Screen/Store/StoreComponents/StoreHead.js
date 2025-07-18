import { View, Text, TouchableOpacity } from "react-native";

export default function StoreHead({ store, sellerId, onOpenChat }) {
    
    if (!store) return null;

    const { sellerInformationDto } = store;

    // 상품, 매장 정보, 리뷰 탭 부분
    const [activeTab, setActiveTab] = useState("menu");

    const tabRefs = {
        menu: useRef(null),
        info: useRef(null),
        review: useRef(null),
      };
    
      const underlineRef = useRef(null);
    
      useEffect(() => {
        const updateUnderline = () => {
          const current = tabRefs[activeTab]?.current;
          const underline = underlineRef.current;
    
          if (current && underline) {
            underline.style.left = `${current.offsetLeft}px`;
            underline.style.width = `${current.offsetWidth}px`;
          }
        };
    
        updateUnderline();
        window.addEventListener("resize", updateUnderline);
    
        return () => {
          window.removeEventListener("resize", updateUnderline);
        };
      }, [activeTab]);
    
      const tabs = [
        { key: "menu", label: "메뉴", content: <StoreMenu /> },
        {
          key: "info",
          label: "정보",
          content: (
            <StoreMainInfo
              address={sellerInformationDto?.postCode || "가게 주소 없음"}
              addressDetail={sellerInformationDto?.address || "가게 상세 주소 없음"}
              phone={sellerInformationDto?.phone || "연락처 없음"}
              operatingHours={sellerInformationDto?.operatingHours || "운영 시간 정보 없음"}
              storeDescription={sellerInformationDto?.storeDescription || "설명 없음"}
            />
          ),
        },
        {
          key: "review",
          label: "리뷰",
          content: (
            <div>
              <StoreReview />
            </div>
          ),
        },
      ];

    return (
        <View style={styles.storeHead}>
            <View style={styles.storeHead_Top}>
                <View style={styles.storeHead_left}>
                    <Text style={styles.storeTitle}>
                        {sellerInformationDto?.storeName || "상호 없음"}
                    </Text>
                    <StoreMiniInfo
                        rating= {sellerInformationDto?.rating || "0.0"}
                        address={sellerInformationDto?.postCode || "가게 주소 없음"}
                        addressDetail={sellerInformationDto?.address || "가게 상세 주소 없음"}
                        phone={sellerInformationDto?.phone || "전화번호 없음"}
                        minOrderAmount={sellerInformationDto?.minOrderAmount || "배달 없음"}
                        deliveryFees={
                            (sellerInformationDto?.deliveryFeeDtos || [])
                            .filter(fee => fee.deleted === false)
                            .sort((a, b) => a.ordersMoney - b.ordersMoney)
                        }
                    />
                </View>
                <View style={styles.storeHead_right}>
                    {/* <Inquiry sellerId={sellerId} onOpenChat={onOpenChat} />
                    <FavoriteButtonBox sellerId={sellerId} /> */}
                </View>
            </View>

            <View style={styles.storeHead_bottom}>
                <View ref={underlineRef} style={styles.underline} />
                    {tabs.map(({ key, label }) => (
                        <TouchableOpacity
                            key={key}
                            ref={tabRefs[key]}
                            style={[
                                styles.storeTabItem,
                                activeTab === key && styles.activeTabItem,
                            ]}
                            onPress={() => setActiveTab(key)}
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    ))}

                <View>{tabs.find((tab) => tab.key === activeTab)?.content}</View>
            </View>
        </View>
    )
}