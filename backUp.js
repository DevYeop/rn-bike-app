import * as React from 'react';
import {
} from 'react-native';
import {
  NavigationContainer,
  View,
  Text
} from '@react-navigation/native';
import BottomTapNavigator from './src/ui/bottomTabNavigator/TabContainer/';

import RequestLocationPermission from './src/lib/RequestLocationPermission'
import SettingTap from './src/ui/bottomTabNavigator/SettingTab';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userInfo: {},
    }
  }

  componentDidMount() {
    {RequestLocationPermission}
  }

  componentWillUnmount() {
  }

  parentFunction = (loggedIn, userInfo) => {
    console.log('로그인값 변경시작')
    this.setState({
      userInfo: userInfo,
      loggedIn: loggedIn,
    })
    alert('로그인?' + loggedIn + 'info?:'+ userInfo)
  }

  render() {

    if (this.state.loggedIn) {
      return (
        <NavigationContainer>
          <BottomTapNavigator userInfo={this.state.userInfo} />
        </NavigationContainer>
      )
    } else {
      return (
        <SettingTap functionCallFromParent={this.parentFunction.bind(this)} />
      )
    }
  }
}

export default App;