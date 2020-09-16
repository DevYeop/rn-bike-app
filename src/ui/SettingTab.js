import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { saveUserInfo } from '../actions/FriendsActions'
import { bindActionCreators } from 'redux';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const Stack = createStackNavigator();

class SettingTap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      this.setState({ userInfo: userInfo, loggedIn: true });
      this.props.saveUserInfo(userInfo)
      this.props.navigation.navigate('BottomTapNavigator')
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED')
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS')
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE')
        // play services not available or outdated
      } else {
        console.error(error);
        // some other error happened
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Remember to remove the user from your app's state as well
      this.setState({ user: null, loggedIn: false }); 
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>

            <GoogleSigninButton
              style={{ width: 250, height: 50 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress} 
              />
          </View>

          <View style={styles.buttonContainer}>
            {!this.state.loggedIn && <Text>You are currently logged out</Text>}
            {!this.state.loggedIn && <Button onPress={this.signOut}
              title="Signout"
              color="#841584">
            </Button>}
          </View>



          {this.state.loggedIn && 
          <View>
            <View style={styles.listHeader}>
              <Text>User Info</Text>
            </View>
            <View style={styles.dp}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: this.props.userInfo.user.photo }}
              />
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.message}>{ this.props.userInfo.user.name}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.message}>{ this.props.userInfo.user.email}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>ID</Text>
              <Text style={styles.message}>{ this.props.userInfo.user.id}</Text>
            </View>
          </View>}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveUserInfo,
  }, dispatch)
);

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

export default connect(mapStateToProps, mapDispatchToProps)(SettingTap);