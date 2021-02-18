import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Modal,
    Clipboard,
    Keyboard,
    Linking,
    FlatList,
    TextInput,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import InsideMessegeHeader from '../../widgets/InsideMessegeHeader';
import SavedSongsListItem from '../main/ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../utils/MyStatusBar';
import { loadChatMessageRequest, searchMessageRequest, deleteMessageRequest, createChatTokenRequest } from '../../action/MessageAction'
import {
    getUsersFromHome
} from '../../action/UserAction';
import { saveSongRequest } from '../../action/SongAction';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import {

    CHAT_LOAD_REQUEST,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAILURE,

    SEARCH_MESSAGE_REQUEST,
    SEARCH_MESSAGE_SUCCESS,
    SEARCH_MESSAGE_FAILURE,

    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,

    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,


} from '../../action/TypeConstants'
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import _ from 'lodash'
import RBSheet from "react-native-raw-bottom-sheet";
import { getSpotifyToken } from '../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../utils/helpers/AppleDevToken';
import axios from 'axios';
import isInternetConnected from '../../utils/helpers/NetInfo';

let status = ""
let userStatus = "";

function InsideaMessage(props) {

    const [index, setIndex] = useState(props.route.params.index);
    const [chatData, setChatData] = useState([]);

    const [search, setSearch] = useState("");
    const [bool, setBool] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [positionInArray, setPositionInArray] = useState(0);
    const [userClicked, setUserClicked] = useState(false);
    const [userSeach, setUserSeach] = useState("");
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);

    var bottomSheetRef;

    useEffect(function () {

        props.loadChatMessageRequest({ chatToken: props.chatList[index].chat_token, isMount: true, userId: props.userProfileResp._id });

        return () => {

            props.loadChatMessageRequest({ chatToken: props.chatList[index].chat_token, isMount: false, userId: props.userProfileResp._id })
        }
    }, []);

    // if (status === "" || props.status !== status) {
    //     switch (props.status) {
    //         case CHAT_LOAD_REQUEST:
    //             status = props.status
    //             break;

    //         case CHAT_LOAD_SUCCESS:
    //             status = props.status;
    //             setChatData(props.chatData)
    //             break;

    //         case CHAT_LOAD_FAILURE:
    //             status = props.status
    //             toast("Oops", "Something Went Wrong, Please Try Again")
    //             break;
    //     }
    // };
    if (status === "" || props.status !== status) {
        switch (props.status) {

            case CREATE_CHAT_TOKEN_REQUEST:
                status = props.status
                break;

            case CREATE_CHAT_TOKEN_SUCCESS:
                status = props.status
                console.log('inside a message')
                setUserSearchData([]);
                sesUsersToSEndSong([]);
                setUserSeach("");
                props.navigation.navigate('SendSongInMessageFinal', {
                    image: props.searchedChatData[positionInArray].image,
                    title: props.searchedChatData[positionInArray].song_name,
                    title2: props.searchedChatData[positionInArray].artist_name,
                    users: usersToSEndSong, details: props.searchedChatData[positionInArray], registerType: props.registerType,
                    fromAddAnotherSong: false, index: 0, fromHome: true, details: props.searchedChatData[positionInArray]
                });
                break;

            case CREATE_CHAT_TOKEN_FAILURE:
                status = props.status;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };

    if (userStatus === "" || props.userStatus !== userStatus) {

        switch (props.userStatus) {

            case GET_USER_FROM_HOME_REQUEST:
                userStatus = props.userStatus
                break;

            case GET_USER_FROM_HOME_SUCCESS:
                userStatus = props.userStatus
                setUserSearchData(props.userSearchFromHome)
                break;

            case GET_USER_FROM_HOME_FAILURE:
                userStatus = props.userStatus
                break;
        };
    };

    function hideKeyboard() {

        if (typingTimeout) {
            clearInterval(typingTimeout)
        }
        setTypingTimeout(setTimeout(() => {
            Keyboard.dismiss();
        }, 1500))

    }


    function renderItem(data) {

        console.log(JSON.stringify(data.item.userDeletedArr));

        return (
            <View>
                {data.item.hasOwnProperty("userDeletedArr") ?
                    data.item.userDeletedArr.includes(props.userProfileResp._id) ? null :
                        <SavedSongsListItem
                            image={data.item.image}
                            title={data.item.song_name}
                            singer={data.item.artist_name}
                            comments={data.item.message[data.item.message.length - 1].text}
                            onPress={() => {
                                setModalVisible(true),
                                    setPositionInArray(data.index)
                            }}
                            onPressItem={() => {
                                props.navigation.navigate('Player', {
                                    song_title: data.item.song_name,
                                    album_name: data.item.album_name,
                                    song_pic: data.item.image,
                                    uri: data.item.hasOwnProperty('song_uri') ? data.item.song_uri : null,
                                    artist: data.item.artist_name,
                                    changePlayer: true,
                                    comingFromMessage: true,
                                    comments: data.item.message,
                                    key: data.item.key,
                                    chatToken: props.chatList[index].chat_token,
                                    receiver_id: props.userProfileResp._id === data.item.receiver_id ? data.item.sender_id : data.item.receiver_id, //data.item.sender_id
                                    sender_id: props.userProfileResp._id, //data.item.receiver_id
                                    isrc: data.item.isrc_code,
                                    originalUri: data.item.hasOwnProperty('original_song_uri') ? data.item.original_song_uri :
                                        undefined,
                                    registerType: data.item.original_reg_type,
                                    details: data.item

                                })
                            }}
                            onPressImage={() => {
                                props.navigation.navigate('Player', {
                                    song_title: data.item.song_name,
                                    album_name: data.item.album_name,
                                    song_pic: data.item.image,
                                    uri: data.item.hasOwnProperty('song_uri') ? data.item.song_uri : null,
                                    artist: data.item.artist_name,
                                    changePlayer: true,
                                    comingFromMessage: true,
                                    comments: data.item.message,
                                    key: data.item.key,
                                    chatToken: props.chatList[index].chat_token,
                                    receiver_id: props.userProfileResp._id === data.item.receiver_id ? data.item.sender_id : data.item.receiver_id, //data.item.sender_id
                                    sender_id: props.userProfileResp._id, //data.item.receiver_id
                                    isrc: data.item.isrc_code,
                                    originalUri: data.item.hasOwnProperty('original_song_uri') ? data.item.original_song_uri :
                                        undefined,
                                    registerType: data.item.original_reg_type,
                                    details: data.item
                                })
                            }}
                            marginBottom={data.index === chatData.length - 1 ? normalise(20) : 0} /> :
                    <SavedSongsListItem
                        image={data.item.image}
                        title={data.item.song_name}
                        singer={data.item.artist_name}
                        comments={data.item.message[data.item.message.length - 1].text}
                        onPress={() => {
                            setModalVisible(true),
                                setPositionInArray(data.index)
                        }}
                        onPressItem={() => {
                            props.navigation.navigate('Player', {
                                song_title: data.item.song_name,
                                album_name: data.item.album_name,
                                song_pic: data.item.image,
                                uri: data.item.hasOwnProperty('song_uri') ? data.item.song_uri : null,
                                artist: data.item.artist_name,
                                changePlayer: true,
                                comingFromMessage: true,
                                comments: data.item.message,
                                key: data.item.key,
                                chatToken: props.chatList[index].chat_token,
                                receiver_id: props.userProfileResp._id === data.item.receiver_id ? data.item.sender_id : data.item.receiver_id, //data.item.sender_id
                                sender_id: props.userProfileResp._id, //data.item.receiver_id
                                isrc: data.item.isrc_code,
                                originalUri: data.item.hasOwnProperty('original_song_uri') ? data.item.original_song_uri :
                                    undefined,
                                registerType: data.item.original_reg_type,
                                details: data.item

                            })
                        }}
                        onPressImage={() => {
                            props.navigation.navigate('Player', {
                                song_title: data.item.song_name,
                                album_name: data.item.album_name,
                                song_pic: data.item.image,
                                uri: data.item.hasOwnProperty('song_uri') ? data.item.song_uri : null,
                                artist: data.item.artist_name,
                                changePlayer: true,
                                comingFromMessage: true,
                                comments: data.item.message,
                                key: data.item.key,
                                chatToken: props.chatList[index].chat_token,
                                receiver_id: props.userProfileResp._id === data.item.receiver_id ? data.item.sender_id : data.item.receiver_id, //data.item.sender_id
                                sender_id: props.userProfileResp._id, //data.item.receiver_id
                                isrc: data.item.isrc_code,
                                originalUri: data.item.hasOwnProperty('original_song_uri') ? data.item.original_song_uri :
                                    undefined,
                                registerType: data.item.original_reg_type,
                                details: data.item
                            })
                        }}
                        marginBottom={data.index === chatData.length - 1 ? normalise(20) : 0} />}

            </View>
        )



    }

    // function filterArray(keyword) {

    //     let data = _.filter(props.chatData, (item) => {
    //         return item.song_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    //     });

    //     setChatData(data);

    // };

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
                        //     let array = [...usersToSEndSong]
                        //     array.push(data.item)
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


    const searchUser = (text) => {
        if (text.length >= 1) {
            props.getusersFromHome({ keyword: text })
        };
    };


    function sendMessagesToUsers() {
        var userIds = []
        usersToSEndSong.map((users) => {
            userIds.push(users._id);
        })
        props.createChatTokenRequest(userIds);
    };


    // BOTTOM SHEET FOR SELECTING USERS
    const renderAddToUsers = () => {
        return (
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
                                    position: 'absolute', right: 0, top: normalise(12),
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
                                maxHeight: normalise(50),
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
        )
    };


    // GET ISRC CODE
    const callApi = async () => {
        if (props.registerType === 'spotify') {

            const spotifyToken = await getSpotifyToken();

            return await axios.get(`https://api.spotify.com/v1/search?q=isrc:${props.searchedChatData[positionInArray].isrc_code}&type=track`, {
                headers: {
                    "Authorization": spotifyToken
                }
            });
        }
        else {
            const AppleToken = await getAppleDevToken();

            return await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.searchedChatData[positionInArray].isrc_code}`, {
                headers: {
                    "Authorization": AppleToken
                }
            });
        }
    };


    //OPEN IN APPLE / SPOTIFY
    const openInAppleORSpotify = async () => {

        try {
            const res = await callApi();
            console.log(res);

            if (res.status === 200) {
                if (!_.isEmpty(props.registerType === 'spotify' ? res.data.tracks.items : res.data.data)) {

                    if (props.userProfileResp.register_type === 'spotify') {
                        console.log('success - spotify');
                        console.log(res.data.tracks.items[0].external_urls.spotify)
                        Linking.canOpenURL(res.data.tracks.items[0].external_urls.spotify)
                            .then((supported) => {
                                if (supported) {
                                    Linking.openURL(res.data.tracks.items[0].external_urls.spotify)
                                        .then(() => {
                                            console.log('success');
                                        })
                                        .catch(() => {
                                            console.log('error')
                                        })
                                }
                            })
                            .catch(() => {
                                console.log('not supported')
                            })
                        setBool(false)
                    }
                    else {

                        console.log('success - apple');
                        console.log(res.data.data[0].attributes.url);
                        Linking.canOpenURL(res.data.data[0].attributes.url)
                            .then((supported) => {
                                if (supported) {
                                    Linking.openURL(res.data.data[0].attributes.url)
                                        .then(() => {
                                            console.log('success');
                                        })
                                        .catch(() => {
                                            console.log('error')
                                        })
                                }
                            })
                            .catch(() => {
                                console.log('not supported')
                            })
                    }
                }

                else {
                    toast('', 'No Song Found');
                }

            }
            else {
                toast('Oops', 'Something Went Wrong');
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <Loader visible={props.status === CHAT_LOAD_REQUEST} />

            <StatusBar />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1 }}>

                    {renderAddToUsers()}

                    <InsideMessegeHeader
                        firstitemtext={false}
                        imageone={constants.profile_picture_base_url + props.userProfileResp.profile_image}
                        imagesecond={constants.profile_picture_base_url + props.chatList[index].profile_image}
                        title={props.chatList[index].username}
                        thirditemtext={false}
                        // imagetwo={ImagePath.newmessage} 
                        imagetwoheight={25}
                        imagetwowidth={25}
                        onPressFirstItem={() => { props.navigation.goBack() }} />

                    <View style={{
                        width: '92%',
                        alignSelf: 'center',
                    }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30), paddingRight: normalise(50)
                        }} value={search}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => { setSearch(text), props.searchMessageRequest(text) }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => { setSearch(""), props.searchMessageRequest("") }}
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

                    <SwipeListView
                        data={props.searchedChatData}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => { index.toString() }}
                        disableRightSwipe={true}
                        rightOpenValue={-75} />



                    <TouchableOpacity style={{
                        marginBottom: normalise(30),
                        marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
                        borderRadius: normalise(25), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                        shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                        shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center', borderColor: Colors.grey,
                    }} onPress={() => {
                        props.navigation.replace('AddAnotherSong', {
                            users: [{
                                _id: props.searchedChatData[0].receiver_id === props.userProfileResp._id ? props.searchedChatData[0].sender_id :
                                    props.searchedChatData[0].receiver_id, username: props.chatList[index].username, full_name: props.chatList[index].full_name,
                                profile_image: props.chatList[index].profile_image,
                            }], index: index, othersProfile: false
                        })
                    }}>

                        <Text style={{
                            marginLeft: normalise(10), color: Colors.gray, fontSize: normalise(14),
                            fontFamily: 'ProximaNova-Extrabld',
                        }}>ADD ANOTHER SONG</Text>

                    </TouchableOpacity>



                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                        }}
                    >
                        <ImageBackground
                            source={ImagePath.page_gradient}
                            style={styles.centeredView}
                        >

                            <View
                                style={styles.modalView}
                            >
                                <Text style={{
                                    color: Colors.white,
                                    fontSize: normalise(12),
                                    fontFamily: 'ProximaNova-Semibold',

                                }}>MORE</Text>

                                <View style={{
                                    backgroundColor: Colors.activityBorderColor,
                                    height: 0.5,
                                    marginTop: normalise(12),
                                    marginBottom: normalise(12)
                                }} />

                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(10) }}
                                    onPress={() => {
                                        let saveSongObject = {
                                            song_uri: props.searchedChatData[positionInArray].song_uri,
                                            song_name: props.searchedChatData[positionInArray].song_name,
                                            song_image: props.searchedChatData[positionInArray].image,
                                            artist_name: props.searchedChatData[positionInArray].artist_name,
                                            album_name: props.searchedChatData[positionInArray].album_name,
                                            chat_id: props.searchedChatData[positionInArray].key,
                                            type: "chat",
                                            isrc_code: props.searchedChatData[positionInArray].isrc_code,
                                            original_song_uri: props.searchedChatData[positionInArray].original_song_uri,
                                            original_reg_type: props.searchedChatData[positionInArray].original_reg_type
                                        };

                                        props.saveSongReq(saveSongObject);
                                        setModalVisible(!modalVisible)

                                    }}>

                                    <Image source={ImagePath.boxicon} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Save Song</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                                    onPress={() => { setModalVisible(!modalVisible), bottomSheetRef.open() }}
                                >
                                    <Image source={ImagePath.sendicon} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white,
                                        fontSize: normalise(13), marginLeft: normalise(15),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Send Song to another user</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => {
                                        Clipboard.setString(props.searchedChatData[positionInArray].original_song_uri);
                                        setModalVisible(!modalVisible);
                                        setPositionInArray(0)
                                        setTimeout(() => {
                                            toast("Success", "Song copied to clipboard.")
                                        }, 1000);

                                    }}
                                    style={{ flexDirection: 'row', marginTop: normalise(18) }}>
                                    <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Copy Link</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                                    onPress={() => {
                                        if (props.chatData.length > 1) {
                                            let deleteMessagPayload = {
                                                ChatId: props.searchedChatData[positionInArray].key,
                                                chatToken: props.chatList[index].chat_token,
                                            }
                                            props.deleteMessageRequest(deleteMessagPayload)
                                            setModalVisible(!modalVisible);
                                            setPositionInArray(0)
                                        }
                                        else {
                                            setModalVisible(!modalVisible);
                                            setTimeout(() => {
                                                toast('', 'Last Message of a converstaion cannot be deleted');
                                            }, 1000);
                                        }
                                    }
                                    }
                                >

                                    <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Delete Song</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                                    onPress={() => {
                                        if (props.searchedChatData[positionInArray].original_reg_type === props.registerType) {
                                            console.log('same reg type');
                                            setModalVisible(false)
                                            Linking.canOpenURL(props.searchedChatData[positionInArray].original_song_uri)
                                                .then(() => {
                                                    Linking.openURL(props.searchedChatData[positionInArray].original_song_uri)
                                                        .then(() => {
                                                            console.log('success')

                                                        }).catch(() => {
                                                            console.log('error')
                                                        })
                                                })
                                                .catch((err) => {
                                                    console.log('unsupported')
                                                })
                                        }
                                        else {
                                            console.log('diffirent reg type');
                                            setModalVisible(false)
                                            isInternetConnected().then(() => {
                                                openInAppleORSpotify();
                                            })
                                                .catch(() => {
                                                    toast('', 'Please Connect To Internet')
                                                })
                                        }

                                    }}
                                >
                                    <Image source={props.userProfileResp.register_type === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic}
                                        style={{ height: normalise(18), width: normalise(18), borderRadius: normalise(9) }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>{props.userProfileResp.register_type === 'spotify' ? "Open on Spotify" : "Open on Apple"}</Text>
                                </TouchableOpacity>



                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                                    onPress={() => {
                                        setModalVisible(!modalVisible)
                                        if (props.userProfileResp.register_type === 'spotify')
                                            props.navigation.navigate('AddToPlayListScreen',
                                                {
                                                    originalUri: props.searchedChatData[positionInArray].original_song_uri,
                                                    registerType: props.searchedChatData[positionInArray].original_reg_type,
                                                    isrc: props.searchedChatData[positionInArray].isrc_code
                                                })
                                        else
                                            // setTimeout(() => {
                                            //     toast("Oops", "Only, Spotify users can add to their playlist now.")
                                            // }, 1000)
                                            props.navigation.navigate("AddToPlayListScreen", { isrc: props.searchedChatData[positionInArray].isrc_code })
                                    }}
                                >
                                    <Image source={ImagePath.addicon}
                                        style={{ height: normalise(18), width: normalise(18), borderRadius: normalise(9) }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Add to Playlist</Text>

                                </TouchableOpacity>

                            </View>


                            <TouchableOpacity onPress={() => {
                                setModalVisible(!modalVisible);
                                setPositionInArray(0)
                            }}

                                style={{
                                    marginStart: normalise(20),
                                    marginEnd: normalise(20),
                                    marginBottom: normalise(20),
                                    height: normalise(50),
                                    width: "95%",
                                    backgroundColor: Colors.darkerblack,
                                    opacity: 10,
                                    borderRadius: 20,
                                    // padding: 35,
                                    alignItems: "center",
                                    justifyContent: 'center',

                                }}>


                                <Text style={{
                                    fontSize: normalise(12),
                                    fontFamily: 'ProximaNova-Bold',
                                    color: Colors.white
                                }}>CANCEL</Text>

                            </TouchableOpacity>
                        </ImageBackground>
                    </Modal>
                </SafeAreaView>
            </TouchableWithoutFeedback>

        </View>
    )
}

const mapStateToProps = state => {
    return {
        chatList: state.MessageReducer.chatList,
        chatData: state.MessageReducer.chatData,
        searchedChatData: state.MessageReducer.searchedChatData,
        userProfileResp: state.UserReducer.userProfileResp,
        userSearchFromHome: state.UserReducer.userSearchFromHome,
        registerType: state.TokenReducer.registerType,
        status: state.MessageReducer.status,
        userStatus: state.UserReducer.status,
        error: state.MessageReducer.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadChatMessageRequest: (payload) => {
            dispatch(loadChatMessageRequest(payload))
        },
        searchMessageRequest: (payload) => {
            dispatch(searchMessageRequest(payload))
        },
        deleteMessageRequest: (payload) => {
            dispatch(deleteMessageRequest(payload))
        },
        getusersFromHome: (payload) => {
            dispatch(getUsersFromHome(payload))
        },
        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenRequest(payload))
        },
        saveSongReq: (payload) => {
            dispatch(saveSongRequest(payload))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InsideaMessage);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    modalView: {
        marginBottom: normalise(10),
        height: normalise(290),
        width: "95%",
        backgroundColor: Colors.darkerblack,
        borderRadius: 20,
        padding: 20,
        paddingTop: normalise(20)

    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,

    }
});