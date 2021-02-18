import axios from 'axios';
import constants from "./constants"

export async function getApi(url, header) {

    console.log("URL: ", `${constants.BASE_URL}/${url}`)

    return await axios.get(`${constants.BASE_URL}/${url}`, {
        headers: {
            'Accept': header.Accept,
            'Content-type': header.contenttype,
            'x-access-token': header.accesstoken,
        }
    });
}

export async function getSpotifyApi(url, header) {

    console.log("URL: ", `${url}`)

    return await axios.get(`${url}`, {
        headers: header
    });
}

export async function putSpotifyApi(url, payload, header) {

    console.log("URL: ", `${url}`)

    return await axios.put(`${url}`, payload, {
        headers: header
    });
}

export async function postSpotifyApi(url, payload, header) {

    console.log("URL: ", `${url}`)

    return await axios.post(`${url}`, payload, {
        headers: header
    });
}

export async function postApi(url, payload, header) {

    console.log("URL: ", `${constants.BASE_URL}/${url}`)

    return await axios.post(`${constants.BASE_URL}/${url}`, payload, {
        headers: {
            'Accept': header.Accept,
            'Content-type': header.contenttype,
            'x-access-token': header.accesstoken,
        }
    });
};

export async function getAppleDevelopersToken(url, header) {

    console.log("URL: ", `${url}`);

    return await axios.get(url, {
        headers: header
    });
};
