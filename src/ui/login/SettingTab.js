import React from 'react';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {
  saveUserInfoGoogle,
  saveUserInfoKakao,
  setPreRouteItems,
  setContactItems,
} from '../../actions/Actions'
import { bindActionCreators } from 'redux'

import {
  GoogleSignin,
} from '@react-native-community/google-signin'

import KakaoLoginButton from './KakaLoginButton'

import firestore from '@react-native-firebase/firestore'
import { loadRouteItem, loadContactList } from '../../query/accessFireStore'
import GoogleLoginButton from './GoogleLoginButton';

class SettingTap extends React.Component {

  constructor(props) {
    super(props)
  }

  // ???
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '1038042430405-e2nl3grsb7aqt804d1tni51vkd7aaka1.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    })
  }

  async getContactList() {
    const contactList = await loadContactList(this.props.userInfo.id)
    this.props.setContactItems(contactList)
  }

  async getRouteItems() {
    const routeItems = await loadRouteItem(this.props.userInfo.id)
    this.props.setPreRouteItems(routeItems)
  }

  setUserInfoFireStore = () => {

    const userIndex = this.props.userInfo.id
    const itemsRef = firestore().collection('userInfo');

    itemsRef.doc(userIndex).set(
      {
        id: this.props.userInfo.id,
        email: this.props.userInfo.email,
        nickname: this.props.userInfo.nickname,
        profile_image_url: this.props.userInfo.profile_image_url
      }
    )
  }

  initSetting = (userInfo, from) => {
    if (from == 'google') {
      this.props.saveUserInfoGoogle(userInfo)
    } else if (from == 'kakao') {
      this.props.saveUserInfoKakao(userInfo)
    }
    this.getRouteItems()
    this.getContactList()
    this.setUserInfoFireStore()
    this.props.navigation.navigate('BottomTapNavigator')
  }

  render() {
    return (
      <View style={styles.container}>

        <Image
          style={{ alignItems: 'flex-start', height: 500 }}
          source={require('../../res/brung.gif')}
          resizeMethod='resize' />

        <GoogleLoginButton initSetting={this.initSetting} />

        <KakaoLoginButton initSetting={this.initSetting} />

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveUserInfoGoogle,
    saveUserInfoKakao,
    setPreRouteItems,
    setContactItems,
  }, dispatch)
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    alignItems: 'center'
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingTap)