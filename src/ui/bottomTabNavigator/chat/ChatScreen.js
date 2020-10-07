import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage
} from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
// import { AuthContext } from '../../../navigation/AuthProvider'
import firestore from '@react-native-firebase/firestore';
import useStatsBar from '../../../utils/useStatusBar'

import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';

import RouteItemView from './RouteItemView'

function ChatScreen({ route, userInfo }) {

  useStatsBar('light-content');
  const [messages, setMessages] = useState([]);
  const { roomId, userIndex, friendIndex } = route.params;



  // const { user } = useContext(AuthContext);
  // const currentUser = user.toJSON();
  const userIdx = userInfo.id
  const userNick = userInfo.nickname
  const profile_image_url = userInfo.profile_image_url

  async function handleSend(messages) {
    const text = messages[0].text;

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
          _id: userIdx,
          name: userNick,
          avatar: profile_image_url
        },
        text: text,
      });


    /**
     * 채팅방에 들어가기전 채팅룸리스트에서 챗팅룸이 표시해야할 마지막 채팅정보를 셋팅한다.
     */
    await firestore()
      .collection('chattingList')
      .doc(roomId)
      .set(
        {
          invitedUser: [
            userIdx,
            friendIndex
          ],
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const messagesListener = firestore()
      .collection('chattingList')
      .doc(roomId)
      .collection('message')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.nickname
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderBubble(props) {

    if (props.currentMessage.itemInfo) {
      return (
        <RouteItemView itemInfo={props.currentMessage.itemInfo} userInfo={userInfo} />
      )
    } else {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#6646ee'
            },
            left: {
              backgroundColor: '#ffd608'
            }
          }}
          textStyle={{
            right: {
              color: '#fff'
            }
          }}
        />
      )
    }
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (

    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: userIdx,
        name: userNick,
        avatar: profile_image_url
      }}
      placeholder=''
      alwaysShowSend
      showUserAvatar={true}
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}

    />

  );
}


const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo: userInfo }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
});


export default connect(mapStateToProps)(ChatScreen);