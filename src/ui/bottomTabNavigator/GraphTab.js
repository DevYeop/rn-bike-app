import * as React from 'react';
import {
} from 'react-native'; 
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack'; 
import GraphItems from '../graph/GraphItems';
import GraphDetail from '../graph/GraphDetail';
import ChatRoomListToShare from './chat/ChatRoomListToShare'

const GraphStack = createStackNavigator();
  
class GraphTab extends React.Component {

  render() {
    return ( 
          <GraphStack.Navigator
            initialRouteName="GraphItems"
            screenOptions={{ headerShown: false }}>
            <GraphStack.Screen name="GraphItems" component={GraphItems} />
            <GraphStack.Screen name="GraphDetail" component={GraphDetail} />
            <GraphStack.Screen name="ChatRoomListToShare" component={ChatRoomListToShare} />
          </GraphStack.Navigator>
    )
  }
}

export default GraphTab;