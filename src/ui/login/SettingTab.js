import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { saveUserInfoGoogle } from '../../actions/FriendsActions'
import { bindActionCreators } from 'redux';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import KakaoLoginButton from './KakaLoginButton'

const Stack = createStackNavigator();

class SettingTap extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '1038042430405-e2nl3grsb7aqt804d1tni51vkd7aaka1.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    });
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.saveUserInfoGoogle(userInfo)
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

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <GoogleSigninButton
            style={{ width: 250, height: 50 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}/>
          <KakaoLoginButton navigation={this.props.navigation} />
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
    saveUserInfoGoogle,
  }, dispatch)
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingTap);