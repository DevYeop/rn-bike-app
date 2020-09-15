import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default function ChattingScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '내일 오후2시 코드리뷰해요~!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '길버트',
          avatar: 'https://ca.slack-edge.com/T6TPDPPSL-U016D3J0V70-d60770cf7eb6-512',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}