import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../settingScreen/FormInput';
import FormButton from '../settingScreen/FormButton';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const Stack = createStackNavigator();


export default class SettingTap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      pushData: [],
      loggedIn: false,
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '1038042430405-e2nl3grsb7aqt804d1tni51vkd7aaka1.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    });
  }
 
  childFunction = () => {
    return(
    this.props.functionCallFromParent(this.state.loggedIn, this.state.userInfo)
    )
}

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo, loggedIn: true });
      this.childFunction()
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      
      this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Title style={styles.titleText}>rn-bike-app</Title>
          <FormInput
            labelName='Email'
            value={this.state.email}
            autoCapitalize='none'
            onChangeText={userEmail => setEmail(userEmail)}
          />
          <FormInput
            labelName='Password'
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={userPassword => setPassword(userPassword)}
          />
          <FormButton
            title='로그인'
            modeValue='contained'
            labelStyle={styles.loginButtonLabel}
          />
          <TouchableOpacity style={{ marginTop: 10 }} activeOpacity={0.5}>
            <Image
              source={require('../../res/naverLoginButton.png')}
              style={styles.ImageIconStyle}
            />
          </TouchableOpacity>

          <View style={styles.sectionContainer}>
            <GoogleSigninButton
              style={{ width: 250, height: 50 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress} />
          </View>
          <View style={styles.buttonContainer}>
            {!this.state.loggedIn && <Text>You are currently logged out</Text>}
            {!this.state.loggedIn && <Button onPress={this.signOut}
              title="Signout"
              color="#841584">
            </Button>}
          </View>

          {this.state.loggedIn && <View>
            <View style={styles.listHeader}>
              <Text>User Info</Text>
            </View>
            <View style={styles.dp}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.photo }}
              />
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.name}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.email}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>ID</Text>
              <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.id}</Text>
            </View>
          </View>}

          <FormButton
            title='회원가입'
            modeValue='text'
            uppercase={false}
            labelStyle={styles.navButtonText}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  listHeader: {
    backgroundColor: '#eee',
    color: "#222",
    height: 44,
    padding: 12
  },
  detailContainer: {
    paddingHorizontal: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10
  },
  message: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  dp: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 16
  },
  ImageIconStyle: {
    height: 50,
    width: 250,
    resizeMode: 'stretch',
  },
});



// export default function SettingTap(props) {
//     return (
//       <Stack.Navigator initialRouteName='Login' headerMode='none'>
//         <Stack.Screen name='Login' component={LoginScreen} />
//         <Stack.Screen name='Signup' component={SignupScreen} />
//       </Stack.Navigator>
//     );
//   }