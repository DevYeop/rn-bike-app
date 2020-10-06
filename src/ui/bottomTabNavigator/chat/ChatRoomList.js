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

  
  useEffect( () => { 
 
    getUnsubscribe()

  }, []); 
  
  const getUnsubscribe = async () => {

    console.log('in chatroom userInfo.id', userInfo.id)
 
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

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Room', { thread: item })}
          >

            <View style={{flexDirection:'column'}}>
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