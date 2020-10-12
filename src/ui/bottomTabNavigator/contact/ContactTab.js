import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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

import { Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { TouchableHighlight } from 'react-native-gesture-handler'

class ContactTap extends Component {

  constructor(props) {
    super(props)
  }

  goToProfileScreen = item => {
    this.props.navigation.navigate('UserProfile', item)
  }

  goToSearchScreen = () => {
    this.props.navigation.navigate('SearchScreen')
  }

  renderItem = ({ item }) => {
    const Stack = createStackNavigator();
    return (
      <TouchableOpacity onPress={() => this.goToProfileScreen(item)}>
        <View style={styles.row}>
          {
            item.profile_image_url ?
              <Image style={styles.pic} source={{ uri: item.profile_image_url }} />
              :
              <Image style={styles.pic} source={require('../../../res/default-profile-image.png')} />
          }
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{item.nickname}</Text>
              {/* <Text style={styles.mblTxt}>{item.id}</Text> */}
            </View>
            <View style={styles.msgContainer}>
              {/* <Text style={styles.msgTxt}>{item.status}</Text> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } 

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
    const Stack = createStackNavigator();
    return (

      /**
       *  todo : 이 부분을 컴포넌트화 시키기
       */
      <View style={{ flex: 1 }} > 
          <Header>
            <Left><Text style={styles.headerFont}>친구목록</Text></Left>
            {/* <Body>
         
            </Body> */}
            <Right>
              <TouchableHighlight style={{marginleft:15, marginRight:15}} onPress={()=>this.goToSearchScreen()}>
              <MaterialCommunityIcons name="account-plus-outline" color='white'  size={30} />
              </TouchableHighlight>
             
              <TouchableHighlight style={{marginleft:15, marginRight:5}} onPress={()=>this.logout()}>
              <MaterialCommunityIcons name="logout" color='white'  size={30} />
              </TouchableHighlight>
              </Right>
          </Header> 
 
        <TouchableOpacity>
          <View style={styles.row}>
            {
              this.props.userInfo.profile_image_url ?
                <Image style={styles.pic} source={{ uri: this.props.userInfo.profile_image_url}} />
                :
                <Image style={styles.pic} source={require('../../../res/default-profile-image.png')} />
            }
            <View>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail"> {this.props.userInfo.nickname} </Text>
            </View>
          </View>
        </TouchableOpacity>
 
        <FlatList
          data={this.props.userInfo.contactList}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={this.renderItem} />


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
    resetState
  }, dispatch)
);

const styles = StyleSheet.create({
  headerFont:{
    color: '#fff',
    fontSize:18,
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