import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import {
    watchLoginRequest, watchUserSignUpAction, watchuserProfileAction, watcheditProfileAction,
    watchuserSearchAction, watchuserFollowOrUnfollowAction, watchothersProfileAction,
    watchhomePageAction, watchcommentOnPostAction, watchfollowerListAction,
    watchfollowingListAction, watchReactionOnPostAction, watchactivityListAction,
    watchfeaturedTrackSearchAction, watchUserLogoutAction, watchgetUsersFromHomeAction,
    watchCountryCodeAction, watchTop5FollowedUserAction, watchgetUsersFromContact,
    watchDummyAction, watchFollowerSearch, watchFollowingSearch

} from './UserSaga'

import {
    watchSearchSongsForPostRequest, watchCreatePostRequest, watchdeletePostAction,
    watchSearchPostAction, watchGetPostFromTop50
} from './PostSaga'

import {
    watchsaveSongAction, watchsavedSongListAction, watchunsaveSongAction,
    watchsaveSongRefAction, watchTop50SongsAction
} from './SongSaga';

import {
    watchGetChatTokenRequest, watchSendChatMessageRequest,
    watchgetChatListAction, watchLoadMessages, watchSeachMessageRequest,
    watchUpdateMessageCommentRequest, watchDeleteMessageRequest,
    watchgetChatTokenFromSearchAction, watchgetChatTokenFromSavedSongAction,
    watchDeleteConversationAction
} from './MessageSaga';

import {
    watchGetCurrentPlayerPostionRequest, watchResumePlayerRequest,
    watchPlayPlayerRequest, watchSeekToPlayerRequest, watchgetSongFromIsrc,
    watchGetPlayListOfUser, watchAddSongsToPlaylistRequest
} from './PlayerSaga';


function* RootSaga() {

    yield all([
        watchtokenAction(),
        watchgetTokenAction(),
        watchLoginRequest(),
        watchUserSignUpAction(),
        watchuserProfileAction(),
        watcheditProfileAction(),
        watchuserSearchAction(),
        watchuserFollowOrUnfollowAction(),
        watchSearchSongsForPostRequest(),
        watchCreatePostRequest(),
        watchothersProfileAction(),
        watchhomePageAction(),
        watchsaveSongAction(),
        watchsavedSongListAction(),
        watchunsaveSongAction(),
        watchcommentOnPostAction(),
        watchfollowerListAction(),
        watchfollowingListAction(),
        watchReactionOnPostAction(),
        watchactivityListAction(),
        watchGetChatTokenRequest(),
        watchSendChatMessageRequest(),
        watchsaveSongRefAction(),
        watchgetChatListAction(),
        watchLoadMessages(),
        watchdeletePostAction(),
        watchfeaturedTrackSearchAction(),
        watchUserLogoutAction(),
        watchSearchPostAction(),
        watchTop50SongsAction(),
        watchGetPostFromTop50(),
        watchgetUsersFromHomeAction(),
        watchGetCurrentPlayerPostionRequest(),
        watchResumePlayerRequest(),
        watchPlayPlayerRequest(),
        watchSeekToPlayerRequest(),
        watchSeachMessageRequest(),
        watchCountryCodeAction(),
        watchTop5FollowedUserAction(),
        watchgetUsersFromContact(),
        watchgetSongFromIsrc(),
        watchUpdateMessageCommentRequest(),
        watchDeleteMessageRequest(),
        watchGetPlayListOfUser(),
        watchAddSongsToPlaylistRequest(),
        watchgetChatTokenFromSearchAction(),
        watchgetChatTokenFromSavedSongAction(),
        watchDummyAction(),
        watchFollowerSearch(),
        watchFollowingSearch(),
        watchDeleteConversationAction()

    ])
}

export default RootSaga;