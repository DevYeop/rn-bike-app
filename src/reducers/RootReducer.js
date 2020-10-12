import { combineReducers } from 'redux';
import {
    ADD_FRIEND,
    SAVE_USER_INFO_GOOGLE,
    SAVE_USER_INFO_KAKAO,
    ADD_RECORDED_ROUTE,
    SET_PRE_ROUTE_ITEMS,
    RESET_STATE,
    UPDATE_CONTACT_LIST,
    SET_CONTACT_LIST
} from '../actions/types'

const INITIAL_SATTE = {
    id: '',
    email: '',
    nickname: '',
    profile_image_url: '',
    routeItem: [],
    contactList: [],
}

const RootReducer = (state = INITIAL_SATTE, action) => {

    console.log('리듀서 state.status')
    console.log(state)
    console.log('리듀서 action.type')
    console.log(action.type)
    console.log('리듀서 action.payload')
    console.log(action.payload)

    switch (action.type) { 

        case ADD_FRIEND: 
            const {
                current,
                possible,
            } = state;
 
            const addedFriend = possible.splice(action.payload, 1);
 
            current.push(addedFriend);
 
            const newState = { current, possible };

            return newState;

        case SAVE_USER_INFO_GOOGLE:

            const userInfo = action.payload

            var { id, email, name: nickname, photo: profile_image_url } = userInfo.user

            const googleUser = { id, email, nickname, profile_image_url }

            return Object.assign({}, state, googleUser)


        case SAVE_USER_INFO_KAKAO:

            var { id, email, nickname, profile_image_url } = action.payload

            const kakaoUserInfo = { id, email, nickname, profile_image_url }

            return Object.assign({}, state, kakaoUserInfo)
 
        case ADD_RECORDED_ROUTE:

            var { routeItem } = state

            /**
             * todo : 하나로 묶자
             */
            const { routeCoordinates } = action.payload
            const { boundInfo } = action.payload
            const { deltaInfo } = action.payload
            const { centerInfo } = action.payload
            const { distance } = action.payload
            const { lapTime } = action.payload
            const { speedArray } = action.payload
            const { avgSpeed } = action.payload
            const { itemIndex } = action.payload

            routeItem.push({
                itemIndex: itemIndex,
                boundInfo: boundInfo,
                deltaInfo: deltaInfo,
                centerInfo: centerInfo,
                avgSpeed: avgSpeed,
                distance: distance,
                lapTime: lapTime,
                speedArray: speedArray,
                routeCoordinates: routeCoordinates
            })

            return Object.assign({}, state, routeItem)


        case SET_PRE_ROUTE_ITEMS: // 로그인한 유저가 가지고 있던 녹화된 코스들을 저장한다.

            let newRouteItem = []
            const receivedRouteItems = action.payload

            for (var i = 0; i < receivedRouteItems.length; i++) {

                newRouteItem.push({
                    itemIndex: receivedRouteItems[i].routeItem.itemIndex,
                    boundInfo: receivedRouteItems[i].routeItem.boundInfo,
                    deltaInfo: receivedRouteItems[i].routeItem.deltaInfo,
                    centerInfo: receivedRouteItems[i].routeItem.centerInfo,
                    avgSpeed: receivedRouteItems[i].routeItem.avgSpeed,
                    distance: receivedRouteItems[i].routeItem.distance,
                    lapTime: receivedRouteItems[i].routeItem.lapTime,
                    speedArray: receivedRouteItems[i].routeItem.speedArray,
                    routeCoordinates: receivedRouteItems[i].routeItem.routeCoordinates
                })
            }

            return Object.assign({}, state, { routeItem: newRouteItem })

        case SET_CONTACT_LIST:  // 로그인한 유저가 가지고 있던 친구목록을 저장한다.

            let newContactList = []
            const receivedContactList = action.payload

            for (let i = 0; i < receivedContactList.length; i++) {
                newContactList.push({
                    id: receivedContactList[i].id,
                    nickname: receivedContactList[i].nickname,
                    profile_image_url: receivedContactList[i].profile_image_url,
                })
            }

            return Object.assign({}, state, { contactList: newContactList })
 
            
        case UPDATE_CONTACT_LIST:

            const { contactList } = state
            const addedContactList = action.payload

            contactList.push(addedContactList)
  
            return Object.assign({}, state, contactList)


        case RESET_STATE:

            return state


        default:

            return state
    }
}
 
export default combineReducers({
    userInfo: RootReducer,
    //todo : reducer도메인별로 분할하고 여기서 합쳐야함,
})