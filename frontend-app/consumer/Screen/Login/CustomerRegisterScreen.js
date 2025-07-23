import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../Style/Login/CustomerRegisterStyle';


export default function CustomerRegisterScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      {/* 아이디 */}
      <Text style={styles.label}>아이디*</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="이메일을 입력 해주세요" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>인증번호 전송</Text></TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="인증번호를 입력해주세요" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>인증번호 확인</Text></TouchableOpacity>
      </View>

      {/* 비밀번호 */}
      <Text style={styles.label}>패스워드*</Text>
      <TextInput style={styles.input} placeholder="숫자, 문자, 특수문자 포함 8자리 이상" secureTextEntry />
      <Text style={styles.note}>*패스워드는 영문+숫자+특수문자를 조합하여 8자 이상 입력해주세요</Text>

      {/* 비밀번호 확인 */}
      <TextInput style={styles.input} placeholder="숫자, 문자, 특수문자 포함 8자리 이상" secureTextEntry />

      {/* 닉네임 */}
      <Text style={styles.label}>닉네임*</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="닉네임 입력" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>중복확인</Text></TouchableOpacity>
      </View>
      <Text style={styles.note}>*게시글 작성시 사용할 닉네임을 입력해주세요</Text>

      {/* 이름 */}
      <Text style={styles.label}>이름*</Text>
      <TextInput style={styles.input} placeholder="이름 입력" />

      {/* 전화번호 */}
      <Text style={styles.label}>전화번호*</Text>
      <View style={styles.phoneRow}>
        <TextInput style={styles.phoneInput} maxLength={3} keyboardType="numeric" />
        <TextInput style={styles.phoneInput} maxLength={4} keyboardType="numeric" />
        <TextInput style={styles.phoneInput} maxLength={4} keyboardType="numeric" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>인증번호 발송</Text></TouchableOpacity>
      </View>

      {/* 인증번호 */}
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="인증번호를 입력해주세요" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>인증번호 확인</Text></TouchableOpacity>
      </View>

      {/* 생년월일 */}
      <Text style={styles.label}>생년월일*</Text>
      <View style={styles.birthRow}>
        <TextInput style={styles.birthInput} placeholder="선택" />
        <TextInput style={styles.birthInput} placeholder="월" />
        <TextInput style={styles.birthInput} placeholder="일" />
      </View>

      {/* 주소 */}
      <Text style={styles.label}>주소*</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="주소" />
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>주소 찾기</Text></TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="상세주소를 입력해주세요." />

      {/* 완료 버튼 */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>회원가입 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
