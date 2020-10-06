
import React, { useState, useEffect } from 'react';

import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';



import { bindActionCreators } from 'redux';
import { resetState } from '../../../actions/Actions'

import { connect } from 'react-redux';

const SearchScreen = ({userInfo}) => {
    const [search, setSearchQuery] = useState('')
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    
    const [id, setId] = useState('null')
    const [nickname, setNickname] = useState('null')
    const [imageUri, setImageUrl] = useState('null')

    useEffect(() => {

    }, []);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };


    const onChangeSearch = query => setSearchQuery(query);

    const onSubmitEditing = () => {
        searchFriend()
    }

    async function searchFriend() {

        const userInfoRef = await firestore().collection('userInfo')
        const snapshot = await userInfoRef.where('email', '==', search).get()

        let friendInfo = {}

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

        // todo : 추가 완료되면 토스트라도 띄워야 함.
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
                

                <Image style={styles.pic} source={{ uri: imageUri }} />

                <Text>{nickname}</Text>

                <Button onPress={addFriendFireStore}>친구 추가</Button>

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
    //   resetState
    // steate에 컨택트 리스트 추가하는 거 추가해야하마
    }, dispatch)
  );

const styles = StyleSheet.create({
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