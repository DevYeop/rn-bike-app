import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'

class GraphDetail extends Component {

  constructor(props) {
    super(props);
  }
 
  gotoChatScreen = (roomId, userIndex, friendInfo) => {
    this.props.navigation.navigate('ChatScreen', { roomId, userIndex, friendInfo })
  }

  createChattingRoom = friendInfo => {

    const invitedUser = []
    const userIndex = this.props.userInfo.id

    invitedUser.push(userIndex)
    invitedUser.push(friendInfo.id)

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
        invitedUser: invitedUser,
        latestMessage: {
          text: `You have joined the room.`,
          createdAt: new Date().getTime()
        }
      }).then(docRef => {
        this.gotoChatScreen(docRef.id, userIndex, friendInfo)
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })
  }

  /**
   * 해당 유저와 진행했던 1:1 채팅방이 존재하고 있는 지 확인.
   * 존재하면 기존에 있던 방의 id를 return,
   * 없으면 새로운 방을 만들고 새로 만들어진 방의 id를 return.
   * 
   * @param {*} friendInfo  
   */
  async checkRoomExists(friendInfo) { 

    let isReturned = false;
    const userIndex = this.props.userInfo.id

    const userInfoRef = await firestore().collection('roomList')
    const snapshot = await userInfoRef.where('invitedUser', 'array-contains', userIndex).get()

    if (snapshot.size == 0) {
      return this.createChattingRoom(friendInfo)
    }

    snapshot.forEach(doc => {

      let roomId = doc.id
      let { invitedUser } = doc.data()

      console.log('roomId', roomId)
      console.log('유저가 참여한 방들 :', invitedUser)

      if (invitedUser.includes(userIndex) && invitedUser.includes(friendInfo.id)) {
        isReturned = true
        return (
          this.gotoChatScreen(roomId, userIndex, friendInfo)
        )
      }
    });

    if (!isReturned) {
      this.createChattingRoom(friendInfo)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.props.route.params.profile_image_url }} style={styles.pic} />
        <Text style={{marginTop:15, marginBottom:15, fontSize:20}}>{this.props.route.params.nickname}</Text>
        <Button  title='    채팅 시작    ' onPress={() => this.checkRoomExists(this.props.route.params)}></Button>
      </View>
    )
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