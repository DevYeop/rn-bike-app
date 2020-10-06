import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, 
} from 'react-native'; 
import { Button } from 'react-native-paper';

export default class GraphDetail extends Component {

  constructor(props) {
    super(props);
  }
 
  chatWithThisUser =() => {
    this.props.navigation.navigate('ChatScreen')

    this,this.setChatRoom('test-1')
  
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
       
      const itemsRef = firestore().collection(userIndex+collectionName)
      .doc(friendIdx).collection('messages').doc('message')
       
  }

  getChatList = friendInfo => {

  }
   

  async getChatList() { 
    const userIndex = this.props.userInfo.id
    const collectionName = 'chatRoom'

    const snapshot = await firestore().collection(userIndex+collectionName).get()
    snapshot.docs.map(doc => console.log("frineds_docs",doc.data()));

    let contactList = []
    
    snapshot.docs.map(doc => contactList.push(doc.data()));
 
    // this.props.setContactItems(contactList)
}

    
  render() {
    return (
      <View> 
          <Button onPress={()=>this.chatWithThisUser()}>gotochat</Button>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: '#dbdbca',
    borderColor: 'white',
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 280,
  },
  container: {
    width: 275,
    height: 150,
    padding: 10,
    margin: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
 