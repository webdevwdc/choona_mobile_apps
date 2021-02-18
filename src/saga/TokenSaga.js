import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import {
    ASYNC_STORAGE_REQUEST,
    ASYNC_STORAGE_SUCCESS,
    ASYNC_STORAGE_FAILURE,
    GET_TOKEN_REQUEST,
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAILURE
} from '../action/TypeConstants';
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';


export function* tokenAction(action) {

    yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({ "token": action.token }))
    yield put({ type: ASYNC_STORAGE_SUCCESS, token: action.token })
};

export function* getTokenAction(action) {
    try {

        const creds = yield call(AsyncStorage.getItem, constants.CHOONACREDS)
        if (creds === null) {
            yield put({ type: GET_TOKEN_SUCCESS, token: null, registerType: null })
        }
        yield put({ type: GET_TOKEN_SUCCESS, token: JSON.parse(creds).token, registerType: JSON.parse(creds).registerType })

    } catch (error) {

        yield put({ type: GET_TOKEN_FAILURE, error: error })

    }
};


//WATCH REQUESTS
export function* watchtokenAction() {
    yield takeLatest(ASYNC_STORAGE_REQUEST, tokenAction)
};

export function* watchgetTokenAction() {
    yield takeLatest(GET_TOKEN_REQUEST, getTokenAction)
};