import { put, call, take, fork, takeLatest, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'
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
    DELETE_CONVERSATION_FAILURE

} from '../action/TypeConstants'
import { postApi, getApi } from '../utils/helpers/ApiRequest'
import _ from 'lodash'
import database from '@react-native-firebase/database';
import moment from "moment";

const FIREBASE_REF_MESSAGES = database().ref('chatMessages')

const getItems = state => state.TokenReducer;
const getMessageReducer = state => state.MessageReducer;

/**
 * This function is used getting the chat token of the user.
 * @param {Object} action  provide payload for the chat token.
 */

export function* getChatTokenAction(action) {

    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }
        let chatTokenResponse = yield call(postApi, 'chat/create', { "receiver_id": action.payload }, Header);

        if (chatTokenResponse.data.status === 200)
            yield put({ type: CREATE_CHAT_TOKEN_SUCCESS, data: chatTokenResponse.data.data });
        else
            yield put({ type: CREATE_CHAT_TOKEN_FAILURE, error: chatTokenResponse.data });

    } catch (error) {

        yield put({ type: CREATE_CHAT_TOKEN_FAILURE, error: error });


    }

}


/**
 * This function is used for sending chat message
 * @param {Object} action  provide payload for chat
 */
export function* sendChatMessageAction(action) {

    console.log("SEND_CHAT_REQ", action.payload);

    try {
        action.payload.chatTokens.map((chatToken, index) => {

            FIREBASE_REF_MESSAGES.child(chatToken._id).push(action.payload.chatBody[index])

        })

        yield put({ type: SEND_CHAT_MESSAGE_SUCCESS, data: 'Message sent successfully' })
    }
    catch (error) {

        yield put({ type: SEND_CHAT_MESSAGE_FAILURE, error: error })
    }
};


export function* getChatListAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, 'chat/list', Header)
        yield put({ type: GET_CHAT_LIST_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: GET_CHAT_LIST_FAILURE, error: error })
    }
};


/**
 * This function is used for listening to any change in firebase realtime database, and 
 * read the chat message
 * @param {Object} action provide the chat token of a particular channel
 */
export function* getChatMessages(action) {

    // Creates an eventChannel and starts the listener;
    const channel = eventChannel(emiter => {
        const listener = FIREBASE_REF_MESSAGES.child(action.payload.chatToken).on(
            'value',
            dataSnapshot => {
                var items = []
                dataSnapshot.forEach(child => {

                    items.push({
                        ...child.val(),
                        key: child.key,
                    })

                    if (action.payload.userId == child.val().receiver_id) {
                        child.child("read").ref.set(true)
                    }

                })

                console.log("CHATS", items)

                var chatResponse = {
                    data: items.reverse(),
                }

                emiter(chatResponse || {})

                //emiter({ data: items.reverse() || {} })
            }
        )

        // Return the shutdown method;
        return () => {
            FIREBASE_REF_MESSAGES.child(action.payload.chatToken).off()
        }
    })

    if (action.payload.isMount) {
        while (true) {
            const chatResponse = yield take(channel)
            // Pause the task until the channel emits a signal and dispatch an action in the store;
            yield put({ type: CHAT_LOAD_SUCCESS, chatResponse })
        }
    } else {
        var chatResponse = {
            data: [],
        }
        yield put({ type: CHAT_LOAD_SUCCESS, chatResponse })
        channel.close()
    }

}

export function* searchMessageAction(action) {
    const items = yield select(getMessageReducer);

    let seachData = yield call(filterfunction, items.chatData, action.payload)

    try {
        yield put({ type: SEARCH_MESSAGE_SUCCESS, keyword: action.payload, data: seachData });

    } catch (error) {
        yield put({ type: SEARCH_MESSAGE_FAILURE, error: error })
    }
};

function filterfunction(data, keyword) {
    return (
        new Promise(function (resolve, reject) {
            let filterdData = _.filter(data, (item) => {
                return item.song_name.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
            });
            if (data != null) {
                resolve(filterdData);
            }
            else
                reject([])
        })
    );
}

