import {
    ASYNC_STORAGE_REQUEST,
    ASYNC_STORAGE_SUCCESS,
    ASYNC_STORAGE_FAILURE,
    ASYNC_STORAGE_CLEAR,

    GET_TOKEN_REQUEST,
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    loading: true,
    token: "",
    registerType: ""
}

const TokenReducer = (state = initialState, action) => {
    switch (action.type) {

        case ASYNC_STORAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case ASYNC_STORAGE_SUCCESS:
            return {
                ...state,
                status: action.type,
                loading: false,
                token: action.token,
                registerType: action.registerType
            };

        case ASYNC_STORAGE_FAILURE:
            return {
                ...state,
                status: action.type
            };

        case ASYNC_STORAGE_CLEAR:
            return {
                ...state,
                status: "",
                token: action.token,
                registerType: "",
                loading: false,
                error: {}
            };

        case GET_TOKEN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_TOKEN_SUCCESS:
            return {
                ...state,
                status: action.type,
                loading: false,
                token: action.token,
                registerType: action.registerType
            }

        case GET_TOKEN_FAILURE:
            return {
                ...state,
                status: action.type
            }

        default:
            return state;

    }
}

export default TokenReducer;