
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../Style/LoginStyle';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../Image/spLogo.png')} style={styles.logo} />

      <Text style={styles.slogan}>
        “환경을 살리는 알뜰 쇼핑 플랫폼”
      </Text>
      <Text style={styles.title}>
        세일로문에 가입하실 방법을{'\n'}선택해주세요
      </Text>
      <Text style={styles.description}>
        유통기한 임박 상품 구매가{'\n'}환경 보호와 연결된다는 점
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('ConsumerLogin')}
      >
        <Text style={styles.loginButtonText}>소비자 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('SellerLogin')}
      >
        <Text style={styles.loginButtonText}>판매자 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
