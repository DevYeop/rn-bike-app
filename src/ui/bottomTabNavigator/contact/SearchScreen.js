
import React, { useState, useEffect } from 'react';

import { SafeAreaView, Text, StyleSheet, View, Image,ToastAndroid, Button } from 'react-native';
import { Searchbar  } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { bindActionCreators } from 'redux'
import { updateContactList } from '../../../actions/Actions'
import { connect } from 'react-redux'

const SearchScreen = ({userInfo, updateContactList, navigation}) => {
    const [search, setSearchQuery] = useState('')
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    
    const [id, setId] = useState('null')
    const [nickname, setNickname] = useState('')
    const [imageUri, setImageUrl] = useState('null')
   
    const onChangeSearch = query => setSearchQuery(query);

    const onSubmitEditing = () => {
        searchFriend()
    }

    async function searchFriend() {

        if(search==''){
            showToastWithGravity("찾는 유저의 이메일을 입력해 주세요.")
            return
        }

        const userInfoRef = await firestore().collection('userInfo')
        const snapshot = await userInfoRef.where('email', '==', search).get()

        let friendInfo = {}

        if(snapshot.size==0){
            showToastWithGravity("검색된 결과가 없습니다.")
            return
        }

        /**
         * todo : 검색된 유저가 없을 때 ui 처리해야함.
         */
        snapshot.forEach(doc => {
            friendInfo = doc.data()
        });

        setId(friendInfo.id)
        setNickname(friendInfo.nickname)
        setImageUrl(friendInfo.profile_image_url)
    }

    const addFirend = (id,nickname,imageUri) => {

        console.log('addFirend params id:', id)
        console.log('addFirend params nickname:', nickname)
        console.log('addFirend params imageUri:', imageUri)

        const newFriend = {
            id: id,
            nickname: nickname,
            profile_image_url: imageUri,
        }
         
        addFriendFireStore()

        updateContactList(newFriend)

        navigation.goBack()

        showToastWithGravity("친구가 추가되었습니다.")
  
    }

    const showToastWithGravity = (text) => {
        ToastAndroid.showWithGravity(
          text,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      };

    async function addFriendFireStore() {

        const userIndex = userInfo.id
        const collectionName = 'user' + userIndex
 
        const itemsRef = await firestore().collection(collectionName).doc('list').collection('contactList');
        
        itemsRef.doc(id).set(
            { 
                id: id,
                nickname: nickname,
                profile_image_url: imageUri,
            }
        );
 
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Searchbar
                    placeholder="친구의 email을 입력하세요"
                    onChangeText={onChangeSearch}
                    //   value={search}
                    onSubmitEditing={onSubmitEditing}
                />

            <View style={styles.container}>
                
                { // 검색한 유저의 프로필사진이 없는경우, 기본 프사를 표시한다.
                    imageUri ?
                    <Image style={styles.pic} source={{ uri: imageUri }} />
                    :
                    <Image style={styles.pic} source={require('../../../res/default-profile-image.png')} />
                }

                <Text style={{fontSize:20, marginTop:15, marginBottom:15}}>{nickname}</Text>
 
                { // 검색한 유저의 프로필사진이 없는경우, 기본 프사를 표시한다.
                    nickname!='' ?
                    <Button style={styles.button} title="    친구 추가    " onPress={()=>addFirend(id,nickname,imageUri)}/>
                    :
                    <Text></Text>
                }
 
            </View>
        </SafeAreaView>
    );
};


const mapStateToProps = (state) => {
    const { userInfo } = state
    return { userInfo }
  };
   
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateContactList
    }, dispatch)
  ); 
  
const styles = StyleSheet.create({
    button:{
        marginTop : 25,
        width: '90%', 
        color: '#fff',
        padding: 10,
        fontSize:30
    },
    container: {
        flex:1,
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent: 'center',
    },
    itemStyle: {
        padding: 10,
    },
    pic: {
        borderRadius: 60,
        width: 120,
        height: 120,
    },
});
 
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);