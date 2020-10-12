
import firestore from '@react-native-firebase/firestore';

export const addFriend = friendsIndex => (
    {
        type: ADD_FRIEND,
        payload: friendsIndex, 
    } 
)

export const test = () => {
    console.log('testtest')
}
 
/**
 * 유저의 새로 녹화된 드라이빙 코스를, firestore에 추가
 * @param {*} routeItem 
 * @param {*} userIndex 
 */
export const addRouteItem = (routeItem, userIndex) => {

    const itemIndex = routeItem.itemIndex + ''

    const itemsRef = firestore().collection('user'+userIndex).doc('list').collection('routeItems');

    itemsRef.doc(itemIndex).set(
        { routeItem }
    ).then(console.log(userIndex + '유저에게 아이템이 저장됨.'))
}