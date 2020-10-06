import * as React from 'react';
import {
  Button, 
  View,
} from 'react-native'; 
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack'; 
import ContactTab from './ContactTab'; 
import UserProfile from './UserProfile'; 
import ChatScreen from '../chat/ChatScreen'
import { IconButton } from 'react-native-paper';

const Stack = createStackNavigator();
  
class ContactStack extends React.Component {

  render() {
    return ( 
          <Stack.Navigator
            initialRouteName="ContactTab">
            
            <Stack.Screen name="ContactTab" 
            component={ContactTab}
            options={{
              headerLeft: null,
              headerTitle: null,
              headerRight: null,
            }}
               
            />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </Stack.Navigator>
    )
  }
}

export default ContactStack;