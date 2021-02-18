import {
    GET_CURRENT_PLAYER_POSITION_REQUEST,
    RESUME_PLAYER_REQUEST,
    PAUSE_PLAYER_REQUEST,
    PLAYER_SEEK_TO_REQUEST,
    GET_SONG_FROM_ISRC_REQUEST,
    GET_USER_PLAYLIST_REQUEST,
    ADD_SONG_TO_PLAYLIST_REQUEST
}
    from './TypeConstants';

export const getCurrentPlayerPostionAction = () => ({
    type: GET_CURRENT_PLAYER_POSITION_REQUEST,
});

export const playerResumeRequest = () => ({
    type: RESUME_PLAYER_REQUEST,
});

export const playerPauseRequest = () => ({
    type: PAUSE_PLAYER_REQUEST,
});

export const playerSeekToRequest = (seekTo) => ({
    type: PLAYER_SEEK_TO_REQUEST,
    seekTo
});

export const getSongFromisrc = (regType, isrc) => ({
    type: GET_SONG_FROM_ISRC_REQUEST,
    regType,
    isrc
});

export const getUserPlaylist = (regType, devToken, musicToken) => ({
    type: GET_USER_PLAYLIST_REQUEST,
    regType,
    devToken,
    musicToken
});

export const addSongsToPlayListRequest = (regType, payload, devToken, musicToken) => ({
    type: ADD_SONG_TO_PLAYLIST_REQUEST,
    regType,
    payload,
    devToken,
    musicToken
});

