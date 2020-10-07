import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  saveUserInfoGoogle,
  setPreRouteItems,
  setContactItems,
 } from '../../actions/Actions'
import { bindActionCreators } from 'redux'; 

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import KakaoLoginButton from './KakaLoginButton'

import firestore, { firebase } from '@react-native-firebase/firestore'; 
 
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
  
  async getContactList() {
 
    const userIndex = this.props.userInfo.id 

    const snapshot = await firestore().collection('user'+userIndex).doc('list').collection('contactList').get()
    
    snapshot.docs.map(doc => console.log("frineds_docs",doc.data()));

    let contactList = []
    
    snapshot.docs.map(doc => contactList.push(doc.data()));

    console.log('contactList', contactList)
  
    this.props.setContactItems(contactList)
}

async addContactList() {

  console.log('addContactList called')
 
  const userIndex = this.props.userInfo.id
  const collectionName = 'contactList_test'
  
  const friendIndex = 'test-1' 

  const friendInfo = {
    id: 'test-1',
    nickname : 'user',
    imgae : 'https://ca.slack-edge.com/T6TPDPPSL-U019G7HDU81-371bb17a9475-512',
  } 
  
  const friendRef = firestore().collection(userIndex+collectionName)
  
  friendRef.doc(friendIndex).set(
      { friendInfo }
  );
}

  async getPreRouteItems() {

    let preRouteItems = []
    const userIndex = this.props.userInfo.id
    const collectionName = 'user'+userIndex

    const itemsRef = await firestore().collection(collectionName).doc('list').collection('routeItems').get()
    itemsRef.docs.map(doc => preRouteItems.push(doc.data()));
  
    this.props.setPreRouteItems(preRouteItems)
}
  
 
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      this.props.saveUserInfoGoogle(userInfo)
 
      this.getPreRouteItems()
 
      this.getContactList()

      this.setUserInfoFireStore()

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

  /**
   * 유저의 fireStore 루트 Collection에 유저정보를 document로 저장한다.
   * 나중에 친구 추가,검색 및 채팅 초대 등을 위해 유저정보를 참조하기 위해 쓰인다.
   */
  setUserInfoFireStore = () => {
 
    const userIndex = this.props.userInfo.id
    const collectionName = 'user'+userIndex
 
    const itemsRef = firestore().collection('userInfo');
 
    itemsRef.doc(userIndex).set(
        { 
          id : this.props.userInfo.id,
          email : this.props.userInfo.email,
          nickname : this.props.userInfo.nickname,
          profile_image_url : this.props.userInfo.profile_image_url
        }
    );
  }
 
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
 
          <Image
            style={{alignItems:'flex-start', height:500}}
            source={require('../../res/brung.gif')} // first way (local)
            resizeMethod='resize' />

          <Text style={{fontSize:32}}> rn - bike - app  </Text>

          <GoogleSigninButton
            style={{ width: 250, height: 50, marginBottom : 25, }}
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
    setPreRouteItems,
    setContactItems,
  }, dispatch)
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingTap);