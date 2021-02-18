import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import {
    SAVE_SONGS_REQUEST,
    SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE,

    SAVED_SONGS_LIST_REQUEST,
    SAVED_SONGS_LIST_SUCCESS,
    SAVED_SONGS_LIST_FAILURE,

    UNSAVE_SONG_REQUEST,
    UNSAVE_SONG_SUCCESS,
    UNSAVE_SONG_FAILURE,

    SAVE_SONG_REFERENCE_REQUEST,
    SAVE_SONG_REFERENCE_SUCCESS,
    SAVE_SONG_REFERENCE_FAILURE,

    TOP_50_SONGS_REQUEST,
    TOP_50_SONGS_SUCCESS,
    TOP_50_SONGS_FAILURE

} from '../action/TypeConstants';
import { getApi, postApi } from '../utils/helpers/ApiRequest';

const getItems = (state) => state.TokenReducer


export function* saveSongAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token

        };

        const response = yield call(postApi, `song/store`, action.payload, Header)

        yield put({ type: SAVE_SONGS_SUCCESS, data: response.data });

    } catch (error) {
        yield put({ type: SAVE_SONGS_FAILURE, error: error })
    }
};

export function* savedSongListAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(postApi, 'song/search', { "keyword": action.search }, Header);

        yield put({ type: SAVED_SONGS_LIST_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: SAVED_SONGS_LIST_FAILURE, error: error })
    }
};


export function* unsaveSongAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: "application/json",
            contenttype: "application/json",
            accesstoken: items.token
        };

        const response = yield call(getApi, `song/remove/${action.id}`, Header);

        yield put({ type: UNSAVE_SONG_SUCCESS, data: response.data });

    } catch (error) {
        yield put({ type: UNSAVE_SONG_FAILURE, error: error })
    }
};


export function* saveSongRefAction(action) {
    try {
        yield put({ type: SAVE_SONG_REFERENCE_SUCCESS, data: action.object })

    } catch (error) {
        yield put({ type: SAVE_SONG_REFERENCE_FAILURE, error: error })
    }
};

export function* getTop50Song() {
    const items = yield select(getItems);

    const Header = {
        Accept: "application/json",
        contenttype: "application/json",
        accesstoken: items.token
    };

    try {

        let response = yield call(getApi, 'post/topfifty', Header)
        yield put({ type: TOP_50_SONGS_SUCCESS, data: response.data.data})

    }
    catch (error) {
        yield put({ type: TOP_50_SONGS_FAILURE, error: error })

    }


}



//WATCH FUNCTIONS

export function* watchsaveSongAction() {
    yield takeLatest(SAVE_SONGS_REQUEST, saveSongAction)
};

export function* watchsavedSongListAction() {
    yield takeLatest(SAVED_SONGS_LIST_REQUEST, savedSongListAction)
};

export function* watchunsaveSongAction() {
    yield takeLatest(UNSAVE_SONG_REQUEST, unsaveSongAction)
};

export function* watchsaveSongRefAction() {
    yield takeLatest(SAVE_SONG_REFERENCE_REQUEST, saveSongRefAction)
};

export function* watchTop50SongsAction() {
    yield takeLatest(TOP_50_SONGS_REQUEST, getTop50Song)
};