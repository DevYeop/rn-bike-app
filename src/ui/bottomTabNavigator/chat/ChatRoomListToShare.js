import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { List, Divider, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../../components/Loading'
import useStatsBar from '../../../utils/useStatusBar'
 
export default function ChatRoomList({ navigation, route }) {
  useStatsBar('light-content');

  const {itemInfo} = route.params;

  console.log('itemInfo received : ', itemInfo)

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch threads from Firestore
   */
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS3') 
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
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  function sendSharedItem() {
 

    alert('click')

  }

  function goPreScreen() {
    () => navigation.goback()
  }

  async function handleSend() {

    const text = 'SharedItem';

    const userIdx = '110329963856987142979'
    const threadID = 'ImxrNjznbQre4RWifS62'

    console.log('userIdx :', userIdx)
    console.log('thread._id',threadID)

    await firestore()
      .collection('THREADS3')
      .doc(threadID)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: userIdx,
          email: userIdx
        },
        itemInfo: itemInfo,
      });

    await firestore()
      .collection('THREADS3')
      .doc(threadID)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      ).then( 
        goPreScreen(),
        alert('공유 완료')
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
            onPress={() => handleSend()}
          >
            <List.Item
              title={item.name}
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
 