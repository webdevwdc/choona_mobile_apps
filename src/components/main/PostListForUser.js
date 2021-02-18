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
    TextInput,
    Clipboard,
    Linking,
    Modal,
    ImageBackground,
    Dimensions
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import _ from "lodash"
import HomeItemList from '../../components/main/ListCells/HomeItemList';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import MusicPlayerBar from '../../widgets/MusicPlayerBar';
import {
    USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE,
    HOME_PAGE_REQUEST, HOME_PAGE_SUCCESS,
    HOME_PAGE_FAILURE,
    SAVE_SONGS_REQUEST, SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE,
    REACTION_ON_POST_SUCCESS,
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,
    DELETE_POST_REQUEST, DELETE_POST_SUCCESS,
    DELETE_POST_FAILURE,
    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,
    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,
} from '../../action/TypeConstants';
import {
    getProfileRequest, homePageReq, reactionOnPostRequest, userFollowUnfollowRequest,
    getUsersFromHome
} from '../../action/UserAction';
import { saveSongRequest } from '../../action/SongAction';
import { deletePostReq } from '../../action/PostAction';
import { createChatTokenRequest } from '../../action/MessageAction'
import { connect } from 'react-redux'
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';

import constants from '../../utils/helpers/constants';
import { useScrollToTop } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";

let status = "";
let songStatus = "";
let postStatus = "";
let messageStatus;

