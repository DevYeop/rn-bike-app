import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux';

class ChatRoomList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      calls: [ 
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

  render() {
    const Stack = createStackNavigator();
    return (

      /**
       *  todo : 유저의 정보를 나타네는 컴포넌트를 모듈화 해야함.
       */
      <View style={{ flex: 1 }} > 
      {
        console.log('contact this.props'),
        console.log(this.props)
      }
        <TouchableOpacity onPress={this.goToProfileScreen}>
          <View style={styles.row}>
            <Image source={{ uri: this.props.userInfo.profile_image_url }} style={styles.pic} />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">채팅룸-01</Text>
                <Text style={styles.mblTxt}>채팅 룸 ㅁㅇㄹㅁㄴㅇㄹ</Text>
              </View>
              <View style={styles.msgContainer}>
                <Text style={styles.msgTxt}>{this.props.userInfo.email}</Text>
              </View>
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

export default connect(mapStateToProps)(ChatRoomList);