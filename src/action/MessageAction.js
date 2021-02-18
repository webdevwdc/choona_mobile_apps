import {
    CREATE_CHAT_TOKEN_REQUEST,
    SEND_CHAT_MESSAGE_REQUEST,
    GET_CHAT_LIST_REQUEST,
    CHAT_LOAD_REQUEST,
    SEARCH_MESSAGE_REQUEST,
    UPDATE_MESSEAGE_COMMENTS_REQUEST,
    DELETE_MESSAGE_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST,
    DELETE_CONVERSATION_REQUEST

} from '../action/TypeConstants';


export const createChatTokenRequest = (payload) => ({
    type: CREATE_CHAT_TOKEN_REQUEST,
    payload
});

export const sendChatMessageRequest = (payload) => ({
    type: SEND_CHAT_MESSAGE_REQUEST,
    payload
});

export const getChatListRequest = () => ({
    type: GET_CHAT_LIST_REQUEST
});

export const loadChatMessageRequest = payload => ({
    type: CHAT_LOAD_REQUEST,
    payload: payload
});

export const searchMessageRequest = payload => ({
    type: SEARCH_MESSAGE_REQUEST,
    payload: payload
});

export const updateMessageCommentRequest = payload => ({
    type: UPDATE_MESSEAGE_COMMENTS_REQUEST,
    payload: payload
});

export const deleteMessageRequest = payload => ({
    type: DELETE_MESSAGE_REQUEST,
    payload: payload
});

export const createChatTokenFromSearchRequest = (payload) => ({
    type: CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST,
    payload
});

export const createChatTokenFromSavedSongRequest = (payload) => ({
    type: CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST,
    payload
});

export const deleteConversationRequest = (payload) => ({
    type: DELETE_CONVERSATION_REQUEST,
    payload
});