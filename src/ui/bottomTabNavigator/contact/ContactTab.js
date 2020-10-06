import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';


import { bindActionCreators } from 'redux'; 
import { resetState } from '../../../actions/Actions'


import {
  GoogleSignin, 
} from '@react-native-community/google-signin';

import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux';
import { Button } from 'react-native-paper';

class ContactTap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      calls: [
        // { id: 1, name: "마이크", status: "active", image: "https://ca.slack-edge.com/T6TPDPPSL-U012FDZ8ZFY-gd91ba12a15f-512" },
        // { id: 2, name: "길버트", status: "active", image: "https://ca.slack-edge.com/T6TPDPPSL-U016D3J0V70-d60770cf7eb6-512" },
        // { id: 3, name: "매튜", status: "active", image: "https://ca.slack-edge.com/T6TPDPPSL-UNTQY9CQ3-7166ae8bba92-512" },
        // { id: 4, name: "할리", status: "active", image: "https://ca.slack-edge.com/T6TPDPPSL-U019G7HDU81-371bb17a9475-512" },
        // { id: 5, name: "지쿠터1", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 6, name: "지쿠터2", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 8, name: "지쿠터3", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 9, name: "지쿠터4", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 10, name: "지쿠터5", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 11, name: "지쿠터6", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
        // { id: 12, name: "지쿠터7", status: "inactive", image: "https://gbike.io/index_files/5c456b32d027f.png" },
      ],
    };
    this.contactList = this.contactList.bind(this);
  }

  goToProfileScreen = () => {
    this.props.navigation.navigate('UserProfile')
  }

  renderItem = ({ item }) => {
    const Stack = createStackNavigator();
    return (
      <TouchableOpacity onPress={this.goToProfileScreen}>
        {
          console.log('contact props', item)
        }
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.pic} />
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

  async logout () {
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
      <View style={{ flex: 1 }} >  

        <TouchableOpacity onPress={this.goToProfileScreen}>
          <View style={styles.row}>
            <Image source={{ uri: this.props.userInfo.profile_image_url }} style={styles.pic} />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{this.props.userInfo.nickname}</Text>
                <Text style={styles.mblTxt}></Text>
              </View>
              <View style={styles.msgContainer}>
                <Text style={styles.msgTxt}>{this.props.userInfo.email}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>


        <Button onPress={()=>this.logout()}>로그아웃</Button>

 
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