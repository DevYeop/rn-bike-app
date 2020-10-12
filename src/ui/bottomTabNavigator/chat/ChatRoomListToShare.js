import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Text, ToastAndroid } from 'react-native';
import { List, Divider, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../../components/Loading'
import useStatsBar from '../../../utils/useStatusBar'
import { Icon, Container, Content, Header, Left, Body, Right } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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


  const showToastWithGravity = (text) => {
    ToastAndroid.showWithGravity(
      text,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
 
  async function handleSend(info) { 

    console.log('클릭한 방의 정보', info)

    const roomId = info._id
    const { invitedUser } = info

    console.log('클릭한 방invitedUser', invitedUser)
    showToastWithGravity('공유완료')
    navigation.goBack()

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
      }) 
 
    await firestore()
      .collection('chattingList')
      .doc(roomId)
      .set(
        {
          invitedUser: [
            invitedUser[0] + '',
            invitedUser[1] + '',
          ],
          latestMessage: {
            text: '드라이빙 코스가 공유되었습니다.',
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      )
  }

  const getOpponentInfo = (item, require) => {

    let opponentUserIndex

    item.invitedUser.forEach(element => {
      if (userInfo.id != element) {
        opponentUserIndex = element
        return
      }
    })

    const urlArray = item.userInfo

    let opponentNickname
    let opponentImageUrl

    urlArray.forEach(val => {

      if (val.userIndex == opponentUserIndex) {

        opponentNickname = val.userNickname
        opponentImageUrl = val.userImageUrl

      }
    })

    if (require == 'nickname') {
      return opponentNickname
    } else if (require == 'url') {
      return opponentImageUrl
    }
  }

  const getTime = (mill) => {
    const date = new Date(mill)
    return date.toLocaleDateString()
  }
  


  return (
    <View style={styles.container}><Header>
      <Body>
        <Text style={styles.headerFont}>공유할 대상을 선택해 주세요.</Text>
      </Body>
    </Header>

      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (

          <TouchableOpacity onPress={() => handleSend(item)}>
            <View style={styles.row}>
              {
                getOpponentInfo(item, 'url') != null ?
                  <Image style={styles.pic} source={{ uri: getOpponentInfo(item, 'url') }} />
                  :
                  <Image style={styles.pic} source={require('../../../res/default-profile-image.png')} />
              }
              <View>
                {console.log(item)}
                <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail"> {getOpponentInfo(item, 'nickname')} </Text>
                <Text style={styles.mblTxt}>{item.latestMessage.text}</Text>
              </View>
              <View style={styles.msgContainer}>
              
                <Text style={styles.msgTxt}>  {getTime(item.latestMessage.createdAt)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}/>
    </View>
  );
}

const styles = StyleSheet.create({
  headerFont: {
    color: '#fff',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  },

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

})
