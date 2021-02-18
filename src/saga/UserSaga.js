import { put, call, fork, takeLatest, all, select } from 'redux-saga/effects';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    ASYNC_STORAGE_SUCCESS,
    ASYNC_STORAGE_CLEAR,

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

    GET_CHAT_LIST_REQUEST,
    GET_CHAT_LIST_SUCCESS,
    GET_CHAT_LIST_FAILURE,

    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAILURE,

    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,

    COUNTRY_CODE_REQUEST,
    COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE,

    TOP_5_FOLLOWED_USER_SUCCESS,
    TOP_5_FOLLOWED_USER_FAILURE,
    TOP_5_FOLLOWED_USER_REQUEST,

    GET_USERS_FROM_CONTACTS_REQUEST,
    GET_USERS_FROM_CONTACTS_SUCCESS,
    GET_USERS_FROM_CONTACTS_FAILURE,

    DUMMY_ACTION_REQUEST,
    DUMMY_ACTION_SUCCESS,

    FOLLOWING_SEARCH_REQUEST,
    FOLLOWING_SEARCH_SUCCESS,

    FOLLOWER_SEARCH_REQUEST,
    FOLLOWER_SEARCH_SUCCESS

} from '../action/TypeConstants';
import { postApi, getApi, getSpotifyApi, getAppleDevelopersToken } from "../utils/helpers/ApiRequest"
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';
import { getSpotifyToken } from '../utils/helpers/SpotifyLogin'
import { getAppleDevToken } from '../utils/helpers/AppleDevToken';
import _ from 'lodash';


const getItems = (state) => state.TokenReducer
const userReducer = (state) => state.UserReducer

export function* loginAction(action) {

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
    }

    try {

        const response = yield call(postApi, `user/signin`, action.payload, header)

        if (response.data.status === 200) {

            yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({
                "token": response.data.token,
                "registerType": response.data.data.register_type
            }))

            yield put({ type: USER_LOGIN_SUCCESS, data: response.data.data });
            yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType: response.data.data.register_type })


        } else {
            yield put({ type: USER_LOGIN_FAILURE, error: response.data })
        }

    } catch (error) {

        yield put({ type: USER_LOGIN_FAILURE, error: error })

    }
};

export function* UserSignUpAction(action) {
    try {

        const header = {
            Accept: 'application/json',
            contenttype: 'multipart/formdata',
        };

        const response = yield call(postApi, 'user/signup', action.payload, header)

        if (response.status === 201)
            yield put({ type: USER_SIGNUP_FAILURE, error: response.data });
        else {
            yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({
                "token": response.data.token,
                "registerType": response.data.data.register_type
            }))

            yield put({ type: USER_SIGNUP_SUCCESS, data: response.data.data });
            yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType: response.data.data.register_type })
        }



    } catch (error) {
        yield put({ type: USER_SIGNUP_FAILURE, error: error })
    }
};


export function* userProfileAction(action) {
    try {
        const items = yield select(getItems)

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, 'user/profile', Header);
        yield put({ type: USER_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: USER_PROFILE_FAILURE, error: error })
    }
};


export function* editProfileAction(action) {
    try {
        const items = yield select(getItems)

        const Header = {
            Accept: 'application/json',
            contenttype: 'multipart/formdata',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'user/profile/update', action.payload, Header);

        if (response.status === 201)
            yield put({ type: EDIT_PROFILE_FAILURE, error: response.data });
        else
            yield put({ type: EDIT_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: EDIT_PROFILE_FAILURE, error: error })
    }
};


export function* userSearchAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'user/search', action.payload, Header)
        yield put({ type: USER_SEARCH_SUCCESS, data: response.data.data, sendSong: action.sendSong })

    } catch (error) {
        yield put({ type: USER_SEARCH_FAILURE, error: error })
    }
};


export function* userFollowOrUnfollowAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'follower/user/store', action.payload, Header);
        yield put({ type: USER_FOLLOW_UNFOLLOW_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: USER_FOLLOW_UNFOLLOW_FAILURE, error: error })
    }
};


export function* othersProfileAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, `user/profile/${action.id}`, Header);
        yield put({ type: OTHERS_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: OTHERS_PROFILE_FAILURE, error: error })
    }
};


export function* homePageAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, `post/list?page=${action.offset}`, Header);

        const chatResponse = yield call(getApi, 'chat/list', Header)
        yield put({ type: GET_CHAT_LIST_SUCCESS, data: chatResponse.data.data });

        yield put({ type: HOME_PAGE_SUCCESS, data: response.data.data, offset: action.offset, currentpage: response.data.page });
        //yield put({ type: GET_CHAT_LIST_SUCCESS, data: chatResponse.data.data });

    } catch (error) {
        yield put({ type: HOME_PAGE_FAILURE, error: error })
    }
};


