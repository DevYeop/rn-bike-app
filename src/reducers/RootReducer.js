/**
 * A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. 
 * The reducer is instrumental in keeping the current state of friends updated throughout the app as it changes.
 */
import { combineReducers } from 'redux';
import { 
    ADD_FRIEND, 
    SAVE_USER_INFO_GOOGLE, 
    SAVE_USER_INFO_KAKAO,
    ADD_RECORDED_ROUTE,
    LOAD_ROUTE_ITEMS
} from '../actions/types'

/**
 * INITIAL_STATE variable with possible friends to add to your social network
 */
const INITIAL_SATTE = { 
    id:'',
    email:'',
    nickname:'',
    profile_image_url:'',
    routeItem:[],
}
 
const RootReducer = (state = INITIAL_SATTE, action) => {

    console.log('리듀서 state.status')
    console.log(state)
    console.log('리듀서 action.type')
    console.log(action.type)
    console.log('리듀서 action.payload')
    console.log(action.payload)
    
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

        case SAVE_USER_INFO_GOOGLE:

            const userInfo = action.payload

            var {id, email, name:nickname, photo:profile_image_url} = userInfo.user

            const googleUser = {id, email, nickname, profile_image_url}

            return Object.assign({}, state, googleUser)


        case SAVE_USER_INFO_KAKAO:

            var {id, email, nickname, profile_image_url} = action.payload

            const kakaoUserInfo = {id, email, nickname, profile_image_url}

            return Object.assign({}, state, kakaoUserInfo)
 

        case ADD_RECORDED_ROUTE:
 
            let {routeItem} = state

            const {routeCoordinates} = action.payload
            const {boundInfo} = action.payload
            const {deltaInfo} = action.payload
            const {centerInfo} = action.payload
            const {distance} = action.payload
            const {lapTime} = action.payload
            const {speedArray} = action.payload
            const {avgSpeed} = action.payload
            const {itemIndex} = action.payload 
            routeItem.push({ 
                itemIndex: itemIndex,
                boundInfo : boundInfo ,
                deltaInfo : deltaInfo ,
                centerInfo : centerInfo,
                avgSpeed : avgSpeed,
                distance : distance,
                lapTime : lapTime,
                speedArray : speedArray,
                routeCoordinates : routeCoordinates})
          
            return Object.assign({}, state, routeItem)

    
        case LOAD_ROUTE_ITEMS :

        /**
         * fireStore로부터 받은 아이템의 정보로,
         * state값을 덮어준다.
         */
            const routeItems = action.payload
        
            return Object.assign({}, routeItems)





        default:
            return state
    }
}

/**
 * exporting friendsReducer as a property called friends.
 */
export default combineReducers({
    userInfo: RootReducer,
    //todo : reducer도메인별로 분할하고 여기서 합쳐야함,
})