import { put, call, fork, takeLatest, all, select } from 'redux-saga/effects';
import {
    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
    SEARCH_SONG_REQUEST_FOR_POST_FAILURE,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE,

    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAILURE,

    SEARCH_POST_REQUEST,
    SEARCH_POST_SUCCESS,
    SEARCH_POST_FAILURE,

    GET_POST_FROM_TOP_50_REQUEST,
    GET_POST_FROM_TOP_50_SUCCESS,
    GET_POST_FROM_TOP_50_FAILURE

} from '../action/TypeConstants';
import { postApi, getApi, getSpotifyApi, getAppleDevelopersToken } from "../utils/helpers/ApiRequest"
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';
import { getSpotifyToken } from '../utils/helpers/SpotifyLogin'
import { getAppleDevToken } from '../utils/helpers/AppleDevToken';
import { Header } from 'react-native/Libraries/NewAppScreen';

const getItems = (state) => state.TokenReducer


export function* searchSongsForPostAction(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);
    const AppleToken = yield call(getAppleDevToken);

    let spotifyHeader = {
        "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
    };

    console.log("header: "+JSON.stringify(spotifyHeader))
    
    try {

        if (items.registerType === "spotify") {
            const response = yield call(getSpotifyApi, `https://api.spotify.com/v1/search?q=${encodeURI(action.text)}&type=track&market=US`, spotifyHeader)

            yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_SUCCESS, data: response.data.tracks.items, post: action.post });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURI(action.text)}&limit=20&types=songs`, spotifyHeader)
            yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_SUCCESS, data: response.data.results.songs.data, post: action.post });
        }

    } catch (error) {

        yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_FAILURE, error: error });
    }
};


export function* createPostAction(action) {

    const items = yield select(getItems);

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: items.token
    }

    try {

        const response = yield call(postApi, `post/store`, action.payload, header)

        yield put({ type: CREATE_POST_SUCCESS, data: response.data });


    } catch (error) {

        yield put({ type: CREATE_POST_FAILURE, data: error });
    }
};


export function* deletePostAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(getApi, `post/delete/${action.payload}`, Header);
        yield put({ type: DELETE_POST_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: DELETE_POST_FAILURE, error: error })
    }
};


export function* searchPostAction(action) {
    try {
        const items = yield select(getItems);
        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const text = action.text.replace('&','');
        const response = yield call(getApi, `post/list?keyword=${encodeURI(text)}`, Header);
        yield put({ type: action.flag ? SEARCH_POST_SUCCESS : GET_POST_FROM_TOP_50_SUCCESS, data: response.data.data });


    } catch (error) {
        yield put({ type: action.flag ? SEARCH_POST_FAILURE : GET_POST_FROM_TOP_50_FAILURE, error: error });
    }
};


//WATCH FUNCTIONS
export function* watchSearchSongsForPostRequest() {
    yield takeLatest(SEARCH_SONG_REQUEST_FOR_POST_REQUEST, searchSongsForPostAction)
};

export function* watchCreatePostRequest() {
    yield takeLatest(CREATE_POST_REQUEST, createPostAction)
};

export function* watchdeletePostAction() {
    yield takeLatest(DELETE_POST_REQUEST, deletePostAction)
};

export function* watchSearchPostAction() {
    yield takeLatest(SEARCH_POST_REQUEST, searchPostAction)
}

export function* watchGetPostFromTop50() {
    yield takeLatest(GET_POST_FROM_TOP_50_REQUEST, searchPostAction)
}