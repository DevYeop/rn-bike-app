import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import KakaoLogins, { KAKAO_AUTH_TYPES } from '@react-native-seoul/kakao-login';

import { TouchableOpacity } from 'react-native-gesture-handler';

if (!KakaoLogins) {
    console.error('Module is Not Linked');
}

class KakaLoginButton extends React.Component {

    constructor(props) {
        super(props);
    }
  
    kakaoLogin = () => {
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
            .then(result => {
                KakaoLogins.getProfile()
                    .then(result => {
                        this.props.initSetting(result, 'kakao')                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log('Login Cancelled')
                } else {
                    console.log('Login Failed')
                }
            })
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.kakaoLogin()}>
                    <Image
                        style={styles.btnKakaoLogin}
                        resizeMethod='auto'
                        source={require('../../res/kakao_login.png')} />
                </TouchableOpacity>
            </View>
        )
    }
}
  
const styles = StyleSheet.create({
    btnKakaoLogin: {
        height: 48,
        width: 245,
        alignSelf: 'center',
        backgroundColor: '#F8E71C',
        borderRadius: 0,
        borderWidth: 0,
    }, 
});

export default KakaLoginButton
