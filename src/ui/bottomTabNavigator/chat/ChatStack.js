import React, { Component } from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import ChatRoomList from './ChatRoomList'
import ChatScreen from './ChatScreen'
// import { AuthContext } from '../../../navigation/AuthProvider'
import { connect } from 'react-redux';
 
const ChatAppStack = createStackNavigator(); 
// const { logout } = useContext(AuthContext);

class HomeStack extends Component {

  render(){

    const userID = this.props.userInfo.id
 
    return (
      <ChatAppStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6646ee'
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 22
          }
        }}>
        <ChatAppStack.Screen
          name='Home'
          component={ChatRoomList}
          options={{ headerShown: false }}
          // options={({ navigation }) => ({
          //   headerRight: () => (
          //     <IconButton
          //       icon='message-plus'
          //       size={28}
          //       color='#ffffff'
          //       onPress={() => navigation.navigate('AddRoom')}
          //     />
          //   ),
          //   headerLeft: () => (
          //     <IconButton
          //       icon='logout-variant'
          //       size={28}
          //       color='#ffffff'
          //       onPress={() => logout()}
          //     />
          //   )
          // })}
        />
        <ChatAppStack.Screen
          name='Room'
          component={ChatScreen}  
          options={
            { headerShown: false }
            // ({ route }) => ({
            // title: route.params.thread.name }) 
        }
        />
      </ChatAppStack.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

export default connect(mapStateToProps)(HomeStack);
