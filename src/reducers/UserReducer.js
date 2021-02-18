import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE,

    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE,

    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,

    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,

    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,

    OTHERS_PROFILE_REQUEST,
    OTHERS_PROFILE_SUCCESS,
    OTHERS_PROFILE_FAILURE,

    HOME_PAGE_REQUEST,
    HOME_PAGE_SUCCESS,
    HOME_PAGE_FAILURE,

    COMMENT_ON_POST_REQUEST,
    COMMENT_ON_POST_SUCCESS,
    COMMENT_ON_POST_FAILURE,

    FOLLOWER_LIST_REQUEST,
    FOLLOWER_LIST_SUCCESS,
    FOLLOWER_LIST_FAILURE,

    FOLLOWING_LIST_REQUEST,
    FOLLOWING_LIST_SUCCESS,
    FOLLOWING_LIST_FAILURE,

    REACTION_ON_POST_REQUEST,
    REACTION_ON_POST_SUCCESS,
    REACTION_ON_POST_FAILURE,

    ACTIVITY_LIST_REQUEST,
    ACTIVITY_LIST_SUCCESS,
    ACTIVITY_LIST_FAILURE,

    FEATURED_SONG_SEARCH_REQUEST,
    FEATURED_SONG_SEARCH_SUCCESS,
    FEATURED_SONG_SEARCH_FAILURE,

    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAILURE,

    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,

    COUNTRY_CODE_REQUEST,
    COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE,

    TOP_5_FOLLOWED_USER_REQUEST,
    TOP_5_FOLLOWED_USER_SUCCESS,
    TOP_5_FOLLOWED_USER_FAILURE,

    GET_USERS_FROM_CONTACTS_REQUEST,
    GET_USERS_FROM_CONTACTS_SUCCESS,
    GET_USERS_FROM_CONTACTS_FAILURE,

    DUMMY_ACTION_REQUEST,
    DUMMY_ACTION_SUCCESS,

    FOLLOWING_SEARCH_REQUEST,
    FOLLOWING_SEARCH_SUCCESS,

    FOLLOWER_SEARCH_REQUEST,
    FOLLOWER_SEARCH_SUCCESS,

    ASYNC_STORAGE_CLEAR
}
    from '../action/TypeConstants';
import moment from 'moment'
import _ from "lodash"

