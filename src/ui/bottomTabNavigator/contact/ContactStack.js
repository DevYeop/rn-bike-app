import * as React from 'react';
import {
} from 'react-native'; 
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack'; 
import ContactTab from './ContactTab'; 
import UserProfile from './UserProfile'; 
import ChatScreen from '../chat/ChatScreen' 
 

const Stack = createStackNavigator();
  
class ContactStack extends React.Component {

  render() {
    return ( 
          <Stack.Navigator
            initialRouteName="ContactTab"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ContactTab" component={ContactTab} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </Stack.Navigator>
    )
  }
}

export default ContactStack;