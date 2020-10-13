
import firestore from '@react-native-firebase/firestore';
 
export const addRouteItem = (routeItem, userIndex) => {

    const itemIndex = routeItem.itemIndex + ''

    const itemsRef = firestore().collection('user'+userIndex).doc('list').collection('routeItems');
    itemsRef.doc(itemIndex).set({routeItem})
}

export const loadRouteItem = async (userIndex) => {
 
    let routeItems = []  

    const itemsRef = await firestore().collection('user'+userIndex).doc('list').collection('routeItems').get()
    itemsRef.docs.map(doc => routeItems.push(doc.data()));

    return routeItems
}

export const loadContactList = async (userIndex) => {
   
    let contactList = []

    const snapshot = await firestore().collection('user'+userIndex).doc('list').collection('contactList').get()
    snapshot.docs.map(doc => contactList.push(doc.data()));

    return contactList
}