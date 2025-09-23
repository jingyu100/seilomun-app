import React, { useRef, useState, useEffect, } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Alert,
    TextInput,
    Modal,
} from 'react-native';
import Postcode from "react-native-daum-postcode";
import DlvAddress from './DlvAddress.js';
import OrderItemsSection from '../OrderItemsSection.js';
import PayInfoSection from '../PayInfoSection.js';

export default function Delivery({
  deliveryInfo, setDeliveryInfo
}) {

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View>
        {/* 배송지 */}
        <View style={styles.dlvContent}>
          <View style={styles.dlvMargin}>
            {/* <DlvAddress
              deliveryInfo={deliveryInfo}
              setDeliveryInfo={setDeliveryInfo}
            /> */}
            {/* 배송지 */}
            <Text style={styles.dlvHeadLine}>배송지</Text>

            <View style= {styles.dlvAddress}>
              {/* 주소 선택 영역 */}
              <View style={styles.addressSelector}>
                <Text style={styles.addressLabel}>
                  주소 <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.addressSearchBtn}
                  onPress={() => setIsPostcodeOpen(true)}
                >
                  <Text style={styles.addressSearchText}>주소 검색</Text>
                </TouchableOpacity>
              </View>

              {/* 주소 입력 필드 */}
              <TextInput
                style={styles.input}
                placeholder="기본주소를 입력하세요"
                value={deliveryInfo.mainAddress}
                onChangeText={(text) => handleInputChange('mainAddress', text)}
                editable={false} // 주소 검색으로만 입력
              />
              <TextInput
                style={styles.input}
                placeholder="상세주소를 입력하세요 (동, 호수 등)"
                value={deliveryInfo.detailAddress}
                onChangeText={(text) => handleInputChange('detailAddress', text)}
              />
              {deliveryInfo.postCode ? (
                <Text style={styles.postCode}>우편번호: {deliveryInfo.postCode}</Text>
              ) : null}

              {/* 휴대전화 입력 영역 */}
              <Text style={styles.addressLabel}>
                휴대전화 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.phoneRow}>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="010"
                  maxLength={3}
                  keyboardType="numeric"
                  value={deliveryInfo.phoneFirst}
                  onChangeText={(text) => handleInputChange("phoneFirst", text)}
                />
                <Text>-</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="1234"
                  maxLength={4}
                  keyboardType="numeric"
                  value={deliveryInfo.phoneMiddle}
                  onChangeText={(text) => handleInputChange("phoneMiddle", text)}
                />
                <Text>-</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="5678"
                  maxLength={4}
                  keyboardType="numeric"
                  value={deliveryInfo.phoneLast}
                  onChangeText={(text) => handleInputChange("phoneLast", text)}
                />
              </View>

              {/* 요청사항 */}
              <TextInput
                style={styles.textArea}
                placeholder="배송 시 요청사항을 입력해주세요"
                value={deliveryInfo.deliveryRequest}
                onChangeText={(text) => handleInputChange("deliveryRequest", text)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* 체크박스 */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  handleInputChange("saveAsDefault", !deliveryInfo.saveAsDefault)
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    deliveryInfo.saveAsDefault && styles.checkedBox,
                  ]}
                />
                <Text style={styles.checkboxLabel}>기본 배송지로 저장</Text>
              </TouchableOpacity>
            </View>

            {/* 주소검색 모달 */}
            <Modal visible={isPostcodeOpen} animationType="slide">
              <Postcode
                style={{ flex: 1, marginTop: 50, }}
                jsOptions={{ animation: true }}
                onSelected={(data) => {
                  setDeliveryInfo((prev) => ({
                    ...prev,
                    mainAddress: data.address,
                    postCode: data.zonecode,
                  }));
                  setIsPostcodeOpen(false);
                }}
              />
              <TouchableOpacity
                style={styles.addressSearchBtn}
                onPress={() => setIsPostcodeOpen(false)}
              >
                <Text style={styles.addressSearchText}>닫기</Text>
              </TouchableOpacity>
            </Modal>

          </View>
        </View>

        {/* 주문 상품 */}
        {/* <View style={styles.dlvContent}>
          <View style={styles.dlvMargin}>
            <OrderItemsSection products={products} deliveryFee={deliveryFee} />
          </View>
        </View> */}

        {/* 결제 정보 */}
        {/* <View style={styles.dlvContent}>
          <View style={styles.dlvMargin}>
            <PayInfoSection
              totalProductPrice={totalProductPrice}
              deliveryFee={deliveryFee}
              seller={seller}
              isPickup={false} // Delivery니까 픽업 아님
              pointsToUse={pointsToUse}
              setPointsToUse={setPointsToUse}
              finalAmount={finalAmount}
            />
          </View>
        </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  dlvContent: {
    backgroundColor: '#fff',
  },
  dlvMargin: {
    marginHorizontal: 15,
    marginVertical: 19,
  },

    // 주소 부분
    dlvHeadLine: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
    dlvAddress: {
      flexDirection: 'column',
      position: 'relative',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderWidth: 0.5,
      borderRadius: 8,
      borderColor: '#ccc',
      backgroundColor: '#f0f0f0',
    },
    addressSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    addressLabel: { fontSize: 14, marginBottom: 6 },
    required: { color: "red" },
    addressSearchBtn: { backgroundColor: "#fff", padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0', },
    addressSearchText: { fontSize: 12, color: "#333", },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, fontSize: 14, marginBottom: 8, backgroundColor: "#fff" },
    postCode: { fontSize: 12, color: "#666", marginBottom: 12 },
    phoneRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    phoneInput: { flex: 1, textAlign: "center" },
    textArea: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, fontSize: 14, height: 80, backgroundColor: "#fff", marginBottom: 12 },
    checkboxRow: { flexDirection: "row", alignItems: "center", },
    checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: "#ccc", marginRight: 5, borderRadius: 3, backgroundColor: '#fff', },
    checkedBox: { backgroundColor: "#00c266" },
    checkboxLabel: { fontSize: 13 },

});
