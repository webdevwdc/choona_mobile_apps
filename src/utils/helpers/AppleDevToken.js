import constants from './constants'
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { getAppleDevelopersToken } from './ApiRequest';

export const getAppleDevToken = async () => {
    try {
        const creds = await AsyncStorage.getItem(constants.APPLE)

        if (creds === null) {

            const token = await getAppleDevelopersToken(constants.appleGetTokenApi)
            console.log('Dev Token First' + token)
            await AsyncStorage.setItem(constants.APPLE, JSON.stringify({
                token: token.data.token,
                token_exp: token.data.token_exp
            }))

            return `Bearer ${token.data.token}`
        }
        else {
            console.log('Dev Token' + creds);
            const devToken = JSON.parse(creds).token
            const tokenexp = JSON.parse(creds).token_exp
            const currentTime = moment().utc().format(`YYYY-MM-DDTHH:mm:sssZ`);

            if (currentTime > tokenexp) {
                console.log('token expired');
                const token = await getAppleDevelopersToken(constants.appleGetTokenApi)
                await AsyncStorage.setItem(constants.APPLE, JSON.stringify({
                    token: token.data.token,
                    token_exp: token.data.token_exp
                }))
                return `Bearer ${token.data.token}`;
            }
            else {
                console.log('token working');
                return `Bearer ${devToken}`;
            }
        }

    } catch (error) {
        return ""
    }
}