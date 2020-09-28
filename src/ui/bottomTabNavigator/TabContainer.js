import * as React from 'react';

import ContactStack from './contact/ContactStack';
import ChatStack from './chat/ChatStack'
import RecrodTab from './RecordTap';
import GraphTab from './GraphTab';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

class TabContainer extends React.Component {

  constructor(props){
    super(props);
    this.state={
      userInfo:{},
      value_key:{},
      value:'',
    }
  }
     
  render() {
    return(
    <Tab.Navigator 
      initialRouteName="ContactStack"
      activeColor="#ffffff"
      labelStyle={{ fontSize: 12 }}>
      <Tab.Screen
        name='ContactStack'
        children={()=><ContactStack 
          />}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="contacts" color={color} size={26} />
          ),
        }} />
        {this.props.loggedIn && alert('전달받은 loggedIn:'+this.props.loggedIn)}
      <Tab.Screen
        name="ChatStack"
        component={ChatStack}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />
          ),
        }} />
        <Tab.Screen
          name="RecrodTab"
          children={()=><RecrodTab  

            />}
          options={{
            tabBarLabel: 'Record',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="record-rec" color={color} size={26} />
            ),
          }}
        />
      <Tab.Screen
        name="GraphTab"
        children={()=><GraphTab 
        
          />}
        options={{
          tabBarLabel: 'Graph',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-areaspline" color={color} size={26} />
          ),
        }
      }/> 
      
    </Tab.Navigator>
  )} ;
}

export default TabContainer;