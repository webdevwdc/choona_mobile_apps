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
    GET_POST_FROM_TOP_50_FAILURE,

    ASYNC_STORAGE_CLEAR
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    spotifyResponse: [],
    createPostResponse: {},
    chooseSongToSend: [],
    deletePostResp: {},
    searchPost: [],
    getPostFromTop50: []
}

const PostReducer = (state = initialState, action) => {
    switch (action.type) {

        case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:

            if (action.post) {
                return {
                    ...state,
                    status: action.type,
                    spotifyResponse: action.data,
                };
            } else {
                return {
                    ...state,
                    status: action.type,
                    chooseSongToSend: action.data,
                };
            }


        case SEARCH_SONG_REQUEST_FOR_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case CREATE_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                createPostResponse: action.data,
            };

        case CREATE_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case DELETE_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                deletePostResp: action.data,
            };

        case DELETE_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case SEARCH_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEARCH_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                searchPost: action.data,
            };

        case SEARCH_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_POST_FROM_TOP_50_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_POST_FROM_TOP_50_SUCCESS:
            return {
                ...state,
                status: action.type,
                getPostFromTop50: action.data,
            };

        case GET_POST_FROM_TOP_50_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case ASYNC_STORAGE_CLEAR:
            return initialState;

        default:
            return state;

    }
}

export default PostReducer;