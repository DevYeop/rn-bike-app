import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, 
  FlatList,
} from 'react-native';
import { Content, Header, Left, Body, Right } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { bindActionCreators } from 'redux';
import { resetState } from '../../../actions/Actions'
import { connect } from 'react-redux';

import {
  GoogleSignin,
} from '@react-native-community/google-signin';

import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler'
import UserItem from '../../../components/user/UserItem'

class ContactTap extends Component {

  constructor(props) {
    super(props)
  }

  // 프로필화면으로 이동하는 거 다시 달아야 됨.
  goToProfileScreen = item => {
    this.props.navigation.navigate('UserProfile', item)
  }

  goToSearchScreen = () => {
    this.props.navigation.navigate('SearchScreen')
  }
 
  /**
   * google 또는 kakao 로그아웃인지 구별해야함.
   */
  async logout() {
    try {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      this.props.navigation.navigate('SettingTap')
      this.props.resetState()
    } catch (error) {
      console.error(error);
    }
  }

  render() { 
    return (
      <View style={{ flex: 1 }} >

        <Header>
          <Left><Text style={styles.headerFont}>친구목록</Text></Left>
          <Right>
            <TouchableHighlight style={{ marginleft: 15, marginRight: 15 }} onPress={() => this.goToSearchScreen()}>
              <MaterialCommunityIcons name="account-plus-outline" color='white' size={30} />
            </TouchableHighlight>
            <TouchableHighlight style={{ marginleft: 15, marginRight: 5 }} onPress={() => this.logout()}>
              <MaterialCommunityIcons name="logout" color='white' size={30} />
            </TouchableHighlight>
          </Right>
        </Header> 

        <UserItem userInfo={this.props.userInfo} />

        <FlatList
          data={this.props.userInfo.contactList}
          keyExtractor={(item) => { return item.id }}
          renderItem={this.renderItem} />

      </View>
    );
  }

  renderItem = ({ item }) => {
    const Stack = createStackNavigator();
    return (
      <UserItem userInfo={item} /> 
    )
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    resetState
  }, dispatch)
);

const styles = StyleSheet.create({
  headerFont: {
    color: '#fff',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactTap);