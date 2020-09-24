import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View, StatusBar, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { saveUserInfoGoogle } from '../../actions/FriendsActions'
import { bindActionCreators } from 'redux'; 

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import KakaoLoginButton from './KakaLoginButton'

import firestore from '@react-native-firebase/firestore'; 

const Stack = createStackNavigator();


class SettingTap extends React.Component {

  constructor(props) {
    super(props);
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

      const collectionID = this.setFireStoreCollection(userInfo)
      
      this.props.saveUserInfoGoogle(userInfo, collectionID)
      
      this.props.navigation.navigate('BottomTapNavigator')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE')
      } else {
        console.error(error);
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  setFireStoreCollection = (userInfo) => {
    
    console.log('userInfo')
    console.log(userInfo.user.id)

    const collectionID = userInfo.user.id
    firestore().collection(collectionID);

    return collectionID;
  }
  
  

  setFireStoreInfo() {

    const citiesRef = firestore().collection('cities1');

    citiesRef.doc("SF").set({
      name: "San Francisco", state: "CA", country: "USA",
      capital: false, population: 860000,
      regions: ["west_coast", "norcal"]
    });
    citiesRef.doc("LA").set({
      name: "Los Angeles", state: "CA", country: "USA",
      capital: false, population: 3900000,
      regions: ["west_coast", "socal"]
    });
    citiesRef.doc("DC").set({
      name: "Washington, D.C.", state: null, country: "USA",
      capital: true, population: 680000,
      regions: ["east_coast"]
    });
    citiesRef.doc("TOK").set({
      name: "Tokyo", state: null, country: "Japan",
      capital: true, population: 9000000,
      regions: ["kanto", "honshu"]
    });
    citiesRef.doc("BJ").set({
      name: "Beijing", state: null, country: "China",
      capital: true, population: 21500000,
      regions: ["jingjinji", "hebei"]
    });


  }


  
  getFireStoreInfo = () => {

    const citiesRef = firestore().collection('cities1').doc("SF");

    citiesRef.get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
 
          <Button title='save'onPress={()=>this.setFireStoreInfo()}/>
          <Button title='load'onPress={()=>this.getFireStoreInfo()}/>
        
          <GoogleSigninButton
            style={{ width: 250, height: 50 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}/>
          <KakaoLoginButton navigation={this.props.navigation} />
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
    saveUserInfoGoogle,
  }, dispatch)
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingTap);