
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import SavedSongsListItem from './ListCells/SavedSongsListItem';
import StatusBar from '../../utils/MyStatusBar';
import _ from 'lodash';
import RBSheet from "react-native-raw-bottom-sheet";
import { seachSongsForPostRequest } from '../../action/PostAction';
import { userSearchRequest } from '../../action/UserAction';
import { createChatTokenRequest } from '../../action/MessageAction'
import {
    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
    SEARCH_SONG_REQUEST_FOR_POST_FAILURE,

    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,

} from '../../action/TypeConstants';
import { connect } from 'react-redux';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import constants from '../../utils/helpers/constants';
import isInternetConnected from '../../utils/helpers/NetInfo';

let status;
let messageStatus;

function AddAnotherSong(props) {

    const [search, setSearch] = useState("");
    const [usersToSend, setUsersToSend] = useState(props.route.params.users);
    const [result, setResult] = useState([]);
    const [index, setIndex] = useState([])
    const [indexOfArray, setIndexOfArray] = useState(props.route.params.index);
    const [fromOthersProfile, setFromOthersProfile] = useState(props.route.params.othersProfile)

    let post = false;

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            setResult([]);
        });

        return () => {
            unsuscribe();
        }
    });

    if (status === "" || props.status !== status) {
        switch (props.status) {

            case SEARCH_SONG_REQUEST_FOR_POST_REQUEST:
                status = props.status
                break;

            case SEARCH_SONG_REQUEST_FOR_POST_SUCCESS:
                status = props.status
                setResult(props.searchResponse)
                break;

            case SEARCH_SONG_REQUEST_FOR_POST_FAILURE:
                status = props.status;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };

    if (messageStatus === "" || props.messageStatus !== messageStatus) {
        switch (props.messageStatus) {

            case CREATE_CHAT_TOKEN_REQUEST:
                messageStatus = props.messageStatus
                break;

            case CREATE_CHAT_TOKEN_SUCCESS:
                messageStatus = props.messageStatus

                props.navigation.replace('SendSongInMessageFinal', {
                    image: props.registerType === 'spotify' ? result[index].album.images[0].url : result[index].attributes.artwork.url.replace('{w}x{h}', '600x600'),
                    title: props.registerType === 'spotify' ? result[index].name : result[index].attributes.name,
                    title2: props.registerType === 'spotify' ? singerList(result[index].artists) : result[index].attributes.artistName,
                    users: usersToSend, details: result[index], registerType: props.registerType,
                    fromAddAnotherSong: fromOthersProfile ? false : true, index: indexOfArray, fromHome: false
                })
                break;

            case CREATE_CHAT_TOKEN_FAILURE:
                messageStatus = props.messageStatus;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };



    function sendMessagesToUsers() {
        var userIds = []
        usersToSend.map((users) => {
            userIds.push(users._id);
        })
        props.createChatTokenRequest(userIds);
    };


    function singerList(artists) {

        let names = ""

        artists.map((val, index) => {
            names = names + `${val.name}${artists.length - 1 === index ? "" : ", "}`
        })

        return names
    };



    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={props.registerType === 'spotify' ? data.item.album.images[0].url : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300')}
                title={props.registerType === 'spotify' ? data.item.name : data.item.attributes.name}
                singer={props.registerType === 'spotify' ? singerList(data.item.artists) : data.item.attributes.artistName}
                marginRight={normalise(50)}
                marginBottom={data.index === props.searchResponse.length - 1 ? normalise(20) : 0}
                change={true}
                image2={ImagePath.addicon}
                onPressSecondImage={() => {
                    setIndex(data.index)
                    sendMessagesToUsers();
                }}
                onPressImage={() => {
                    props.navigation.navigate("Player",
                        {
                            song_title: props.registerType === 'spotify' ? data.item.name : data.item.attributes.name,
                            album_name: props.registerType === "spotify" ? data.item.album.name :
                                data.item.attributes.albumName,
                            song_pic: props.registerType === 'spotify' ? data.item.album.images[0].url : data.item.attributes.artwork.url.replace('{w}x{h}', '300x300'),
                            username: "",
                            profile_pic: "",
                            originalUri: props.registerType === "spotify" ? data.item.external_urls.spotify :
                                data.item.attributes.url,
                            uri: props.registerType === "spotify" ? data.item.preview_url :
                                data.item.attributes.previews[0].url,
                            id: "",
                            artist: props.registerType === 'spotify' ? singerList(data.item.artists) : data.item.attributes.artistName,
                            changePlayer: true,
                            registerType: props.registerType,
                            changePlayer2: props.registerType === 'spotify' ? true : false,
                            id: props.registerType === 'spotify' ? data.item.id : null,
                            showPlaylist: false
                        })
                }}
            />
        )
    };


    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === SEARCH_SONG_REQUEST_FOR_POST_REQUEST} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1, }}>

                    <HeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon}
                        title={`CHOOSE SONG TO SEND`}
                        thirditemtext={true}
                        imagetwo={ImagePath.newmessage}
                        imagetwoheight={25}
                        imagetwowidth={25}
                        onPressFirstItem={() => {
                            props.navigation.goBack()
                        }} />

                    <View style={{ width: '92%', alignSelf: 'center', }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30)
                        }} value={search}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => {
                                setSearch(text);
                                if (text.length >= 1) {
                                    isInternetConnected().then(() => {
                                        props.searchSongReq(text, post)
                                    }).catch(() => {
                                        toast('Error', 'Please Connect To Internet')
                                    })
                                }
                            }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => { setSearch(""), setResult([]) }}
                                style={{
                                    position: 'absolute', right: 0,
                                    bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                    paddingRight: normalise(10)
                                }}>
                                <Text style={{
                                    color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                                }}>CLEAR</Text>

                            </TouchableOpacity>}

                    </View>

                    {_.isEmpty(result) ? null :
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center',
                            marginTop: normalise(5)
                        }}>
                            <Image source={props.registerType === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                style={{ height: normalise(20), width: normalise(20) }} />
                            <Text style={{
                                color: Colors.white, fontSize: normalise(12), marginLeft: normalise(10),
                                fontWeight: 'bold'
                            }}> RESULTS ({result.length})</Text>

                        </View>}


                    {_.isEmpty(result) ?

                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                            <Image source={ImagePath.searchicongrey} style={{ height: normalise(25), width: normalise(25) }} />

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15),
                                fontFamily: 'ProximaNovaAW07-Medium',
                                marginTop: normalise(20), width: '60%', textAlign: 'center'
                            }}>
                                Search for the song you want to share </Text>

                        </View>

                        : <FlatList
                            style={{ marginTop: normalise(10) }}
                            data={result}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />
                    }

                </SafeAreaView>
            </TouchableWithoutFeedback>
        </View >
    )
};


const mapStateToProps = (state) => {
    return {
        status: state.PostReducer.status,
        error: state.PostReducer.error,
        searchResponse: state.PostReducer.chooseSongToSend,
        registerType: state.TokenReducer.registerType,
        userStatus: state.UserReducer.status,
        SearchData: state.UserReducer.sendSongUserSearch,
        messageStatus: state.MessageReducer.status,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchSongReq: (text, post) => {
            dispatch(seachSongsForPostRequest(text, post))
        },

        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAnotherSong);