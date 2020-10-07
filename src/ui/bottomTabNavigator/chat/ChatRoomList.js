import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider, Button,Text, Image } from 'react-native-paper';
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
          // give defaults
          name: '',

          latestMessage: {
            text: ''
          },
          ...documentSnapshot.data()
        };

      });

      setThreads(threads);

      console.log('threads id:' , threads)

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
     
    item.invitedUser.forEach(element => {
 
      if (userIndex != element){
 
        friendIndex = element

        console.log('해당 채팅방에 들어가는 유저 아이디', userIndex)
        console.log('해당 채팅방에 있는 친구 아이디', friendIndex)
   
        /**
         * 멀쳇 구현시 친구 인덱스를 배열로 푸시해줘야할 듯
         */
      } 
 
      return navigation.navigate('Room', {roomId, userIndex, friendIndex})
    
    })
  }
 
  const getOpponentInfo = async (item) => {
     
    let friendIndex = ''
     
    item.invitedUser.forEach(element => {
      if (userIndex != element)  friendIndex = element
    })


    // const citiesRef = db.collection('userInfo');
    // const snapshot = await citiesRef.get();
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    // });


    const snapshot = await firestore().collection('userInfo').doc(friendIndex).get()
    
    const friendInfo = snapshot.data()

    console.log('nick', friendInfo.nickname)
    console.log('imgae', friendInfo.profile_image_url)
  
    return friendInfo.nickname


  }


  return (
    <View style={styles.container}>
      
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (




          <TouchableOpacity
            onPress={() => gotoChatScreen(item)}
          >

            <View style={{ flexDirection: 'column' }}>

              <Button onPress={()=>getOpponentInfo(item)}>asdfasdf</Button>

              {/* <Image source={{ uri: getOpponentInfo(item.invitedUser) }} style={styles.pic} /> */}

              {/* <Text>{getOpponentInfo(item)}</Text> */}

              <List.Item
                title={item.name}
                description={item.latestMessage.text}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />
            </View>
          </TouchableOpacity>
        )}
      />
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
  }
});
 

export default connect(mapStateToProps)(ChatRoomList);