export function* commentOnPostAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(postApi, 'post/comment', action.payload, Header);
        yield put({ type: COMMENT_ON_POST_SUCCESS, data: response.data.data })


    } catch (error) {
        yield put({ type: COMMENT_ON_POST_FAILURE, error: error })
    }
};


export function* followerListAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        if (action.usertype === 'user') {
            const response = yield call(getApi, 'follower/list', Header)
            yield put({ type: FOLLOWER_LIST_SUCCESS, data: response.data.data })
        }
        else {
            const response = yield call(getApi, `follower/list?user_id=${action.id}`, Header)
            yield put({ type: FOLLOWER_LIST_SUCCESS, data: response.data.data })
        }

    } catch (error) {
        yield put({ type: FOLLOWER_LIST_FAILURE, error: error })
    }
};


export function* followingListAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        if (action.usertype === 'user') {
            const response = yield call(getApi, 'follower/following/list', Header)
            yield put({ type: FOLLOWING_LIST_SUCCESS, data: response.data.data })
        }
        else {
            const response = yield call(getApi, `follower/following/list?user_id=${action.id}`, Header)
            yield put({ type: FOLLOWING_LIST_SUCCESS, data: response.data.data })
        }

    } catch (error) {
        yield put({ type: FOLLOWING_LIST_FAILURE, error: error })
    }
};


export function* reactionOnPostAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(postApi, 'post/reaction', action.payload, Header);
        yield put({ type: REACTION_ON_POST_SUCCESS, data: response.data.data })


    } catch (error) {
        yield put({ type: REACTION_ON_POST_FAILURE, error: error })
    }
};


export function* activityListAction(action) {
    try {
        const items = yield select(getItems);
        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        }

        const response = yield call(getApi, 'activity/list', Header)
        yield put({ type: ACTIVITY_LIST_SUCCESS, data: response.data.data })

    } catch (error) {
        yield put({ type: ACTIVITY_LIST_FAILURE, error: error })
    }
};


