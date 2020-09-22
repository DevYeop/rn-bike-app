/**
 * A reducer is a pure function that takes the previous state and an action as arguments and returns a new state. 
 * The reducer is instrumental in keeping the current state of friends updated throughout the app as it changes.
 */
import { combineReducers } from 'redux';
import { 
    ADD_FRIEND, 
    SAVE_USER_INFO_GOOGLE, 
    SAVE_USER_INFO_KAKAO,
    ADD_RECORDED_ROUTE } from '../actions/types'
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
  
            routeItem.push({ id: routeItem.length+1, routeCoordinates : action.payload})
          
            return Object.assign({}, state, routeItem)
            /**&
             * latlng 배열을 받는다 + 시간별 위치,거리,속도
             * 가장 첫번째와 마지막의 latlng을 출발 도착지로 설정한다
             * 경로상 가장 동서남북인 쪽으 각각 구하고 전체맵상 북서쪽 남동쪽을 구한다
             * 위에서 구한 값으로 지도의 배율을 맞춘다.
             * 경로상 중간으 ㅣ위치를 맵의 중간으로 잡는다
             * 출발 도착에 핀을 꽂는다
             */             

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