function PostListForUser(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalReact, setModalReact] = useState("");
    const [modal1Visible, setModal1Visible] = useState(false);
    const [positionInArray, setPositionInArray] = useState(0);

    const [userClicked, setUserClicked] = useState(false);
    const [userSeach, setUserSeach] = useState("");
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);

    const [posts, setPosts] = useState(props.route.params.posts)

    console.log(props.route.params.index)

    const ref = React.useRef(null);
    var bottomSheetRef;
    let changePlayer = false;

    useScrollToTop(ref);


    if (status === "" || props.status !== status) {

        switch (props.status) {

            case USER_PROFILE_REQUEST:
                status = props.status;
                break;

            case USER_PROFILE_SUCCESS:
                status = props.status;
                break;

            case USER_PROFILE_FAILURE:
                status = props.status;
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case HOME_PAGE_REQUEST:
                status = props.status;
                break;

            case HOME_PAGE_SUCCESS:
                status = props.status;
                break;

            case HOME_PAGE_FAILURE:
                status = props.status;
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case REACTION_ON_POST_SUCCESS:
                status = props.status;
                props.homePage(1)
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status;
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status;
                props.homePage(1)
                setPositionInArray(0);
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status;
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case GET_USER_FROM_HOME_REQUEST:
                status = props.status
                break;

            case GET_USER_FROM_HOME_SUCCESS:
                status = props.status
                setUserSearchData(props.userSearchFromHome)
                break;

            case GET_USER_FROM_HOME_FAILURE:
                status = props.status
                break;
        };
    };

    if (songStatus === "" || props.songStatus !== songStatus) {

        switch (props.songStatus) {

            case SAVE_SONGS_REQUEST:
                songStatus = props.songStatus
                break;

            case SAVE_SONGS_SUCCESS:
                songStatus = props.songStatus
                if (props.savedSongResponse.status === 200)
                    toast("Success", props.savedSongResponse.message)
                else
                    toast("Success", props.savedSongResponse.message)
                break;

            case SAVE_SONGS_FAILURE:
                songStatus = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };

    if (postStatus === "" || props.postStatus !== postStatus) {
        switch (props.postStatus) {

            case DELETE_POST_REQUEST:
                postStatus = props.postStatus
                break;

            case DELETE_POST_SUCCESS:
                postStatus = props.postStatus
                props.navigation.goBack();
                setPositionInArray(0);
                break;

            case DELETE_POST_FAILURE:
                postStatus = props.postStatus
                toast("Oops", "Something Went Wrong, Please Try Again")
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
                console.log('profile page');
                setUserSearchData([]);
                sesUsersToSEndSong([]);
                setUserSeach("");
                props.navigation.navigate('SendSongInMessageFinal', {
                    image: posts[positionInArray].song_image,
                    title: posts[positionInArray].song_name,
                    title2: posts[positionInArray].artist_name,
                    users: usersToSEndSong, details: posts[positionInArray], registerType: props.registerType,
                    fromAddAnotherSong: false, index: 0, fromHome: true, details: posts[positionInArray]
                });
                break;

            case CREATE_CHAT_TOKEN_FAILURE:
                messageStatus = props.messageStatus;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };


    const react = ["🔥", "😍", "💃", "🕺", "🤤", "👍"];
    let val = 0

    function hitreact(x, rindex) {

        if (!_.isEmpty(posts[rindex].reaction)) {
            console.log('here');

            const present = posts[rindex].reaction.some(obj => obj.user_id.includes(props.userProfileResp._id) && obj.text.includes(x))

            if (present) {
                console.log('nooo');
            }
            else {
                setVisible(true)
                setModalReact(x)
                setTimeout(() => {
                    setVisible(false)
                }, 2000);
            }

        }
        else {
            setVisible(true)
            setModalReact(x)
            setTimeout(() => {
                setVisible(false)
            }, 2000);
        }
    };

    function hitreact1(modal1Visible) {

        if (modal1Visible == true) {
            setModal1Visible(false)
        }
        else {
            setModal1Visible(true)
        }
    };

    function modal() {

        return (
            val = 1
        )
    };


    function sendReaction(id, reaction) {

        const myReaction = reaction == react[0] ? "A" : reaction == react[1] ? "B" : reaction == react[2] ? "C" :
            reaction == react[3] ? "D" : reaction == react[4] ? 'E' : "F";

        let reactionObject = {
            post_id: id,
            text: reaction,
            text_match: myReaction
        };
        isInternetConnected()
            .then(() => {
                props.reactionOnPostRequest(reactionObject)
            })
            .catch(() => {
                toast('Error', 'Please Connect To Internet')
            })
    };


    function renderItem(data) {
        return (

            <HomeItemList
                image={data.item.song_image}
                picture={data.item.userDetails.profile_image}
                name={data.item.userDetails.username}
                comments={data.item.comment}
                reactions={data.item.reaction}
                content={data.item.post_content}
                time={data.item.createdAt}
                title={data.item.song_name}
                singer={data.item.artist_name}
                modalVisible={modal1Visible}
                postType={data.item.social_type === "spotify"}
                onReactionPress={(reaction) => {
                    hitreact(reaction, data.index),
                        sendReaction(data.item._id, reaction);
                }}
                onPressImage={() => {
                    if (props.userProfileResp._id === data.item.user_id) {
                        props.navigation.navigate("Profile", { fromAct: false })
                    }
                    else {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item.user_id })
                    }
                }}

                onAddReaction={() => {
                    hitreact1(modal1Visible)
                }}
                onPressMusicbox={() => {
                    props.navigation.navigate('Player', {
                        comments: data.item.comment,
                        song_title: data.item.song_name,
                        album_name: data.item.album_name,
                        song_pic: data.item.song_image,
                        username: data.item.userDetails.username,
                        profile_pic: data.item.userDetails.profile_image,
                        time: data.item.time, title: data.item.title,
                        uri: data.item.song_uri,
                        reactions: data.item.reaction,
                        id: data.item._id,
                        artist: data.item.artist_name,
                        changePlayer: changePlayer,
                        originalUri: data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
                        registerType: data.item.userDetails.register_type,
                        isrc: data.item.isrc_code,
                        details: data.item
                    })
                }}
                onPressReactionbox={() => {
                    props.navigation.navigate('HomeItemReactions', { reactions: data.item.reaction, post_id: data.item._id })
                }}
                onPressCommentbox={() => {
                    props.navigation.navigate('HomeItemComments', {
                        index: data.index, comment: data.item.comment,
                        image: data.item.song_image, username: data.item.userDetails.username, userComment: data.item.post_content,
                        time: data.item.createdAt, id: data.item._id
                    });
                }}
                onPressSecondImage={() => {
                    setPositionInArray(data.index)
                    setModalVisible(true)
                }}
                marginBottom={data.index === posts.length - 1 ? normalise(60) : 0} />
            // </TouchableOpacity>
        )
    };


    function findIsNotRead() {
        let hasUnseenMessage = false;
        let arr = props.chatList;

        for (var i = 0; i < arr.length; i++) {

            chatObject = Object.values(arr[i])[0]

            if (props.userProfileResp._id == Object.values(arr[i])[0].receiver_id) {

                return !Object.values(arr[i])[0].read;
                break;
            }
        }

        return hasUnseenMessage;
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


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <HeaderComponent firstitemtext={false}
                imageone={ImagePath.backicon}
                title={props.route.params.profile_name}
                thirditemtext={true}
                texttwo={""}
                onPressFirstItem={() => { props.navigation.goBack() }}
            />

            {_.isEmpty(posts) ?

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <Image source={ImagePath.noposts} style={{ height: normalise(150), width: normalise(150), marginTop: '28%' }}
                        resizeMode='contain' />
                    <Text style={{
                        marginBottom: '20%',
                        marginTop: normalise(10), color: Colors.white,
                        fontSize: normalise(14), fontWeight: 'bold'
                    }}>NO POSTS YET</Text>


                    {/* <TouchableOpacity style={{
    height: normalise(50), width: '80%',
    borderRadius: normalise(25), backgroundColor: Colors.facebookblue, borderWidth: normalise(0.5),
    shadowColor: "#000", shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.36, shadowRadius: 6.68, elevation: 11, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center'
  }} >
    <Image source={ImagePath.facebook}
      style={{ height: normalise(20), width: normalise(20) }}
      resizeMode='contain' />

    <Text style={{
      marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
      fontWeight: 'bold'
    }}>CONNECT WITH FACEBOOK</Text>

  </TouchableOpacity>


  <TouchableOpacity style={{
    marginBottom: normalise(30),
    marginTop: normalise(10), height: normalise(50), width: '80%', alignSelf: 'center',
    borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', borderColor: Colors.grey,
  }}  >

    <Text style={{
      marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
      fontWeight: 'bold'
    }}>CHECK YOUR PHONEBOOK</Text>

  </TouchableOpacity> */}
                </View>
                :


                <View style={{ flex: 1 }}>

                    <FlatList
                        style={{ marginTop: normalise(10) }}
                        data={posts}
                        renderItem={renderItem}
                        initialScrollIndex={props.route.params.index}
                        getItemLayout={(data, index) => (
                            { length: 250, offset: normalise(385) * index, index }
                        )}
                        onScrollToIndexFailed={(val) => {
                            console.log(val)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => { index.toString() }}
                        ref={ref} />

                    {renderAddToUsers()}

                    {/* {props.status === HOME_PAGE_SUCCESS ?

                        <MusicPlayerBar onPress={() => {
                            props.navigation.navigate("Player",
                                {
                                    comments: props.playingSongRef.commentData,
                                    song_title: props.playingSongRef.song_name,
                                    album_name: props.playingSongRef.album_name,
                                    song_pic: props.playingSongRef.song_pic,
                                    username: props.playingSongRef.username,
                                    profile_pic: props.playingSongRef.profile_pic,
                                    uri: props.playingSongRef.uri,
                                    reactions: props.playingSongRef.reactionData,
                                    id: props.playingSongRef.id,
                                    artist: props.playingSongRef.artist,
                                    changePlayer: props.playingSongRef.changePlayer,
                                    originalUri: props.playingSongRef.originalUri
                                })
                        }} />
                        : null} */}



                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={visible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: '#000000',
                            opacity: 0.9,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>

                            <Text style={{ fontSize: Platform.OS === 'android' ? normalise(70) : normalise(100) }}>{modalReact}</Text>


                        </View>
                    </Modal>


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
                                            song_uri: posts[positionInArray].song_uri,
                                            song_name: posts[positionInArray].song_name,
                                            song_image: posts[positionInArray].song_image,
                                            artist_name: posts[positionInArray].artist_name,
                                            album_name: posts[positionInArray].album_name,
                                            post_id: posts[positionInArray]._id,
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
                                    onPress={() => { if (bottomSheetRef) { setModalVisible(false), bottomSheetRef.open() } }}>
                                    <Image source={ImagePath.sendicon} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white,
                                        fontSize: normalise(13), marginLeft: normalise(15),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>Send Song</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => {
                                        Clipboard.setString(posts[positionInArray].original_song_uri);
                                        setModalVisible(!modalVisible);

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
                                        setModalVisible(!modalVisible)

                                        props.userProfileResp._id !== posts[positionInArray].user_id ?                      // USER - FOLLOW/UNFOLLOW
                                            props.followUnfollowReq({ follower_id: posts[positionInArray].userDetails._id })    // USER - FOLLOW/UNFOLLOW
                                            : props.deletePostReq(posts[positionInArray]._id)                                  //  DELETE POST

                                    }}>

                                    <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        color: Colors.white, marginLeft: normalise(15),
                                        fontSize: normalise(13),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}>{props.userProfileResp._id === posts[positionInArray].user_id ? "Delete Post" :
                                        `Unfollow ${posts[positionInArray].userDetails.username}`}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                                    onPress={() => {
                                        if (props.postData[positionInArray].userDetails.register_type === props.registerType) {
                                            console.log('same reg type');
                                            setModalVisible(false)

                                            Linking.canOpenURL(props.postData[positionInArray].original_song_uri)
                                                .then(() => {
                                                    Linking.openURL(props.postData[positionInArray].original_song_uri)
                                                        .then(() => {
                                                            console.log('success')
                                                            setBool(false)
                                                        }).catch(() => {
                                                            console.log('error')
                                                        })
                                                })
                                                .catch((err) => {
                                                    console.log('unsupported')
                                                })
                                        }
                                        // else {
                                        //     console.log('diffirent reg type');
                                        //     setModalVisible(false)
                                        //     openInAppleORSpotify();
                                        // }

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
                                                    originalUri: posts[positionInArray].original_song_uri,
                                                    registerType: posts[positionInArray].social_type,
                                                    isrc: posts[positionInArray].isrc_code
                                                })
                                        else
                                            // setTimeout(()=>{
                                            //     toast("Oops", "Only, Spotify users can add to their playlist now.")
                                            // }, 1000)    
                                            props.navigation.navigate("AddToPlayListScreen", { isrc: posts[positionInArray].isrc_code })
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
                                setPositionInArray(0);
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

                </View>

            }



            {modal1Visible == true ?

                <View style={{
                    position: 'absolute',
                    margin: 20,
                    height: normalise(280),
                    width: "92%",
                    alignSelf: 'center',
                    marginHorizontal: normalise(15),
                    backgroundColor: Colors.white,
                    borderRadius: 20,
                    padding: 35,
                    bottom: 50,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }}>


                    <EmojiSelector
                        category={Categories.history}
                        showHistory={true}
                        onEmojiSelected={emoji => {
                            setVisible(true), setModalReact(emoji),
                                setTimeout(() => {
                                    setVisible(false)
                                }, 2000)
                        }}
                    />

                </View>
                : null}



        </View>
    )
};


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


const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp,
        postData: state.UserReducer.postData,
        reactionResp: state.UserReducer.reactionResp,
        songStatus: state.SongReducer.status,
        savedSongResponse: state.SongReducer.savedSongResponse,
        playingSongRef: state.SongReducer.playingSongRef,
        chatList: state.MessageReducer.chatList,
        messageStatus: state.MessageReducer.status,
        postStatus: state.PostReducer.status,
        userSearchFromHome: state.UserReducer.userSearchFromHome,
        messageStatus: state.MessageReducer.status,
        registerType: state.TokenReducer.registerType,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfileReq: () => {
            dispatch(getProfileRequest())
        },

        homePage: (offset) => {
            dispatch(homePageReq(offset))
        },

        saveSongReq: (payload) => {
            dispatch(saveSongRequest(payload))
        },

        reactionOnPostRequest: (payload) => {
            dispatch(reactionOnPostRequest(payload))
        },

        followUnfollowReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },

        deletePostReq: (payload) => {
            dispatch(deletePostReq(payload))
        },

        getusersFromHome: (payload) => {
            dispatch(getUsersFromHome(payload))
        },

        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenRequest(payload))

        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostListForUser)