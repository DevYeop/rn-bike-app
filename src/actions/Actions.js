import { 
    ADD_FRIEND, 
    SAVE_USER_INFO_GOOGLE, 
    SAVE_USER_INFO_KAKAO, 
    ADD_RECORDED_ROUTE,
    SET_PRE_ROUTE_ITEMS,
    SET_CONTACT_ITEMS,
    RESET_STATE
 } from './types'
 
export const addFriend = friendsIndex => (
    {
        type: ADD_FRIEND,
        payload: friendsIndex, 
    } 
)

export const saveUserInfoGoogle = (userInfo) => (
    {
        type: SAVE_USER_INFO_GOOGLE,
        payload: userInfo, 
    } 
)

export const saveUserInfoKakao = (userInfo) => (
    {
        type: SAVE_USER_INFO_KAKAO,
        payload: userInfo, 
    } 
)

export const addRecordedRoute = recoredRouteData => (
    {
        type: ADD_RECORDED_ROUTE,
        payload: recoredRouteData, 
    } 
)

export const setPreRouteItems = preRouteItems => (
    {
        type: SET_PRE_ROUTE_ITEMS,
        payload: preRouteItems, 
    } 
)
 
export const setContactItems = contactList => (
    {
        type: SET_CONTACT_ITEMS,
        payload: contactList, 
    } 
)
  
export const resetState = reset => (
    {
        type: RESET_STATE,
        payload: reset, 
    } 
)
  