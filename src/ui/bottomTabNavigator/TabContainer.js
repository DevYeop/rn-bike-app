import * as React from 'react';

import ContactTab from './ContactTab';
import ChatTab from './ChatTab';
import RecrodTab from './RecordTap';
import GrahphTap from './GrahphTap';

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
    
  value="Value From Parent111";

  parentFunction=(data_from_child)=>{
    this.setState({
      value_key: data_from_child,
    })
    alert('StopRecord Called')
 }
  
  render() {
    return(
    <Tab.Navigator 
      initialRouteName="ContactTab"
      activeColor="#ffffff"
      labelStyle={{ fontSize: 12 }}>
      <Tab.Screen
        name='Contact'
        children={()=><ContactTab
          loggedIn={this.props.loggedIn} 
          userInfo={this.props.userInfo}
          />}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="contacts" color={color} size={26} />
          ),
        }} />
        {this.props.loggedIn && alert('전달받은 loggedIn:'+this.props.loggedIn)}
      <Tab.Screen
        name="ChatTab"
        component={ChatTab}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />
          ),
        }} />
        <Tab.Screen
          name="RecrodTab"
          children={()=><RecrodTab 
            functionCallFromParent={this.parentFunction.bind(this)}
            />}
          options={{
            tabBarLabel: 'Record',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="record-rec" color={color} size={26} />
            ),
          }}
        />
      <Tab.Screen
        name="GrahphTap"
        children={()=><GrahphTap 
          valueFromParent={this.state.value_key}
          />}
        options={{
          tabBarLabel: 'Graph',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-areaspline" color={color} size={26} />
          ),
        }
      }
      />
      
    </Tab.Navigator>
  )} ;
}

export default TabContainer;