export function* featuredTrackSearchAction(action) {
    try {
        const spotifyToken = yield call(getSpotifyToken);
        const items = yield select(getItems);
        const AppleToken = yield call(getAppleDevToken);

        let Header = {
            "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
        };

        if (items.registerType === "spotify") {
            const response = yield call(getSpotifyApi, `https://api.spotify.com/v1/search?q=${encodeURI(action.text)}&type=track&market=US`, Header)

            yield put({ type: FEATURED_SONG_SEARCH_SUCCESS, data: response.data.tracks.items });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURI(action.text)}&limit=20&types=songs`, Header)
            yield put({ type: FEATURED_SONG_SEARCH_SUCCESS, data: response.data.results.songs.data });
        }

    } catch (error) {
        yield put({ type: FEATURED_SONG_SEARCH_FAILURE, error: error });
    }
};

export function* userLogoutAction(action) {
    try {
        const items = yield select(getItems);
        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(getApi, 'user/logout', Header);
        yield call(AsyncStorage.removeItem, constants.CHOONACREDS);

        yield put({ type: USER_LOGOUT_SUCCESS, data: response.data.data });
        yield put({ type: ASYNC_STORAGE_CLEAR, token: null, registerType: null });

    } catch (error) {
        yield put({ type: USER_LOGOUT_FAILURE, error: error })
    }
};


export function* getUsersFromHomeAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'user/search', action.payload, Header)
        yield put({ type: GET_USER_FROM_HOME_SUCCESS, data: response.data.data })

    } catch (error) {
        yield put({ type: GET_USER_FROM_HOME_FAILURE, error: error })
    }
};

export function* getCountryCodeAction(action) {
    try {
        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
        };

        const response = yield call(getApi, 'country-code/list', Header);
        
        let  UK = response.data.data.findIndex(obj => obj.dial_code === "+44" );
        let  USA = response.data.data.findIndex(obj => obj.dial_code === "+1" );

        let res = response.data.data.map((item) => {
            let obj = item.flag + item.dial_code
            return obj
        })

        let ukcode = res[UK];
        let usacode = res[USA];

        res.splice(UK, 1);
        res.splice(USA, 1);

        res[1] = usacode;
        res.unshift(ukcode);
        //  console.log("THE CODE", res)
        yield put({ type: COUNTRY_CODE_SUCCESS, data: res, data1: response.data.data });

    } catch (error) {
        yield put({ type: COUNTRY_CODE_FAILURE, error: error })
    }
};

export function* getTop5FollowedUserAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token

        };

        const response = yield call(getApi, 'follower/top/list', Header);
        //  console.log("THE CODE", res)
        yield put({ type: TOP_5_FOLLOWED_USER_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: TOP_5_FOLLOWED_USER_FAILURE, error: error })
    }
};


export function* getUsersFromContact(action) {
    try {
        const items = yield select(getItems);
        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'user/phone', action.payload, Header);
        yield put({ type: GET_USERS_FROM_CONTACTS_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: GET_USERS_FROM_CONTACTS_FAILURE, error: error })
    }
};


export function* dummyRequestAction(action) {
    yield put({ type: DUMMY_ACTION_SUCCESS })
};


export function* followerSearchAction(action) {
    const followerData = yield select(userReducer);

    const result = _.filter(followerData.followerDataCopy, (item) => {
        return item.username.toLowerCase().indexOf(action.search.toLowerCase()) !== -1
    });

    yield put({ type: FOLLOWER_SEARCH_SUCCESS, data: result })
};


export function* followingSearchAction(action) {
    const followingData = yield select(userReducer);

    const result = _.filter(followingData.followingDataCopy, (item) => {
        return item.username.toLowerCase().indexOf(action.search.toLowerCase()) !== -1
    });

    yield put({ type: FOLLOWING_SEARCH_SUCCESS, data: result })
};


//WATCH FUNCTIONS

export function* watchLoginRequest() {
    yield takeLatest(USER_LOGIN_REQUEST, loginAction);
};

export function* watchUserSignUpAction() {
    yield takeLatest(USER_SIGNUP_REQUEST, UserSignUpAction);
};

export function* watchuserProfileAction() {
    yield takeLatest(USER_PROFILE_REQUEST, userProfileAction)
};

export function* watcheditProfileAction() {
    yield takeLatest(EDIT_PROFILE_REQUEST, editProfileAction)
};

export function* watchuserSearchAction() {
    yield takeLatest(USER_SEARCH_REQUEST, userSearchAction)
};

export function* watchuserFollowOrUnfollowAction() {
    yield takeLatest(USER_FOLLOW_UNFOLLOW_REQUEST, userFollowOrUnfollowAction)
};

export function* watchothersProfileAction() {
    yield takeLatest(OTHERS_PROFILE_REQUEST, othersProfileAction)
};

export function* watchhomePageAction() {
    yield takeLatest(HOME_PAGE_REQUEST, homePageAction)
};

export function* watchcommentOnPostAction() {
    yield takeLatest(COMMENT_ON_POST_REQUEST, commentOnPostAction)
};

export function* watchfollowerListAction() {
    yield takeLatest(FOLLOWER_LIST_REQUEST, followerListAction)
};

export function* watchfollowingListAction() {
    yield takeLatest(FOLLOWING_LIST_REQUEST, followingListAction)
};

export function* watchReactionOnPostAction() {
    yield takeLatest(REACTION_ON_POST_REQUEST, reactionOnPostAction)
};

export function* watchactivityListAction() {
    yield takeLatest(ACTIVITY_LIST_REQUEST, activityListAction)
};

export function* watchfeaturedTrackSearchAction() {
    yield takeLatest(FEATURED_SONG_SEARCH_REQUEST, featuredTrackSearchAction)
};

export function* watchUserLogoutAction() {
    yield takeLatest(USER_LOGOUT_REQUEST, userLogoutAction)
};

export function* watchgetUsersFromHomeAction() {
    yield takeLatest(GET_USER_FROM_HOME_REQUEST, getUsersFromHomeAction)
};

export function* watchCountryCodeAction() {
    yield takeLatest(COUNTRY_CODE_REQUEST, getCountryCodeAction)
};

export function* watchTop5FollowedUserAction() {
    yield takeLatest(TOP_5_FOLLOWED_USER_REQUEST, getTop5FollowedUserAction)
};

export function* watchgetUsersFromContact() {
    yield takeLatest(GET_USERS_FROM_CONTACTS_REQUEST, getUsersFromContact)
};

export function* watchDummyAction() {
    yield takeLatest(DUMMY_ACTION_REQUEST, dummyRequestAction)
};

export function* watchFollowerSearch() {
    yield takeLatest(FOLLOWER_SEARCH_REQUEST, followerSearchAction)
};

export function* watchFollowingSearch() {
    yield takeLatest(FOLLOWING_SEARCH_REQUEST, followingSearchAction)
};
