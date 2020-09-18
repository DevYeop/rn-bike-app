import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, Image, LogBox } from 'react-native';

import KakaoLogins, { KAKAO_AUTH_TYPES } from '@react-native-seoul/kakao-login';
import NativeButton from 'apsl-react-native-button';

import { connect } from 'react-redux';
import { saveUserInfoKakao } from './src/actions/FriendsActions'
import { bindActionCreators } from 'redux';


if (!KakaoLogins) {
    console.error('Module is Not Linked');
}

const logCallback = (log, callback) => {
    console.log(log);
    callback;
};

const TOKEN_EMPTY = 'token has not fetched';
const PROFILE_EMPTY = {
    id: 'profile has not fetched',
    email: 'profile has not fetched',
    profile_image_url: '',
};

// const [loginLoading, setLoginLoading] = useState(false);
// const [logoutLoading, setLogoutLoading] = useState(false);
// const [profileLoading, setProfileLoading] = useState(false);
// const [unlinkLoading, setUnlinkLoading] = useState(false);

// const [token, setToken] = useState(TOKEN_EMPTY);
// const [profile, setProfile] = useState(PROFILE_EMPTY);

// const { id, email, nickname, profile_image_url: photo } = profile;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginLoading: false,
            logoutLoading: false,
            profileLoading: false,
            unlinkLoading: false,
            token: [],
            profile: {
                email: "sangyeop@kakao.com-123",
                id: "1480741883-123",
                nickname: "이상엽-123",
                profile_image_url: 'none',
            },
        }
    }

    kakaoLogin = () => {
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
            .then(result => {
                this.setState({
                    token: result.accessToken
                })
 
                this.setState({
                    loginLoading: false,
                })
                console.log('카톡버튼 props')
                console.log(this.props)

                KakaoLogins.getProfile()
                    .then(result => {

                        this.setState({
                            profile: result,
                        })

                        this.props.saveUserInfoKakao(result)

                        this.props.navigation.navigate('BottomTapNavigator')

                        console.log('카톡 result')
                        console.log(result)

                    })
                    .catch(err => {
                        this.setState({
                            loginLoading: false,
                        })
                        console.log(err)
                    });

 
                

                console.log('Login Finished')
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log('Login Cancelled')
                } else {
                    console.log('Login Failed')
                }
            });
    };

    // kakaoLogout = () => {
    //     logCallback('Logout Start', setLogoutLoading(true));

    //     KakaoLogins.logout()
    //         .then(result => {
    //             setToken(TOKEN_EMPTY);
    //             setProfile(PROFILE_EMPTY);
    //             logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
    //         })
    //         .catch(err => {
    //             logCallback(
    //                 `Logout Failed:${err.code} ${err.message}`,
    //                 setLogoutLoading(false),
    //             );
    //         });
    // };

    getProfile = () => {
        logCallback('Get Profile Start', setProfileLoading(true));

        KakaoLogins.getProfile()
            .then(result => {
                this.setState({
                    profile: result
                })
            })
            .catch(err => {
            });
    };

    // unlinkKakao = () => {
    //     logCallback('Unlink Start', setUnlinkLoading(true));

    //     KakaoLogins.unlink()
    //         .then(result => {
    //             setToken(TOKEN_EMPTY);
    //             setProfile(PROFILE_EMPTY);
    //             logCallback(`Unlink Finished:${result}`, setUnlinkLoading(false));
    //         })
    //         .catch(err => {
    //             logCallback(
    //                 `Unlink Failed:${err.code} ${err.message}`,
    //                 setUnlinkLoading(false),
    //             );
    //         });
    // };

    render() {
        return (


            <View style={styles.container}>
                <View style={styles.profile}>
                    <Image style={styles.profilePhoto} source={{ uri: this.props.userInfo.profile_image_url}} />
                    <Text>{this.props.userInfo.id}</Text>
                    <Text>{this.props.userInfo.email}</Text>
                    <Text>{this.props.userInfo.nickname}</Text>

                </View>
                <View style={styles.content}>
                    <Text style={styles.token}>{this.state.token}</Text>
                    <NativeButton
                        isLoading={this.state.loginLoading}
                        onPress={() => this.kakaoLogin()}
                        activeOpacity={0.5}
                        style={styles.btnKakaoLogin}
                        textStyle={styles.txtKakaoLogin}>
                        LOGIN
            </NativeButton>

                    {/* <NativeButton
                        isLoading={logoutLoading}
                        onPress={kakaoLogout}
                        activeOpacity={0.5}
                        style={styles.btnKakaoLogin}
                        textStyle={styles.txtKakaoLogin}>
                        Logout
            </NativeButton> */}
                    <NativeButton
                        isLoading={this.state.profileLoading}
                        onPress={() => this.getProfile()}
                        activeOpacity={0.5}
                        style={styles.btnKakaoLogin}
                        textStyle={styles.txtKakaoLogin}>
                        getProfile
            </NativeButton>
                    {/* <NativeButton
                        isLoading={unlinkLoading}
                        onPress={unlinkKakao}
                        activeOpacity={0.5}
                        style={styles.btnKakaoLogin}
                        textStyle={styles.txtKakaoLogin}>
                        unlink
            </NativeButton> */}
                </View>
            </View>
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
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: Platform.OS === 'ios' ? 0 : 24,
        paddingTop: Platform.OS === 'ios' ? 24 : 0,
        backgroundColor: 'white',
    },
    profile: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: 'black',
    },
    content: {
        flex: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    token: {
        width: 200,
        fontSize: 12,
        padding: 5,
        borderRadius: 8,
        marginVertical: 20,
        backgroundColor: 'grey',
        color: 'white',
        textAlign: 'center',
    },
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

LogBox.ignoreAllLogs()

export default connect(mapStateToProps, mapDispatchToProps)(App);


// YellowBox.ignoreWarnings(['source.uri']);

