import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Button } from 'react-native-paper';

export default class GraphDetail extends Component {

  constructor(props) {
    super(props);

  }

  chatWithThisUser = () => {
    this.props.navigation.navigate('ChatScreen')
  }

  /**
   * 채팅룸을 생성함.
   * @param {} friendInfo 채팅룸의 인덱스로 활용
   */
  setChatRoom = friendInfo => {

    console.log('setFireStoreInfo called')

    const userIndex = this.props.userInfo.id
    const collectionName = 'chatroomList'

    const friendIdx = friendInfo

    const itemsRef = firestore().collection(userIndex + collectionName)
      .doc(friendIdx).collection('messages').doc('message')

  }
 
  async getChatList() {
    const userIndex = this.props.userInfo.id
    const collectionName = 'chatRoom'

    const snapshot = await firestore().collection(userIndex + collectionName).get()
    snapshot.docs.map(doc => console.log("frineds_docs", doc.data()));

    let contactList = []

    snapshot.docs.map(doc => contactList.push(doc.data()));

    // this.props.setContactItems(contactList)
  }


  render() {
    return (

      <View style={styles.container}>
        {console.log('userProfile props:', this.props)}

        <Image source={{ uri: this.props.route.params.profile_image_url }} style={styles.pic} />

        <Text>{this.props.route.params.nickname}</Text>
        

        <Button onPress={() => this.chatWithThisUser()}>채팅하기</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pic: {
    borderRadius: 60,
    width: 120,
    height: 120,
  },
});
