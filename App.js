import * as React from 'react';
import {
} from 'react-native';
import {
  NavigationContainer,
  View,
  Text
} from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTapNavigator from './src/ui/bottomTabNavigator/TabContainer/';

import rootReducer from './src/reducers/RootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import RequestLocationPermission from './src/lib/RequestLocationPermission'

import SettingTap from './src/ui/login/SettingTab';



const Stack = createStackNavigator();

// **** 리덕스 개발자도구 적용
const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, devTools);

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SettingTap"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTapNavigator" component={BottomTapNavigator} />
            <Stack.Screen name="SettingTap" component={SettingTap} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App;