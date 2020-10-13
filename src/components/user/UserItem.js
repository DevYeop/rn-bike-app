import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

const UserItem = data => {

    const imageUri = data.userInfo.profile_image_url
    const nickname = data.userInfo.nickname

    return (
        <TouchableOpacity>
            <View style={styles.row}>
                {
                    imageUri ?
                        <Image style={styles.pic} source={{ uri: imageUri }} />
                        :
                        <Image style={styles.pic} source={require('../../res/default-profile-image.png')} />
                }
                <View>
                    <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail"> {nickname} </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        padding: 10,
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 18,
        width: 170,
    }
})

export default UserItem