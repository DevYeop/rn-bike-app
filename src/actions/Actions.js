import { 
    ADD_FRIEND, 
    SAVE_USER_INFO_GOOGLE, 
    SAVE_USER_INFO_KAKAO, 
    ADD_RECORDED_ROUTE,
    SET_PRE_ROUTE_ITEMS,
    RESET_STATE,
    UPDATE_CONTACT_LIST,
    SET_CONTACT_LIST
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
  
export const resetState = reset => (
    {
        type: RESET_STATE,
        payload: reset, 
    } 
)

export const updateContactList = data => (
    {
        type: UPDATE_CONTACT_LIST,
        payload: data, 
    } 
)

export const setContactItems = reset => (
    {
        type: SET_CONTACT_LIST,
        payload: reset, 
    } 
)