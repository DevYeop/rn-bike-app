import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  saveUserInfoGoogle,
  setPreRouteItems,
 } from '../../actions/FriendsActions'
import { bindActionCreators } from 'redux'; 

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import KakaoLoginButton from './KakaLoginButton'

import firestore from '@react-native-firebase/firestore'; 
 
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
 

  // async deleteAll() {
  //   alert('User deleted!')
  //   console.log('deleteAll called')

  //   const userIndex = this.props.userInfo.id
  //   const collectionName = 'routeItemCollection'

  //   firestore()
  //     .collection(userIndex)
  //     .delete()
  //     .then(() => {
  //       alert('User deleted!')
  //     });
  // }


  async getPreRouteItems() {

    console.log('getMarker called')

    const userIndex = this.props.userInfo.id
    const collectionName = 'routeItemCollection_new'

    const snapshot = await firestore().collection(userIndex+collectionName).get()
    snapshot.docs.map(doc => console.log("docs",doc.data()));

    let preRouteItems = []
    
    snapshot.docs.map(doc => preRouteItems.push(doc.data()));

    console.log('preRouteItems', preRouteItems)

    /**
     * 이전 아이템들의 객체들의 집합을 줘야함.
     */
    this.props.setPreRouteItems(preRouteItems)
}
  
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      this.props.saveUserInfoGoogle(userInfo)

       /**
       * 여기서 로그인 완료되면 redux-store에,
       * 기존의 유저가 가지고 있던 아이템의 정보를 저장해야함.
       * 
       * 액션과 리듀서 수정 필요
       */
      this.getPreRouteItems()
 
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
    return (
      <View style={styles.container}>
        <View style={styles.container}>
{/*            
          <Button title='delete All ' onPress={this.deleteAll}/>
          */}

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
    setPreRouteItems
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