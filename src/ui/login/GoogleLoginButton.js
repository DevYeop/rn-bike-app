import React from 'react';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
 
export const GoogleLoginButton = (initSetting) => {
 
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            initSetting.initSetting(userInfo, 'google')
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
    }

    return (
        <GoogleSigninButton
            style={{ width: 250, height: 50, marginBottom: 25, }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={()=> signIn()} />
    )
}

export default GoogleLoginButton