import {

    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,

    SEND_CHAT_MESSAGE_REQUEST,
    SEND_CHAT_MESSAGE_SUCCESS,
    SEND_CHAT_MESSAGE_FAILURE,

    GET_CHAT_LIST_REQUEST,
    GET_CHAT_LIST_SUCCESS,
    GET_CHAT_LIST_FAILURE,

    CHAT_LOAD_REQUEST,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAILURE,

    SEARCH_MESSAGE_REQUEST,
    SEARCH_MESSAGE_SUCCESS,
    SEARCH_MESSAGE_FAILURE,

    UPDATE_MESSEAGE_COMMENTS_REQUEST,
    UPDATE_MESSEAGE_COMMENTS_SUCCESS,
    UPDATE_MESSEAGE_COMMENTS_FAILURE,

    DELETE_MESSAGE_REQUEST,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_FAILURE,

    CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SEARCH_SUCCESS,
    CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE,

    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_SUCCESS,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE,

    DELETE_CONVERSATION_REQUEST,
    DELETE_CONVERSATION_SUCCESS,
    DELETE_CONVERSATION_FAILURE,

    ASYNC_STORAGE_CLEAR

} from '../action/TypeConstants';

const initialState = {
    status: "",
    error: "",
    chatTokenList: [],
    sendChatResponse: {},
    chatList: [],
    chatData: [],
    searchedChatData: [],
    updatedMessageCommentResponse: {},
    deleteMessageResponse: {},
    deleteCoversationResponse: []
};
const MessageReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_CHAT_TOKEN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_CHAT_TOKEN_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatTokenList: action.data
            };

        case CREATE_CHAT_TOKEN_FAILURE:
            return {
                ...state,
                status: action.type,
                chatTokenList: [],
                error: action.error
            };

        case SEND_CHAT_MESSAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEND_CHAT_MESSAGE_SUCCESS:
            return {
                ...state,
                status: action.type,
                sendChatResponse: action.data
            };

        case SEND_CHAT_MESSAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case GET_CHAT_LIST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_CHAT_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatList: action.data
            };

        case GET_CHAT_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case CHAT_LOAD_REQUEST:
            return {
                ...state,
                status: action.type,
            };

        case CHAT_LOAD_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatData: action.chatResponse.data,
                searchedChatData: action.chatResponse.data,
            };


        case CHAT_LOAD_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error,
            };

        case SEARCH_MESSAGE_REQUEST:
            return {
                ...state,
                status: action.type,
            };

        case SEARCH_MESSAGE_SUCCESS:

            return {
                ...state,
                status: action.type,
                searchedChatData: action.data,
            };


        case SEARCH_MESSAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error,
            };

        case UPDATE_MESSEAGE_COMMENTS_REQUEST:
            return {
                ...state,
                status: action.type,
            };

        case UPDATE_MESSEAGE_COMMENTS_SUCCESS:

            return {
                ...state,
                status: action.type,
                updatedMessageCommentResponse: action.data,
            };


        case UPDATE_MESSEAGE_COMMENTS_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error,
            };

        case DELETE_MESSAGE_REQUEST:
            return {
                ...state,
                status: action.type,
            };

        case DELETE_MESSAGE_SUCCESS:

            return {
                ...state,
                status: action.type,
                deleteMessageResponse: action.data,
            };


        case DELETE_MESSAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error,
            };

        case CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_CHAT_TOKEN_FROM_SEARCH_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatTokenList: action.data
            };

        case CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE:
            return {
                ...state,
                status: action.type,
                chatTokenList: [],
                error: action.error
            };

        case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatTokenList: action.data
            };

        case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE:
            return {
                ...state,
                status: action.type,
                chatTokenList: [],
                error: action.error
            };

        case DELETE_CONVERSATION_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case DELETE_CONVERSATION_SUCCESS:
            return {
                ...state,
                status: action.type,
                deleteCoversationResponse: action.data
            };

        case DELETE_CONVERSATION_FAILURE:
            return {
                ...state,
                status: action.type,
                chatTokenList: [],
            };

        case ASYNC_STORAGE_CLEAR:
            return initialState;


        default:
            return state;

    }
};

export default MessageReducer;