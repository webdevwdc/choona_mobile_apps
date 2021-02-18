import {
    USER_LOGIN_REQUEST,
    USER_SIGNUP_REQUEST,
    USER_PROFILE_REQUEST,
    EDIT_PROFILE_REQUEST,
    USER_SEARCH_REQUEST,
    USER_FOLLOW_UNFOLLOW_REQUEST,
    OTHERS_PROFILE_REQUEST,
    HOME_PAGE_REQUEST,
    COMMENT_ON_POST_REQUEST,
    FOLLOWER_LIST_REQUEST,
    FOLLOWING_LIST_REQUEST,
    REACTION_ON_POST_REQUEST,
    ACTIVITY_LIST_REQUEST,
    FEATURED_SONG_SEARCH_REQUEST,
    USER_LOGOUT_REQUEST,
    GET_USER_FROM_HOME_REQUEST,
    COUNTRY_CODE_REQUEST,
    TOP_5_FOLLOWED_USER_REQUEST,
    GET_USERS_FROM_CONTACTS_REQUEST,
    DUMMY_ACTION_REQUEST,
    FOLLOWER_SEARCH_REQUEST,
    FOLLOWING_SEARCH_REQUEST,
}
    from './TypeConstants';

export const loginRequest = (payload) => ({
    type: USER_LOGIN_REQUEST,
    payload
});

export const signupRequest = (payload) => ({
    type: USER_SIGNUP_REQUEST,
    payload
});

export const getProfileRequest = () => ({
    type: USER_PROFILE_REQUEST,
});

export const editProfileRequest = (payload) => ({
    type: EDIT_PROFILE_REQUEST,
    payload
});

export const userSearchRequest = (payload, sendSong) => ({
    type: USER_SEARCH_REQUEST,
    payload,
    sendSong
});

export const userFollowUnfollowRequest = (payload) => ({
    type: USER_FOLLOW_UNFOLLOW_REQUEST,
    payload
});

export const othersProfileRequest = (id) => ({
    type: OTHERS_PROFILE_REQUEST,
    id
});

export const homePageReq = (offset) => ({
    type: HOME_PAGE_REQUEST,
    offset
});

export const commentOnPostReq = (payload) => ({
    type: COMMENT_ON_POST_REQUEST,
    payload
});

export const followerListReq = (usertype, id) => ({
    type: FOLLOWER_LIST_REQUEST,
    usertype,
    id
});

export const followingListReq = (usertype, id) => ({
    type: FOLLOWING_LIST_REQUEST,
    usertype,
    id
});

export const reactionOnPostRequest = (payload) => ({
    type: REACTION_ON_POST_REQUEST,
    payload
});

export const activityListReq = () => ({
    type: ACTIVITY_LIST_REQUEST,
});

export const featuredSongSearchReq = (text) => ({
    type: FEATURED_SONG_SEARCH_REQUEST,
    text
});

export const userLogoutReq = () => ({
    type: USER_LOGOUT_REQUEST
});

export const getUsersFromHome = (payload) => ({
    type: GET_USER_FROM_HOME_REQUEST,
    payload
});

export const getCountryCodeRequest = () =>({
    type: COUNTRY_CODE_REQUEST,
});

export const getTop5FollowedUserRequest = () =>({
    type: TOP_5_FOLLOWED_USER_REQUEST,
});

export const getUsersFromContacts = (payload) => ({
    type: GET_USERS_FROM_CONTACTS_REQUEST,
    payload
});

export const dummyRequest = () => ({
    type : DUMMY_ACTION_REQUEST
});

export const followerSearchReq = (search) => ({
    type : FOLLOWER_SEARCH_REQUEST,
    search
});

export const followingSearchReq = (search) => ({
    type : FOLLOWING_SEARCH_REQUEST,
    search
});

