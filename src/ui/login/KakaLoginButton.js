import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import KakaoLogins, { KAKAO_AUTH_TYPES } from '@react-native-seoul/kakao-login';
import NativeButton from 'apsl-react-native-button';

import { connect } from 'react-redux';
import { saveUserInfoKakao } from '../../actions/Actions'
import { bindActionCreators } from 'redux';

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
                        this.props.saveUserInfoKakao(result)
                        this.props.navigation.navigate('BottomTapNavigator')
                    })
                    .catch(err => {
                        console.log(err)
                    });
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log('Login Cancelled')
                } else {
                    console.log('Login Failed')
                }
            });
    };

    render() {
        return (

            /**
             * 카카오 버튼으로 바꿔야 함.
             */
            <NativeButton
                isLoading={false}
                onPress={() => this.kakaoLogin()}
                activeOpacity={0.5}
                style={styles.btnKakaoLogin}
                textStyle={styles.txtKakaoLogin}>
                카카오 LOGIN
            </NativeButton>
        );
    }
}

const mapStateToProps = (state) => {
    const { userInfo } = state
    return { userInfo }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        saveUserInfoKakao,
    }, dispatch)
);

const styles = StyleSheet.create({
    btnKakaoLogin: {
        height: 48,
        width: 240,
        alignSelf: 'center',
        backgroundColor: '#F8E71C',
        borderRadius: 0,
        borderWidth: 0,
    },
    txtKakaoLogin: {
        fontSize: 16,
        color: '#3d3d3d',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KakaLoginButton);
