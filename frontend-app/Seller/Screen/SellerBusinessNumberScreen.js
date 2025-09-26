import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../Style/SellerBusinessNumberStyle';

export default function SellerBusinessNumberScreen() {
  const navigation = useNavigation();

  const [businessNumber, setBusinessNumber] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [openDate, setOpenDate] = useState(''); // 개업일자 직접 입력

  const onVerify = () => {
    if (businessNumber.length !== 10) return alert('사업자번호 10자리를 입력해주세요.');
    if (!representativeName.trim()) return alert('대표자 성명을 입력해주세요.');
    if (!openDate.trim()) return alert('개업일자를 입력해주세요. (예: 2025-01-01)');
    // TODO: 인증 API 연결 or 다음 단계 이동
    alert('검증 로직 연결 지점입니다.');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          {/* 사업자 등록번호 */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>사업자 등록번호</Text>
            <Text style={styles.labelAsterisk}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="번호만 입력"
            placeholderTextColor="#9AA0A6"
            value={businessNumber}
            onChangeText={(t) => setBusinessNumber(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={10}
          />

          {/* 대표자 성명 */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>대표자 성명</Text>
            <Text style={styles.labelAsterisk}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="성명 입력"
            placeholderTextColor="#9AA0A6"
            value={representativeName}
            onChangeText={setRepresentativeName}
            returnKeyType="done"
          />

          {/* 개업일자 */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>개업일자</Text>
            <Text style={styles.labelAsterisk}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD 형식으로 입력"
            placeholderTextColor="#9AA0A6"
            value={openDate}
            onChangeText={setOpenDate}
          />

          {/* 버튼 */}
          <TouchableOpacity style={styles.outlineButton} onPress={onVerify}>
            <Text style={styles.outlineButtonText}>사업자 번호 인증</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