const initialState = {
    status: "",
    error: {},
    loginResponse: {},
    signupResponse: {},
    userProfileResp: {},
    editProfileResp: {},
    userSearch: [],
    followUnfollowResp: {},
    othersProfileresp: {},
    postData: [],
    currentPage: "",
    commentResp: {},
    followerData: [],
    followerDataCopy: [], //for manual searching
    followingData: [],
    followingDataCopy: [], // for manual searching
    reactionResp: {},
    activityListPrevious: [],
    activityListToday: [],
    sendSongUserSearch: [],
    featuredSongSearchResp: [],
    userSearchFromHome: [],
    userLogoutResp: {},
    countryCodeRequest: [],
    countryCodeOject: [],
    top5FollowedResponse: [],
    getUsersFromContact: [],
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case USER_LOGIN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                status: action.type,
                loginResponse: action.data,
            };

        case USER_LOGIN_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_SIGNUP_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_SIGNUP_SUCCESS:
            return {
                ...state,
                status: action.type,
                signupResponse: action.data
            };

        case USER_SIGNUP_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                userProfileResp: action.data
            };

        case USER_PROFILE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case EDIT_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                editProfileResp: action.data
            };

        case EDIT_PROFILE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_SEARCH_REQUEST:
            return {
                ...state,
                userSearch: [],
                status: action.type
            };

        case USER_SEARCH_SUCCESS:

            if (action.sendSong) {
                return {
                    ...state,
                    status: action.type,
                    sendSongUserSearch: action.data
                };

            } else {
                return {
                    ...state,
                    status: action.type,
                    userSearch: action.data
                };
            }

        case USER_SIGNUP_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_FOLLOW_UNFOLLOW_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_FOLLOW_UNFOLLOW_SUCCESS:
            return {
                ...state,
                status: action.type,
                followUnfollowResp: action.data
            };

        case USER_FOLLOW_UNFOLLOW_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case OTHERS_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type,
                othersProfileresp: []
            };

        case OTHERS_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                othersProfileresp: action.data
            };

        case OTHERS_PROFILE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case HOME_PAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case HOME_PAGE_SUCCESS:

            if (action.offset === 1) {
                return {
                    ...state,
                    status: action.type,
                    postData: _.sortBy(action.data, "createdAt").reverse(),
                    currentPage: action.currentpage
                };
            }
            else {
                let array = [...state.postData, ...action.data];
                console.log(array);
                return {
                    ...state,
                    status: action.type,
                    postData: _.sortBy(array, "createdAt").reverse(),
                    currentPage: action.currentpage
                }
            }

        case HOME_PAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case COMMENT_ON_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case COMMENT_ON_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                commentResp: action.data,
            };

        case COMMENT_ON_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case FOLLOWER_LIST_REQUEST:
            return {
                ...state,
                status: action.type,
                followerData: [],
                followerDataCopy: []
            };

        case FOLLOWER_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                followerData: action.data,
                followerDataCopy: action.data
            };

        case FOLLOWER_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case FOLLOWING_LIST_REQUEST:
            return {
                ...state,
                status: action.type,
                followingData: [],
                followingDataCopy: []
            };

        case FOLLOWING_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                followingData: action.data,
                followingDataCopy: action.data
            };

        case FOLLOWING_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case REACTION_ON_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case REACTION_ON_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                reactionResp: action.data,
            };

        case REACTION_ON_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case ACTIVITY_LIST_REQUEST:
            return {
                ...state,
                status: action.type,
                activityListPrevious: [],
                activityListToday: []
            };

        case ACTIVITY_LIST_SUCCESS:

            let previous = [];
            let today = [];
            let time = moment().format('MM-DD-YYYY')


            action.data.map((item, index) => {
                let postTime = moment(item.createdAt).format('MM-DD-YYYY')

                if (postTime < time) {
                    previous.push(item)
                }
                else {
                    today.push(item)
                }
            });

            return {
                ...state,
                status: action.type,
                activityListPrevious: previous,
                activityListToday: today
            };

        case ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case FEATURED_SONG_SEARCH_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case FEATURED_SONG_SEARCH_SUCCESS:
            return {
                ...state,
                status: action.type,
                featuredSongSearchResp: action.data
            };

        case FEATURED_SONG_SEARCH_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_LOGOUT_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                status: action.type,
                userLogoutResp: action.data
            };

        case USER_LOGOUT_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_USER_FROM_HOME_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_USER_FROM_HOME_SUCCESS:
            return {
                ...state,
                status: action.type,
                userSearchFromHome: action.data
            };

        case GET_USER_FROM_HOME_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case COUNTRY_CODE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case COUNTRY_CODE_SUCCESS:
            return {
                ...state,
                status: action.type,
                countryCodeRequest: action.data,
                countryCodeOject: action.data1
            };

        case COUNTRY_CODE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };
        case TOP_5_FOLLOWED_USER_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case TOP_5_FOLLOWED_USER_SUCCESS:
            return {
                ...state,
                status: action.type,
                top5FollowedResponse: action.data,
            };

        case TOP_5_FOLLOWED_USER_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_USERS_FROM_CONTACTS_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_USERS_FROM_CONTACTS_SUCCESS:
            return {
                ...state,
                status: action.type,
                getUsersFromContact: action.data
            };

        case GET_USERS_FROM_CONTACTS_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case DUMMY_ACTION_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case DUMMY_ACTION_SUCCESS:
            return {
                ...state,
                status: action.type,
            };

        case FOLLOWER_SEARCH_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case FOLLOWER_SEARCH_SUCCESS:
            return {
                ...state,
                status: action.type,
                followerData: action.data
            };

        case FOLLOWING_SEARCH_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case FOLLOWING_SEARCH_SUCCESS:
            return {
                ...state,
                status: action.type,
                followingData: action.data
            };

        case ASYNC_STORAGE_CLEAR:
            return initialState;

        default:
            return state;

    }
}

export default UserReducer;