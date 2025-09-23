import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function DlvAddress({ deliveryInfo, setDeliveryInfo }) {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressSearch = () => {
    setShowAddressModal(true);
  };

  // WebView에서 주소 선택 후 message 받기
  const handleMessage = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ADDRESS_SELECTED') {
        const { address, postCode } = data.payload;
        setDeliveryInfo(prev => ({
          ...prev,
          mainAddress: address,
          postCode,
        }));
        setShowAddressModal(false);
      }
    } catch (e) {
      console.error('주소 선택 메시지 처리 실패', e);
    }
  };

  return (
    <View>
      <Text style={styles.dlvHeadLine}>배송지</Text>
      <View style={styles.dlvAddress}>

        {/* 상단 정보 */}
        <View style={styles.dlvAdHead}>
          <Text style={styles.userName}>성명</Text>
          <View>
            <Text style={styles.defaultAddress}>기본 배송지</Text>
          </View>
          <View style={styles.addressBtn}>
            <TouchableOpacity
              style={styles.addressSearchBtn}
              onPress={handleAddressSearch}
            >
              <Text>주소 검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 주소 영역 */}
        <View style={styles.addressArea}>
          <Text style={styles.address}>
            {deliveryInfo.mainAddress || '대구 복현동'}
          </Text>
          <Text style={styles.addressDetail}>
            {deliveryInfo.detailAddress || '85호'}
          </Text>
        </View>

        {/* 전화번호 */}
        <Text style={styles.phone}>
          {deliveryInfo.phoneFirst || '010'}-
          {deliveryInfo.phoneMiddle || '0000'}-
          {deliveryInfo.phoneLast || '0000'}
        </Text>

        {/* 요청사항 */}
        <View style={styles.requestArea}>
          <TextInput
            style={styles.requestInput}
            placeholder="배송 시 요청사항을 입력해주세요"
            value={deliveryInfo.deliveryRequest}
            onChangeText={text => handleInputChange('deliveryRequest', text)}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* 체크박스 */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() =>
            handleInputChange('saveAsDefault', !deliveryInfo.saveAsDefault)
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

      {/* 주소 검색 WebView 모달 */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            source={{ uri: 'https://postcode.example.com' }} // 실제 주소 검색 URL
            onMessage={handleMessage}
          />
        </SafeAreaView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  dlvHeadLine: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  dlvAddress: {
    flexDirection: 'column',
    position: 'relative',
    marginHorizontal: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  dlvAdHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 15, paddingRight: 5 },
  defaultAddress: { fontSize: 11, padding: 2, borderRadius: 3, color: '#7a7979', backgroundColor: '#fff' },
  addressBtn: { backgroundColor: '#f1f1f1', padding: 8, borderRadius: 4, alignSelf: 'flex-start' },
  addressSearchBtn: { fontSize: 12, color: '#333' },
  addressArea: { flexDirection: 'row', marginBottom: 8 },
  address: { fontSize: 14, color: '#616161', },
  addressDetail: { fontSize: 14, color: '#616161', },
  phone: { fontSize: 14, color: '#616161', marginBottom: 8 },
  requestArea: { marginBottom: 12 },
  requestInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, fontSize: 14, height: 80, backgroundColor: '#fff' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#ccc', marginRight: 5, borderRadius: 10 },
  checkedBox: { borderWidth: 0, backgroundColor: '#00c266' },
  checkboxLabel: { fontSize: 13 },
});
