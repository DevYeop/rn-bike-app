import React from 'react';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';



_signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        // this.props.saveUserInfoGoogle(userInfo)

        // this.getRouteItems()

        // this.getContactList()

        // this.setUserInfoFireStore()

        this.props.navigation.navigate('BottomTapNavigator')
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('SIGN_IN_CANCELLED')
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('IN_PROGRESS')
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('PLAY_SERVICES_NOT_AVAILABLE')
        } else {
            console.error(error);
        }
    }
};

export const GoogleLoginButton = (initSetting) => {

    const setInitSetting = () => {
        initSetting
    }

    return (
        <GoogleSigninButton
            style={{ width: 250, height: 50, marginBottom: 25, }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={setInitSetting()} />
    )
}

export default GoogleLoginButton