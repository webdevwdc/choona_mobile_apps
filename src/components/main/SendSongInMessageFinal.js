import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Image,
    FlatList
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';
import constants from '../../utils/helpers/constants';
import { connect } from 'react-redux';
import { sendChatMessageRequest } from '../../action/MessageAction'
import moment from "moment"
import toast from '../../utils/helpers/ShowErrorAlert';
import {

    SEND_CHAT_MESSAGE_REQUEST,
    SEND_CHAT_MESSAGE_SUCCESS,
    SEND_CHAT_MESSAGE_FAILURE,

} from '../../action/TypeConstants';
import axios from 'axios';


let status;

function SendSongInMessageFinal(props) {

    const [search, setSearch] = useState("");
    const [imgsource, setImgSource] = useState(props.route.params.image)
    const [title1, setTitle1] = useState(props.route.params.title)
    const [title2, setTitle2] = useState(props.route.params.title2);
    const [usersData, setUserData] = useState(props.route.params.users);
    const [fromAddAnotherSong, setFromAddAnotherSong] = useState(props.route.params.fromAddAnotherSong)
    const [index, setIndex] = useState(props.route.params.index);
    const [type, setType] = useState(props.route.params.fromHome);
    const [spotifyUrl, setSpotifyUrl] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(0);


    useEffect(() => {
        if (props.registerType === 'spotify' && props.route.params.details.preview_url === null) {
            const getSpotifyApi = async () => {
                try {
                    const res = await callApi();
                    if (res.data.status === 200) {
                        let suc = res.data.data.audio;
                        setSpotifyUrl(suc);
                    }
                    else {
                        toast('Oops', 'Something Went Wrong');
                        props.navigation.goBack();
                    }

                } catch (error) {
                    console.log(error)
                }
            };

            getSpotifyApi();
        }
    }, []);


    // GET SPOTIFY SONG URL
    const callApi = async () => {
        return await axios.get(`${constants.BASE_URL}/${`song/spotify/${props.route.params.details.id}`}`, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        });
    };


    if (status === "" || status !== props.status) {
        switch (props.status) {

            case SEND_CHAT_MESSAGE_REQUEST:
                console.log("HERE SEND")
                status = props.status
                break;

            case SEND_CHAT_MESSAGE_SUCCESS:
                status = props.status;
                console.log("HERE SEND")

                break;

            case SEND_CHAT_MESSAGE_FAILURE:
                status = props.status;
                console.log("HERE FAIL")
                toast("Error", "Something Went Wong, Please Try Again");
                break;
        }
    };

    console.log(usersData)


    // RENDER USER SEARCH FLATLIST DATA
    function renderAddUsersToMessageItem(data) {

        return (
            <TouchableOpacity style={{
                marginTop: normalise(5),
                width: "87%",
                alignSelf: 'center'
            }}
                onPress={() => {

                }}>

                <View style={{ flexDirection: 'row', }}>
                    <Image
                        source={{ uri: constants.profile_picture_base_url + data.item.profile_image }}
                        style={{ height: 35, width: 35, borderRadius: normalise(13.5) }}
                    />
                    <View style={{ marginStart: normalise(10) }}>
                        <Text style={{
                            color: Colors.white,
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Semibold'
                        }}>{data.item.full_name}</Text>

                        <Text style={{
                            color: Colors.white,
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Semibold'
                        }}>{data.item.username}</Text>
                    </View>

                </View>
                <View style={{
                    backgroundColor: Colors.grey,
                    height: 0.5,
                    marginTop: normalise(10)
                }} />
            </TouchableOpacity>

        )
    };

    function hideKeyboard() {

        if (typingTimeout) {
            clearInterval(typingTimeout)
        }
        setTypingTimeout(setTimeout(() => {
            Keyboard.dismiss();
        }, 1500))

    }

    function sendMessage() {

        let chatBody = [];

        usersData.map((item) => {

            var chatObject = {
                message: [{
                    profile_image: props.userProfileResp.profile_image,
                    text: search,
                    username: props.userProfileResp.username,
                    createdAt: moment().toString(),
                    user_id: props.userProfileResp._id
                }],
                sender_id: props.userProfileResp._id,
                receiver_id: item._id,
                song_name: title1,
                artist_name: title2,
                
                album_name: type ? props.route.params.details.album_name : props.route.params.registerType === "spotify" ? props.route.params.details.album.name :
                    props.route.params.details.attributes.albumName,

                image: imgsource,

                song_uri: type ? props.route.params.details.song_uri : props.route.params.registerType === "spotify" ? props.route.params.details.preview_url === null ? spotifyUrl :
                    props.route.params.details.preview_url : props.route.params.details.attributes.previews[0].url,

                original_song_uri: type ? props.route.params.details.original_song_uri : props.route.params.registerType === "spotify" ? props.route.params.details.external_urls.spotify :
                    props.route.params.details.attributes.url,

                isrc_code: type ? props.route.params.details.isrc_code : props.route.params.registerType === "spotify" ? props.route.params.details.external_ids.isrc :
                    props.route.params.details.attributes.isrc,

                original_reg_type: type ? props.route.params.details.hasOwnProperty("social_type") ?
                    props.route.params.details.social_type : props.route.params.details.original_reg_type : props.registerType,

                read: false,
                time: moment().toString(),
            }

            chatBody.push(chatObject);

        });

        let chatPayload = {
            chatTokens: props.chatTokenList,
            chatBody: chatBody
        }

        props.sendChatMessageRequest(chatPayload);
        toast("Error", "Message sent successfully.")
        //props.navigation.goBack();

    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent firstitemtext={true}
                    textone={"CANCEL"}
                    title={"SEND SONG"}
                    thirditemtext={true}
                    texttwo={"SEND"}
                    onPressFirstItem={() => {
                        // if (fromAddAnotherSong) {
                        //     props.navigation.replace('InsideaMessage', { index: index })
                        // } else {
                        //     props.navigation.goBack();
                        // }
                        if (props.route.params.fromPlayer) {
                            props.navigation.goBack()
                        } else {
                            props.navigation.pop(2)
                        }
                    }}
                    onPressThirdItem={() => {
                        // if (search.trim() != "") {
                        sendMessage();
                        // if (fromAddAnotherSong) {
                        //     props.navigation.replace('InsideaMessage', { index: index })
                        // } else {
                        //     props.navigation.goBack();
                        // }

                        if (props.route.params.fromPlayer === true) {
                            console.log('from player')
                            props.navigation.goBack()
                        } else {
                            console.log('not from player')
                            props.navigation.pop(2)
                        }


                        // } else {
                        //     toast("Error", "Please type in a message to send");
                        // }

                    }}
                />

                <View style={{ marginTop: normalise(20), width: '92%', alignSelf: 'center', }}>

                    <TextInput style={{
                        width: '100%',
                        borderRadius: normalise(8),
                        padding: normalise(10),
                        fontFamily: 'ProximaNovaAW07-Medium',
                        color: Colors.white,
                    }} value={search}
                        multiline={true}
                        placeholder={"Add a comment"}
                        placeholderTextColor={Colors.grey}
                        onChangeText={(text) => { setSearch(text) }} />

                    <View style={{
                        marginTop: normalise(5), backgroundColor: Colors.darkerblack,
                        height: normalise(65), width: '100%', borderRadius: normalise(8), borderColor: Colors.fadeblack,
                        borderWidth: normalise(1), justifyContent: 'center', alignItems: 'center'
                    }}>

                        <View style={{
                            width: '90%', flexDirection: 'row', alignSelf: 'center',
                            justifyContent: 'flex-start', alignItems: 'center',
                        }}>

                            <TouchableOpacity>
                                <Image source={{ uri: imgsource }}
                                    style={{ height: normalise(40), width: normalise(40), borderRadius: normalise(5) }}
                                    resizeMode='contain' />
                            </TouchableOpacity>

                            <View style={{
                                alignItems: 'flex-start',
                                justifyContent: 'center', width: '85%'
                            }}>
                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.white,
                                    fontSize: normalise(11),
                                }} numberOfLines={1} >{title1}</Text>

                                <Text style={{
                                    marginLeft: normalise(20), color: Colors.grey,
                                    fontSize: normalise(10)
                                }} numberOfLines={1} >{title2}</Text>
                            </View>


                        </View>
                    </View>

                </View>

                <Text
                    style={{
                        color: Colors.grey,
                        margin: normalise(15)
                    }}
                >Sending song to:</Text>

                <FlatList       // USER SEARCH FLATLIST
                    // style={{ marginTop: usersData.length > 0 ? normalise(20) : 0 }}
                    data={usersData}
                    renderItem={renderAddUsersToMessageItem}
                    keyExtractor={(item, index) => { index.toString() }}
                    showsVerticalScrollIndicator={false}
                />



            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        status: state.MessageReducer.status,
        chatTokenList: state.MessageReducer.chatTokenList,
        sendChatResponse: state.MessageReducer.sendChatResponse,
        userProfileResp: state.UserReducer.userProfileResp,
        registerType: state.TokenReducer.registerType
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendChatMessageRequest: (payload) => {
            dispatch(sendChatMessageRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SendSongInMessageFinal);