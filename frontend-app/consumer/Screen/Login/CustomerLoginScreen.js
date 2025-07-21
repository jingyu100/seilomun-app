import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../../Style/Login/CustomerLoginStyle';

export default function CustomerLoginScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../../Image/spLogo.png')} style={styles.logo} />

      <TextInput
        placeholder="아이디"
        placeholderTextColor="#999"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.snsLoginText}>간편하게 로그인</Text>
      <View style={styles.snsContainer}>
        <Image source={require('../../Image/google.png')} style={styles.snsIcon} />
        <Image source={require('../../Image/naver.png')} style={styles.snsIcon} />
        <Image source={require('../../Image/kakao.png')} style={styles.snsIcon} />
      </View>

      <View style={styles.footerLinks}>
        <Text style={styles.footerText}>아이디 찾기</Text>
        <Text style={styles.footerDot}>|</Text>
        <Text style={styles.footerText}>비밀번호 찾기</Text>
        <Text style={styles.footerDot}>|</Text>
        <Text style={styles.footerText}>회원가입</Text>
      </View>
    </View>
  );
}
