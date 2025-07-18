import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useStoreInfo } from "../../../Hook/useStoreInfo.js";
import StoreHead from "/StoreComponents/StoreHead.js";

export default function StoreScreen() {
    const { store, sellerId } = useStoreInfo();

    const sellerInformationDto = store?.sellerInformationDto;
    const storeImages = sellerInformationDto?.sellerPhotoUrls;

    return (
        <View>
            <Image source={
                    storeImages
                    ? { uri: storeImages }
                    : require('../../image/noImage.jpg')
                 } 
                 style={styles.storeImage} />
            <View>
                <View style={styles.storeMargin}>
                    <StoreHead
                        testID='storeHead'
                        store={store}
                        sellerId={sellerId}
                        onOpenChat={handleOpenChat}  
                    />
                </View>
            </View>
            <View testID="storeBdoy">
                
            </View>
        </View>
    )
}