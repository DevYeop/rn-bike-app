import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { List, Divider, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../../components/Loading'
import useStatsBar from '../../../utils/useStatusBar'

export default function ChatRoomListToShare({ navigation, route }) {
  useStatsBar('light-content');

  const { itemInfo } = route.params;
  const { userInfo } = route.params;

  console.log('aaa userInfo received : ', userInfo)
  console.log('aaa temInfo received : ', itemInfo)

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

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

          console.log('threads id:', threads)

          if (loading) {
            setLoading(false);
          }
        })

    return () => unsubscribe();

  }

  if (loading) {
    return <Loading />;
  }

  function goPreScreen() {
    // navigation.goback()
  }


  ///////////
  async function handleSend(info) {
    // const text = messages[0].text;

    console.log('클릭한 방의 정보', info)

    const roomId = info._id
    const {invitedUser} = info

    console.log('클릭한 방invitedUser', invitedUser)

    /**
     * 채팅방앙ㄴ에서의 채팅메세지들을 차곡차곡 더한다
     */
    firestore()
      .collection('chattingList')
      .doc(roomId)
      .collection('message')
      .add({
        createdAt: new Date().getTime(),
        user: {
          _id: userInfo.id,
          name: userInfo.nickname,
          avatar: userInfo.profile_image_url
        },
        text: 'sharedItem',
        itemInfo: itemInfo,
      }).then(
        goPreScreen(),
        alert('공유 완료')
      )


    // /**
    //  * 채팅방에 들어가기전 채팅룸리스트에서 챗팅룸이 표시해야할 마지막 채팅정보를 셋팅한다.
    //  */
    await firestore()
      .collection('chattingList')
      .doc(roomId)
      .set(
        {
          invitedUser: [
            invitedUser[0]+'',
            invitedUser[1]+'',
          ],
          latestMessage: {
            text: '드라이빙 코스가 공유되었습니다.',
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  return (
    <View style={styles.container}>
      <Button>아이템을 공유할 채팅방을 클릭</Button>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSend(item)}>
            <List.Item
              title={item.latestMessage.createdAt}
              description={item.latestMessage.text}
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});
