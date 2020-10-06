import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Button } from 'react-native-paper'; 
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';

class GraphDetail extends Component {

  constructor(props) {
    super(props);

  }

  /**
   * 
   * @param {*} friendIndex 
   */
  gotoChatScreen = (roomId, userIndex, friendIdx) => {
    this.props.navigation.navigate('ChatScreen',{roomId, userIndex, friendIdx})

  }

  createChattingRoom = friendIndex => { 
 
    const invitedUser = []
    const userIndex = this.props.userInfo.id

    invitedUser.push(userIndex)
    invitedUser.push(friendIndex)
   
    /**
     * 방을 추가하기 전에,
     * 기존에 상대방이랑 채팅하고 있떤 방이 있는기 검샏해야함.
     * 없으면 생성. 있으면 기존의 방 id 반환.
     * 1:1채팅상황임
     */
    firestore()
    .collection('roomList') 
    .add({
      name: "roomname",
      invitedUser : invitedUser,
      latestMessage: {
        text: `You have joined the room.`,
        createdAt: new Date().getTime()
      }
    }).then( docRef => { 
      this.gotoChatScreen(docRef.id, userIndex, friendIndex)
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
    // 생성하면 채ㅐ팅 스크린으로 이동해야하마!
  }

  /**
   * 해당 유저와 진행했던 1:1 채팅방이 존재하고 있는 지 확인.
   * 존재하면 기존에 있던 방의 id를 return,
   * 없으면 새로운 방을 만들고 새로 만들어진 방의 id를 return.
   * 
   * @param {*} friendIndex  
   */
  async checkRoomExists(friendIndex) {
    console.log('checkRoomExists called')

    let isReturned = false;
    const userIndex = this.props.userInfo.id

    const userInfoRef = await firestore().collection('roomList')
    const snapshot = await userInfoRef.where('invitedUser', 'array-contains', userIndex).get()
   
    if (snapshot.size == 0){
      return this.createChattingRoom(friendIndex)
    }

    console.log ('snapshot size :', snapshot.size)
    snapshot.forEach(doc => {

      let roomId = doc.id
      let {invitedUser} = doc.data()

      console.log('roomId',roomId)
      console.log('유저가 참여한 방들 :', invitedUser)

      if(invitedUser.includes(userIndex) &&  invitedUser.includes(friendIndex) ){
        isReturned = true
        return ( 
          this.gotoChatScreen(roomId, userIndex, friendIndex)
        )}
    });

    if (isReturned){
      console.log('이미 반환됨')
    }else{
      console.log('없음 생성해야 됨.')
      this.createChattingRoom(friendIndex)
    }
    
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
        

        <Button onPress={() => this.checkRoomExists(this.props.route.params.id)}>채팅하기</Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

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


export default connect(mapStateToProps)(GraphDetail);