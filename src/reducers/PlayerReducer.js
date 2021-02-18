import {

    GET_CURRENT_PLAYER_POSITION_REQUEST,
    GET_CURRENT_PLAYER_POSITION_SUCCESS,
    GET_CURRENT_PLAYER_POSITION_FAILURE,

    RESUME_PLAYER_REQUEST,
    RESUME_PLAYER_SUCCESS,
    RESUME_PLAYER_FAILURE,

    PAUSE_PLAYER_REQUEST,
    PAUSE_PLAYER_SUCCESS,
    PAUSE_PLAYER_FAILURE,

    PLAYER_SEEK_TO_REQUEST,
    PLAYER_SEEK_TO_SUCCESS,
    PLAYER_SEEK_TO_FAILURE,

    GET_SONG_FROM_ISRC_REQUEST,
    GET_SONG_FROM_ISRC_SUCCESS,
    GET_SONG_FROM_ISRC_FAILURE,

    GET_USER_PLAYLIST_REQUEST,
    GET_USER_PLAYLIST_SUCCESS,
    GET_USER_PLAYLIST_FAILURE,

    ADD_SONG_TO_PLAYLIST_REQUEST,
    ADD_SONG_TO_PLAYLIST_SUCCESS,
    ADD_SONG_TO_PLAYLIST_FAILURE,

    ASYNC_STORAGE_CLEAR
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: "",
    currentPlayerPositionResponse: {},
    resumePlayerResponse: {},
    pausePlayerResponse: {},
    seekToPlayerResponse: {},
    getSongFromISRC: [],
    getUserPlayList: [],
    addSongToPlayListResponse: {}
}

const PlayerReducer = (state = initialState, action) => {

    switch (action.type) {

        case GET_CURRENT_PLAYER_POSITION_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_CURRENT_PLAYER_POSITION_SUCCESS:

            return {
                ...state,
                status: action.type,
                currentPlayerPositionResponse: action.data,
            };

        case GET_CURRENT_PLAYER_POSITION_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case RESUME_PLAYER_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case RESUME_PLAYER_SUCCESS:

            return {
                ...state,
                status: action.type,
                resumePlayerResponse: action.data,
            };

        case RESUME_PLAYER_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case PAUSE_PLAYER_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case PAUSE_PLAYER_SUCCESS:

            return {
                ...state,
                status: action.type,
                pausePlayerResponse: action.data,
            };

        case PAUSE_PLAYER_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case PLAYER_SEEK_TO_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case PLAYER_SEEK_TO_SUCCESS:

            return {
                ...state,
                status: action.type,
                seekToPlayerResponse: action.data,
            };

        case PLAYER_SEEK_TO_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_SONG_FROM_ISRC_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_SONG_FROM_ISRC_SUCCESS:
            return {
                ...state,
                status: action.type,
                getSongFromISRC: action.data,
            };

        case GET_SONG_FROM_ISRC_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_USER_PLAYLIST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_USER_PLAYLIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                getUserPlayList: action.data,
            };

        case GET_USER_PLAYLIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case ADD_SONG_TO_PLAYLIST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case ADD_SONG_TO_PLAYLIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                addSongToPlayListResponse: action.data,
            };

        case ADD_SONG_TO_PLAYLIST_FAILURE:
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

export default PlayerReducer;