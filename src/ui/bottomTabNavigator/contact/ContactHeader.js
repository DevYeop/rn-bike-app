import React, { Component } from 'react';
import {
    View,
    TouchableHighlight,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactHeader = ({ navigation }) => {

    function gotoSearchFriend() {
        navigation.navigate('ChatScreen')
    }

    return (


 



        <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight onPress={gotoSearchFriend}>
                <MaterialCommunityIcons name="contacts" color={'#03fc90'} size={26} />
            </TouchableHighlight>
            {/* <MaterialCommunityIcons name="contacts" color={'#03fc90'} size={26} /> */}

        </View>
    )


}

export default ContactHeader