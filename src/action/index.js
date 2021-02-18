import {
    ASYNC_STORAGE_REQUEST,
    GET_TOKEN_REQUEST,
} 
from './TypeConstants';

export const tokenRequest = (token) =>({
    type: ASYNC_STORAGE_REQUEST,
    token
});

export const getTokenRequest = () =>({
    type: GET_TOKEN_REQUEST,
})

