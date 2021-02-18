import constants from './constants'
import AsyncStorage from '@react-native-community/async-storage';
import { authorize, refresh } from 'react-native-app-auth';
import { getSpotifyApi } from "./ApiRequest";
import moment from "moment";

const config = {
    clientId: constants.spotify_client_id,
    clientSecret: constants.spotify_client_secret,
    redirectUrl: constants.spotify_redirect_uri,
    scopes: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private'
    ],
    serviceConfiguration: {
        authorizationEndpoint: constants.spotify_authorize_uri,
        tokenEndpoint: constants.spotify_token_uri,
    },
};

export const loginWithSpotify = async () => {

    try {
        const result = await authorize(config);

        await AsyncStorage.setItem(constants.SPOTIFY, JSON.stringify({
            accessToken: result.accessToken,
            accessTokenExpirationDate: result.accessTokenExpirationDate,
            refreshToken: result.refreshToken
        }));

        let header = {
            "Authorization": `Bearer ${result.accessToken}`,
        }

        const spotifyUserResponse = await getSpotifyApi(constants.spotify_profile_uri, header);

        if (spotifyUserResponse.status === 200) {
            return spotifyUserResponse.data;
        }
        return {};

    } catch (error) {
        return {};
    }

}

export const getSpotifyToken = async () => {

    try {

        const value = await AsyncStorage.getItem(constants.SPOTIFY)

        let accessToken = JSON.parse(value).accessToken;
        let accessTokenExpirationDate = JSON.parse(value).accessTokenExpirationDate;
        let refreshToken = JSON.parse(value).refreshToken;
        let currentTime = moment().utc().format(`YYYY-MM-DDTHH:mm:ssZ`);

        if (accessTokenExpirationDate > currentTime) {

            return `Bearer ${accessToken}`;

        } else {

            const result = await refresh(config, { refreshToken: refreshToken });
            
            await AsyncStorage.setItem(constants.SPOTIFY, JSON.stringify({
                accessToken: result.accessToken,
                accessTokenExpirationDate: result.accessTokenExpirationDate,
                refreshToken: result.refreshToken
            }))

            return `Bearer ${result.accessToken}`;
         }

    } catch (error) {
        return ""
    }

}