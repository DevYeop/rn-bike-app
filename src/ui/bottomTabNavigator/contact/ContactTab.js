import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Icon, Container, Content, Header, Left, Body, Right } from 'native-base';


import { bindActionCreators } from 'redux';
import { resetState } from '../../../actions/Actions'
import { connect } from 'react-redux';

import {
  GoogleSignin,
} from '@react-native-community/google-signin';

import { createStackNavigator } from '@react-navigation/stack';

import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';

class ContactTap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      calls: [

      ],
    };
    this.contactList = this.contactList.bind(this);
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
 
      <TouchableOpacity onPress={()=>this.goToProfileScreen(item)}>
        <View style={styles.row}>
          <Image source={{ uri: item.profile_image_url }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{item.nickname}</Text>
              <Text style={styles.mblTxt}>{item.id}</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  contactList(state) {


  }

  async test() {


    const snapshot = await firestore()
    .collection('chattingList')    
    .where('invitedUser', 'array-contains', '110329963856987142979')
    .orderBy('latestMessage.createdAt', 'desc')
    .get() 
   
 
    /**
     * todo : 검색된 유저가 없을 때 ui 처리해야함.
     */
    snapshot.forEach(doc => {

      console.log('testtesttest',doc.data())
        
    });

  }

  async logout() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();


      this.props.resetState()

      this.props.navigation.navigate('SettingTap')
    } catch (error) {
      console.error(error);
    }



    /**
     * 모든 steate reset
     */
  }
  
  render() {
    const Stack = createStackNavigator();
    return (

      /**
       *  todo : 이 부분을 컴포넌트화 시키기
       */
      <View style={{ flex: 1 }} >

        <Container style={{ backgroundColor: 'white' }}>
          <Header>
            {/* <Left><Icon name="md-person-add" style={{ paddingLeft: 10 }} /></Left> */}
            {/* <Body><Text>anpigon</Text></Body> */}
            <Right>
              <TouchableHighlight onPress={()=>this.goToSearchScreen()}>
              <Icon name="md-person-add" style={{ paddingLeft: 10 }} />
              </TouchableHighlight>
              </Right>
          </Header>
        </Container>


        {console.log('this.props.userInfo', this.props.userInfo)}

        <TouchableOpacity onPress={this.goToProfileScreen}>
          <View style={styles.row}>
            <Image source={{ uri: this.props.userInfo.profile_image_url }} style={styles.pic} />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{this.props.userInfo.nickname}</Text>
                <Text style={styles.mblTxt}> {this.props.userInfo.id}</Text>
              </View>
              <View style={styles.msgContainer}>
                <Text style={styles.msgTxt}>{this.props.userInfo.email}</Text>

              </View>
            </View>
          </View>
        </TouchableOpacity>


        <Button onPress={() => this.logout()}>로그아웃</Button>

        <Button onPress={() => this.test()}>testtest</Button>
        
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
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