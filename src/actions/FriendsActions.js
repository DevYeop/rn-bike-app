import { ADD_FRIEND, SAVE_USER_INFO } from './types'

/**
 * Actions are JavaScript objects that represent payloads of information that send data from your application to the Redux store.
 * 
 * Actions have a type and an optional payload. In this tutorial, the type will be ADD_FRIEND, 
 * and the payload will be the array index of a friend you are adding into the current friends array.
 * 
 * When a user clicks on a friend, this code will retrieve the friendsIndex from the friends.possible array. 
 * Now you will need to use that index to move this friend into the friends.current array.
 * @param {*} friendsIndex 
 */
export const addFriend = friendsIndex => (
    {
        type: ADD_FRIEND,
        payload: friendsIndex, 
    } 
)

export const saveUserInfo = userInfo => (
    {
        type: SAVE_USER_INFO,
        payload: userInfo, 
    } 
)