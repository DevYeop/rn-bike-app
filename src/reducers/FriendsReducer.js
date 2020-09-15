/**
 * A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. 
 * The reducer is instrumental in keeping the current state of friends updated throughout the app as it changes.
 */
import { combineReducers } from 'redux';

/**
 * INITIAL_STATE variable with possible friends to add to your social network
 */
const INITIAL_SATTE = {
    current: [],
    possible: [
        'Alice',
        'Bob',
        'Yeope'
    ]
}

const friendsReducer = (state = INITIAL_SATTE, action) => {
    switch (action.type) {
        /**
         * pulls the current and possible friends out of the previous state. 
         * Array.splice() retrieves the friend from the array of possible friends. 
         * Array.push adds the friend to array of current friends. After ther changes are made, the state is updated.
         */
        case 'ADD_FRIEND':
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
        default:
            return state
    }
}

/**
 * exporting friendsReducer as a property called friends.
 * 이 문법은 또 뭐람...
 */
export default combineReducers({
    friends: friendsReducer
})