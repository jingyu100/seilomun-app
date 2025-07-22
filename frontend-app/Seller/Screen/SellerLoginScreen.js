import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../Style/SellerLoginStyle';

export default function SellerLoginScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
    <Image source={require('../../assets/spLogo.png')} style={styles.logo} />


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
