import {
    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    CREATE_POST_REQUEST,
    DELETE_POST_REQUEST,
    SEARCH_POST_REQUEST,
    GET_POST_FROM_TOP_50_REQUEST,
}
    from './TypeConstants';

export const seachSongsForPostRequest = (text, post) => ({
    type: SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    text,
    post
});

export const createPostRequest = (payload) => ({
    type: CREATE_POST_REQUEST,
    payload
});

export const deletePostReq = (payload) => ({
    type: DELETE_POST_REQUEST,
    payload
});

export const searchPostReq = (text, flag) => ({
    type: flag ? SEARCH_POST_REQUEST : GET_POST_FROM_TOP_50_REQUEST,
    flag,
    text,
});


