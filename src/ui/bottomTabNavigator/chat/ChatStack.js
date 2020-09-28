import * as React from 'react';
 
import { createStackNavigator } from '@react-navigation/stack'; 
import ChatScreen from './ChatScreen'; 
import ChatRoomList from './ChatRoomList'; 

const ChatStack = createStackNavigator();
  
class GraphTab extends React.Component {

  render() {
    return ( 
          <ChatStack.Navigator
            initialRouteName="ChatRoomList"
            screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
            <ChatStack.Screen name="ChatRoomList" component={ChatRoomList} />
          </ChatStack.Navigator>
    )
  }
}

export default GraphTab;


 