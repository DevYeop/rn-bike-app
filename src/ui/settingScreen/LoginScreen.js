
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Title } from 'react-native-paper'
import FormInput from './FormInput'
import FormButton from './FormButton'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>rn-bike-app</Title>
      <FormInput
        labelName='Email'
        value={email}
        autoCapitalize='none'
        onChangeText={userEmail => setEmail(userEmail)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={userPassword => setPassword(userPassword)}
      />
      <FormButton
        title='로그인'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
      />
      <TouchableOpacity style={{ marginTop: 10 }} activeOpacity={0.5}>
        <Image
          source={require('../../res/naverLoginButton.png')}
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 10 }} activeOpacity={0.5}>
        <Image
          source={require('../../res/gogogleLoginButton.png')}
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
      <FormButton
        title='회원가입'
        modeValue='text'
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 16
  },
  ImageIconStyle: {
    height: 50,
    width: 190,
    resizeMode: 'stretch',
  },
});