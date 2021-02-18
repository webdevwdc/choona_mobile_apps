
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
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

    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,

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
let userReducerStatus;
let messageStatus;

function AddSongsInMessage(props) {

    const [search, setSearch] = useState("");
    const [userSeach, setUserSeach] = useState("");
    const [userClicked, setUserClicked] = useState(false);
    const [result, setResult] = useState([]);
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);
    const [index, setIndex] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);


    let post = false;
    let sendSong = true;

    var bottomSheetRef;

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

    if (userReducerStatus === "" || props.userStatus !== userReducerStatus) {
        switch (props.userStatus) {

            case USER_SEARCH_REQUEST:
                userReducerStatus = props.userStatus
                break;

            case USER_SEARCH_SUCCESS:
                userReducerStatus = props.userStatus
                setUserSearchData(props.SearchData)
                break;

            case USER_SEARCH_FAILURE:
                userReducerStatus = props.userStatus;
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
                    users: usersToSEndSong, details: result[index], registerType: props.registerType,
                    fromAddAnotherSong: false, index: 0, fromHome: false
                })
                break;

            case CREATE_CHAT_TOKEN_FAILURE:
                messageStatus = props.messageStatus;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };

    function hideKeyboard() {

        if (typingTimeout) {
            clearInterval(typingTimeout)
        }
        setTypingTimeout(setTimeout(() => {
            Keyboard.dismiss();
        }, 1500))

    }

    function sendMessagesToUsers() {
        var userIds = []
        usersToSEndSong.map((users) => {
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


    const searchUser = (text) => {
        if (text.length >= 1) {
            props.userSearchReq({ keyword: text }, sendSong)
        }

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
                    bottomSheetRef.open()
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


    // RENDER USER SEARCH FLATLIST DATA
    function renderAddUsersToMessageItem(data) {

        return (
            <TouchableOpacity style={{
                marginTop: normalise(10),
                width: "87%",
                alignSelf: 'center'
            }}
                onPress={() => {

                    if (usersToSEndSong.length > 0) {

                        // let idArray = [];

                        // usersToSEndSong.map((item, index) => {

                        //     idArray.push(item._id)

                        // });
                        // if (idArray.includes(data.item._id)) {
                        //     console.log('Already Exists');
                        // }
                        // else {
                        //     let array = [...usersToSEndSong];
                        //     array.push(data.item);
                        //     sesUsersToSEndSong(array);
                        // };

                        toast('Error', 'You can select one user at a time');

                    } else {
                        let array = [...usersToSEndSong]
                        array.push(data.item)
                        sesUsersToSEndSong(array);
                    }
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


    // RENDER ADD TO FLATLIST DATA
    function renderUsersToSendSongItem(data) {
        return (
            <TouchableOpacity style={{
                height: normalize(30),
                paddingHorizontal: normalise(18),
                marginStart: normalise(20),
                marginTop: normalise(5),
                borderRadius: 25,
                alignItems: 'center', justifyContent: "center",
                backgroundColor: 'white',
                marginEnd: data.index === usersToSEndSong.length - 1 ? normalise(20) : 0
            }}>
                <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{data.item.username}</Text>
                <TouchableOpacity style={{
                    position: 'absolute', right: 0, top: -4,
                    height: 25, width: 25,
                    borderRadius: 12
                }}
                    onPress={() => {
                        let popArray = [...usersToSEndSong];
                        popArray.splice(data.index, 1)
                        sesUsersToSEndSong(popArray);
                    }}>

                    <Image
                        source={ImagePath.crossIcon}
                        style={{
                            marginTop: normalise(-1.5),
                            marginStart: normalise(8.5),
                            height: 25, width: 25,
                        }} />
                </TouchableOpacity>

            </TouchableOpacity>
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
                        onPressFirstItem={() => { props.navigation.goBack() }} />

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
                        />}


                    <RBSheet
                        ref={ref => {
                            if (ref) {
                                bottomSheetRef = ref;
                            }
                        }}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        onClose={() => {
                            //sesUsersToSEndSong([]) 
                        }}
                        nestedScrollEnabled={true}
                        keyboardAvoidingViewEnabled={true}
                        height={normalize(500)}
                        duration={250}
                        customStyles={{
                            container: {
                                backgroundColor: Colors.black,
                                borderTopEndRadius: normalise(8),
                                borderTopStartRadius: normalise(8),
                            },
                            // wrapper: {
                            //     backgroundColor: 'rgba(87,97,145,0.5)'

                            // },
                            draggableIcon: {
                                backgroundColor: Colors.grey,
                                width: normalise(70),
                                height: normalise(3)
                            }

                        }}>

                        <View
                            style={{ flex: 1 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ flexDirection: 'row', width: '75%', justifyContent: 'flex-end' }}>
                                    <Text style={{
                                        color: Colors.white,
                                        fontSize: normalise(14),
                                        fontWeight: 'bold',
                                        marginTop: normalise(10),
                                        textAlign: 'right'
                                    }}>
                                        SELECT USER TO SEND TO</Text>

                                    {userClicked ?
                                        <Text style={{
                                            color: Colors.white,
                                            marginTop: normalise(10),
                                            fontSize: normalise(14),
                                            fontWeight: 'bold',
                                        }}> (1)</Text> : null}

                                </View>

                                {usersToSEndSong.length > 0 ?

                                    <TouchableOpacity
                                        onPress={() => {
                                            bottomSheetRef.close(),
                                                sendMessagesToUsers();
                                        }}>
                                        <Text style={{
                                            color: Colors.white,
                                            fontSize: normalise(12),
                                            fontWeight: 'bold',
                                            marginTop: normalise(10),
                                            marginEnd: normalise(15)
                                        }}>
                                            {`NEXT`}</Text>
                                    </TouchableOpacity> : null}

                            </View>

                            <View style={{
                                width: '90%', alignSelf: 'center',
                                height: normalise(35), marginTop: normalise(20),
                                borderRadius: normalise(8),
                                backgroundColor: Colors.fadeblack,
                            }}>

                                <TextInput style={{
                                    height: normalise(35),
                                    width: '85%',
                                    padding: normalise(10),
                                    color: Colors.white, paddingLeft: normalise(30)
                                }} value={userSeach}
                                    placeholder={"Search"}
                                    placeholderTextColor={Colors.grey_text}
                                    onChangeText={(text) => { setUserSeach(text), searchUser(text) }} />

                                <Image source={ImagePath.searchicongrey}
                                    style={{
                                        height: normalise(15), width: normalise(15), bottom: normalise(25),
                                        paddingLeft: normalise(30)
                                    }} resizeMode="contain" />

                                {userSeach === "" ? null :
                                    <TouchableOpacity onPress={() => { setUserSeach(""), setUserSearchData([]) }}
                                        style={{
                                            position: 'absolute', right: 0, top: normalise(9.5),
                                            paddingRight: normalise(10)
                                        }}>
                                        <Text style={{
                                            color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                                        }}>CLEAR</Text>

                                    </TouchableOpacity>}
                            </View>



                            {usersToSEndSong.length > 0 ?       // ADD TO ARRAY FLATLIST
                                <FlatList
                                    style={{
                                        marginTop: normalise(10),
                                        maxHeight: normalise(50)
                                    }}
                                    horizontal={true}
                                    data={usersToSEndSong}
                                    renderItem={renderUsersToSendSongItem}
                                    keyExtractor={(item, index) => { index.toString() }}
                                    showsHorizontalScrollIndicator={false}
                                />
                                : null}


                            <FlatList       // USER SEARCH FLATLIST
                                style={{
                                    height: '65%',
                                    marginTop: usersToSEndSong.length > 0 ? 0 : normalise(5)
                                }}
                                data={userSearchData}
                                renderItem={renderAddUsersToMessageItem}
                                keyExtractor={(item, index) => { index.toString() }}
                                showsVerticalScrollIndicator={false}
                            />


                        </View>
                    </RBSheet>
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

        userSearchReq: (payload, sendSong) => {
            dispatch(userSearchRequest(payload, sendSong))
        },
        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSongsInMessage);