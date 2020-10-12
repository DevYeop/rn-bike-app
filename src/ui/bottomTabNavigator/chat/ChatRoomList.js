import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../../components/Loading'
import useStatsBar from '../../../utils/useStatusBar'

import { connect } from 'react-redux';
 
function ChatRoomList({ navigation, userInfo }) {
  useStatsBar('light-content');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const userIndex = userInfo.id
  
  useEffect( () => { 
 
    getUnsubscribe()

  }, []); 

  const getUnsubscribe = async () => {

    console.log('현재 로그인한 유저의 인덱스, 초대된유저 검사할 때 씀', userInfo.id)
 
    const unsubscribe =   
    await firestore()
    .collection('chattingList')    
    .where('invitedUser', 'array-contains', userInfo.id)
    .orderBy('latestMessage.createdAt', 'desc')
    .onSnapshot(querySnapshot => {

      const threads = querySnapshot.docs.map(documentSnapshot => {

        return {
          _id: documentSnapshot.id, 

          name: '',

          latestMessage: {
            text: ''
          },
          ...documentSnapshot.data()
        };

      });

      setThreads(threads);
 
      if (loading) {
        setLoading(false);
      }
    })

  /**
   * unsubscribe listener
   */
  return () => unsubscribe();

  }

  if (loading) {
    return <Loading />;
  }
  
  /**
   * 채팅화면으로 넘어가기전에 필요한 인자들을 구한 뒤 전달한다.
   * @param {*} item 
   */
  const gotoChatScreen = item => {

    const roomId = item._id
    let friendIndex = ''

    console.log('채팅룸리스트에서 클릭된 채팅방에게 넘겨진 아템 정보', item)
     
    item.invitedUser.forEach(element => {
 
      console.log('유저 인덱스',userIndex)
      console.log('비교 인덱스',element)
      if (userIndex != element){
        friendIndex = element
      } 
    })
 
    console.log('friendIndex',friendIndex)

    const friendInfoArray = item.userInfo
    let friendInfo

    friendInfoArray.forEach(val =>{
      if(val.userIndex == friendIndex){
        friendInfo = val
      }
    }) 
    return navigation.navigate('Room', {roomId, userIndex, friendInfo })
  }


 
  const getOpponentInfo = (item, require) => {
     
    let opponentUserIndex
     
    item.invitedUser.forEach(element => {
      if (userIndex != element) {
        opponentUserIndex = element
        return
      }
    })

    const urlArray = item.userInfo

    let opponentNickname
    let opponentImageUrl 

    urlArray.forEach(val => {

      if(val.userIndex == opponentUserIndex ){ 

        opponentNickname = val.userNickname
        opponentImageUrl = val.userImageUrl
     
      }      
    })
 
    if (require == 'nickname'){
      return opponentNickname
    }else if (require == 'url'){
      return opponentImageUrl
    }
  }

  const getTime = (mill) => {
    const date = new Date(mill)
    return date.toLocaleDateString()
  }
 
  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => gotoChatScreen(item)}>
             <View style={styles.row}>
                {
                  getOpponentInfo(item, 'url') != null ?
                    <Image style={styles.pic}  source={{uri: getOpponentInfo(item, 'url')}} />                   
                    :
                    <Image style={styles.pic} source={require('../../../res/default-profile-image.png')} />
                }
                <View>
                  {console.log(item)}
                  <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail"> {getOpponentInfo(item,'nickname')} </Text>
                  <Text style={styles.mblTxt}>{item.latestMessage.text}</Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{getTime(item.latestMessage.createdAt)}</Text>
                </View>
              </View>
          </TouchableOpacity>
        )}/>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
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
    fontWeight: '200',
    color: '#222',
    fontSize: 15,
    width: 200,
  },
  mblTxt: {
    marginLeft: 15,
    fontWeight: '200',
    color: '#777',
    fontSize: 15,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 15,
    marginLeft: 15,
  },
});
 
export default connect(mapStateToProps)(ChatRoomList);