export function* updateMessageCommentAction(action) {

    try {

        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }

        const channel = eventChannel(emiter => {
            const listener = FIREBASE_REF_MESSAGES.child(action.payload.chatToken)
                .child(action.payload.ChatId)
                .update({
                    "message": action.payload.message,
                    "read": false,
                    "receiver_id": action.payload.receiverId,
                    "sender_id": action.payload.senderId,
                    "time": moment().toString()

                }, (error) => {
                    emiter({ error: error || null })
                }
                )
            // Return the shutdown method;
            return () => {
                listener.off()
            }
        });

        const { error } = yield take(channel);

        if (error) {
            yield put({ type: UPDATE_MESSEAGE_COMMENTS_FAILURE, error: error })
        } else {

            let updateMessageResponse = yield call(postApi, 'chat/sendPush',
                {
                    "receiverId": action.payload.receiverId,
                    "song_name": action.payload.songTitle,
                    "artist_name": action.payload.artist,
                }, Header);

            console.log("updateMessageResponse: " + JSON.stringify(updateMessageResponse))

            yield put({ type: UPDATE_MESSEAGE_COMMENTS_SUCCESS, data: 'Message Edited successfully' })
        }
    } catch (error) {
        yield put({ type: UPDATE_MESSEAGE_COMMENTS_FAILURE, error: error });
    }
}

export function* deleteMessageAction(action) {

    try {

        const channel = eventChannel(emiter => {
            const listener = FIREBASE_REF_MESSAGES.child(action.payload.chatToken)
                .child(action.payload.ChatId)
                .remove((error) => {
                    emiter({ error: error || null })
                })
            // Return the shutdown method;
            return () => {
                listener.off()
            }
        });

        const { error } = yield take(channel)
        if (error) {
            yield put({ type: DELETE_MESSAGE_FAILURE, error: error })
        } else {
            yield put({ type: DELETE_MESSAGE_SUCCESS, data: 'Message Deleted successfully' })
        }
    } catch (error) {
        yield put({ type: DELETE_MESSAGE_FAILURE, error: error });
    }
};


export function* getChatTokenFromSearchAction(action) {

    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }
        let chatTokenResponse = yield call(postApi, 'chat/create', { "receiver_id": action.payload }, Header);

        if (chatTokenResponse.data.status === 200)
            yield put({ type: CREATE_CHAT_TOKEN_FROM_SEARCH_SUCCESS, data: chatTokenResponse.data.data });
        else
            yield put({ type: CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE, error: chatTokenResponse.data });

    } catch (error) {

        yield put({ type: CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE, error: error });
    }
};


export function* getChatTokenFromSavedSongAction(action) {

    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }
        let chatTokenResponse = yield call(postApi, 'chat/create', { "receiver_id": action.payload }, Header);

        if (chatTokenResponse.data.status === 200)
            yield put({ type: CREATE_CHAT_TOKEN_FROM_SAVEDSONG_SUCCESS, data: chatTokenResponse.data.data });
        else
            yield put({ type: CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE, error: chatTokenResponse.data });

    } catch (error) {

        yield put({ type: CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE, error: error });
    }
};

export function* deleteConversationAction(action) {

    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }
        let chatTokenResponse = yield call(postApi, 'chat/removenew', action.payload, Header);

        if (chatTokenResponse.data.status === 200)
            yield put({ type: DELETE_CONVERSATION_SUCCESS, data: chatTokenResponse.data.data });
        else
            yield put({ type: DELETE_CONVERSATION_FAILURE, error: chatTokenResponse.data });

    } catch (error) {

        yield put({ type: DELETE_CONVERSATION_FAILURE, error: error });
    }
};

export function* watchGetChatTokenRequest() {
    yield takeLatest(CREATE_CHAT_TOKEN_REQUEST, getChatTokenAction)
}

export function* watchSendChatMessageRequest() {
    yield takeLatest(SEND_CHAT_MESSAGE_REQUEST, sendChatMessageAction)
}

export function* watchgetChatListAction() {
    yield takeLatest(GET_CHAT_LIST_REQUEST, getChatListAction)
}

export function* watchLoadMessages() {
    yield takeLatest(CHAT_LOAD_REQUEST, getChatMessages)
}

export function* watchSeachMessageRequest() {
    yield takeLatest(SEARCH_MESSAGE_REQUEST, searchMessageAction)
}

export function* watchUpdateMessageCommentRequest() {
    yield takeLatest(UPDATE_MESSEAGE_COMMENTS_REQUEST, updateMessageCommentAction)
}

export function* watchDeleteMessageRequest() {
    yield takeLatest(DELETE_MESSAGE_REQUEST, deleteMessageAction)
}

export function* watchgetChatTokenFromSearchAction() {
    yield takeLatest(CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST, getChatTokenFromSearchAction)
}

export function* watchgetChatTokenFromSavedSongAction() {
    yield takeLatest(CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST, getChatTokenFromSavedSongAction)
}

export function* watchDeleteConversationAction() {
    yield takeLatest(DELETE_CONVERSATION_REQUEST, deleteConversationAction)
}