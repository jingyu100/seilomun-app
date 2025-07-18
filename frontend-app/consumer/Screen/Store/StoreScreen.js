import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useStoreInfo from "../../../Hook/useStoreInfo.js";
import styles from './StoreStyle';
import StoreHead from "./StoreComponents/StoreHead.js";

export default function StoreScreen() {
    // const { store, sellerId } = useStoreInfo();

    // const sellerInformationDto = store?.sellerInformationDto;
    // const storeImages = sellerInformationDto?.sellerPhotoUrls;

    return (
        <View>
            {/* <Image 
                source={
                    storeImages && storeImages.length > 0
                        ? { uri: storeImages[0] }
                        : require('../../../assets/noImage.jpg')
                }
                 style={styles.storeImage}
                 resizeMode="cover" // object-fit: cover 대체용
            /> */}
            <Image 
                source={require('../../../assets/noImage.jpg')}
                style={styles.storeImage} 
                resizeMode="cover" // object-fit: cover 대체용
            />
                 
            <View>
                <View style={styles.storeMargin}>
                    <StoreHead
                        testID='storeHead'
                        // store={store}
                        // sellerId={sellerId}
                        // onOpenChat={handleOpenChat}  
                    />
                </View>
            </View>
            <View testID="storeBdoy">
                
            </View>
        </View>
    )
}