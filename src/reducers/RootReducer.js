/**
 * A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. 
 * The reducer is instrumental in keeping the current state of friends updated throughout the app as it changes.
 */
import { combineReducers } from 'redux';
import { ADD_FRIEND, SAVE_USER_INFO } from '../actions/types'
/**
 * INITIAL_STATE variable with possible friends to add to your social network
 */
const INITIAL_SATTE = {

    user:{
        photo:'none',
        email:'none-email',
        name:'none-name',
        id:'none-id',
    },
  
}


const RootReducer = (state = INITIAL_SATTE, action) => {

    console.log(state)
    // console.log(action)

    switch (action.type) {
        /**
         * pulls the current and possible friends out of the previous state. 
         * Array.splice() retrieves the friend from the array of possible friends. 
         * Array.push adds the friend to array of current friends. After ther changes are made, the state is updated.
         */
        case ADD_FRIEND:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            const {
                current,
                possible,
            } = state;

            // Pull friend out of friends.possible
            // Note that action.payload === friendIndex
            const addedFriend = possible.splice(action.payload, 1);

            // And put friend in friends.current
            current.push(addedFriend);

            // Finally, update the redux state
            const newState = { current, possible };

            return newState;

        case SAVE_USER_INFO:
            return action.payload;

        default:
            return state
    }
}
 
/**
 * exporting friendsReducer as a property called friends.
 */
export default combineReducers({
    userInfo: RootReducer
})