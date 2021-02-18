import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image, Clipboard,
    Keyboard, TouchableWithoutFeedback,
    TextInput, ImageBackground,
    TouchableOpacity, Modal
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import StatusBar from '../../../utils/MyStatusBar';
import HeaderComponent from '../../../widgets/HeaderComponent';
import ImagePath from '../../../assests/ImagePath';
import { FlatList } from 'react-native-gesture-handler';
import ActivityListItem from '../ListCells/ActivityListItem';
import HomeItemList from '../ListCells/HomeItemList';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    USER_SEARCH_REQUEST, USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,
    SEARCH_POST_REQUEST, SEARCH_POST_SUCCESS,
    SEARCH_POST_FAILURE,
    TOP_50_SONGS_REQUEST, TOP_50_SONGS_SUCCESS,
    TOP_50_SONGS_FAILURE,
    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,
    CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SEARCH_SUCCESS,
    CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE,
} from '../../../action/TypeConstants';
import { userSearchRequest, userFollowUnfollowRequest, reactionOnPostRequest } from '../../../action/UserAction';
import { saveSongRequest, getTop50SongsRequest } from '../../../action/SongAction';
import { searchPostReq } from '../../../action/PostAction';
import { deletePostReq } from '../../../action/PostAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import constants from '../../../utils/helpers/constants';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import {
    getUsersFromHome
} from '../../../action/UserAction';
import { createChatTokenFromSearchRequest } from '../../../action/MessageAction';
import RBSheet from "react-native-raw-bottom-sheet";
import Contacts from 'react-native-contacts';

let status;
let postStatus;
let top50Status;
let userstatus;
let messageStatus;

function Search(props) {

    const [usersSearch, setUsersSearch] = useState(true);
    const [genreSearch, setGenreSearch] = useState(false);
    const [songSearch, setSongSearch] = useState(false);


    const [usersSearchText, setUsersSearchText] = useState("");
    const [genreSearchText, setGenreSearchText] = useState("");
    const [songSearchText, setSongSearchText] = useState("");
    const [bool, setBool] = useState(false);

    const [songData, setSongData] = useState([]);       // user search data...ignore the naming
    const [searchPostData, setSearchPostData] = useState([]);   //search post data
    const [top50, setTop50] = useState([]);  //top 50 data 

    const [positionInArray, setPositionInArray] = useState(0);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalReact, setModalReact] = useState("");

    const [typingTimeout, setTypingTimeout] = useState(0);
    // SEND SONG VARIABLES
    const [userClicked, setUserClicked] = useState(false);
    const [userSeach, setUserSeach] = useState("");
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);

    let changePlayer = false;
    let sendSong = false;
    let flag = true;
    var bottomSheetRef;

    const react = ["🔥", "😍", "💃", "🕺", "🤤", "👍"];

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            setUserSearchData([]);
            sesUsersToSEndSong([]);
            setUserSeach("");
        });

        return () => {
            unsuscribe();
        }
    }, []);

    if (status === "" || status !== props.status) {

        switch (props.status) {

            case USER_SEARCH_REQUEST:
                status = props.status
                break;

            case USER_SEARCH_SUCCESS:
                status = props.status
                setBool(true)
                setSongData([])
                setTimeout(() => {
                    setSongData(props.userSearch)
                    setBool(false);
                }, 1000)
                break;

            case USER_SEARCH_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                //props.userSearchReq({ keyword: usersSearchText })
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                status = props.status
                break;
        }
    };

    if (postStatus === "" || postStatus !== props.postStatus) {

        switch (props.postStatus) {

            case SEARCH_POST_REQUEST:
                postStatus = props.postStatus
                break;

            case SEARCH_POST_SUCCESS:
                postStatus = props.postStatus
                setSearchPostData(props.searchPostData);
                break;

            case SEARCH_POST_FAILURE:
                toast('Opps', 'Something went wrong, Please try again')
                postStatus = props.postStatus
                break;

        }
    };

    if (top50Status === "" || top50Status !== props.top50SongsStatus) {

        switch (props.top50SongsStatus) {

            case TOP_50_SONGS_REQUEST:
                top50Status = props.top50SongsStatus
                break;

            case TOP_50_SONGS_SUCCESS:
                top50Status = props.top50SongsStatus
                setTop50(props.top50SongsResponse)
                break;

            case TOP_50_SONGS_FAILURE:
                top50Status = props.top50SongsStatus
                console.log("ERROR", props.error.response)
                break;
        }
    };

    if (userstatus === "" || props.userstatus !== userstatus) {

        switch (props.userstatus) {

            case GET_USER_FROM_HOME_REQUEST:
                userstatus = props.userstatus
                break;

            case GET_USER_FROM_HOME_SUCCESS:
                userstatus = props.userstatus
                setUserSearchData(props.userSearchFromHome)
                break;

            case GET_USER_FROM_HOME_FAILURE:
                userstatus = props.userstatus
                break;

        };
    };

    if (messageStatus === "" || props.messageStatus !== messageStatus) {
        switch (props.messageStatus) {

            case CREATE_CHAT_TOKEN_FROM_SEARCH_REQUEST:
                messageStatus = props.messageStatus
                break;

            case CREATE_CHAT_TOKEN_FROM_SEARCH_SUCCESS:
                messageStatus = props.messageStatus
                console.log('search page');
                setUserSearchData([]);
                sesUsersToSEndSong([]);
                setUserSeach("");
                props.navigation.navigate('SendSongInMessageFinal', {
                    image: props.searchPostData[positionInArray].song_image,
                    title: props.searchPostData[positionInArray].song_name,
                    title2: props.searchPostData[positionInArray].artist_name,
                    users: usersToSEndSong, details: props.searchPostData[positionInArray], registerType: props.registerType,
                    fromAddAnotherSong: false, index: 0, fromHome: true, details: props.searchPostData[positionInArray]
                });
                break;

            case CREATE_CHAT_TOKEN_FROM_SEARCH_FAILURE:
                messageStatus = props.messageStatus;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };


    // RENDER FUNCTION FLATLIST 
    function renderUserData(data) {
        return (
            <ActivityListItem
                image={constants.profile_picture_base_url + data.item.profile_image}
                title={data.item.username}
                follow={data.item.isFollowing ? false : true}
                bottom={data.index === props.userSearch.length - 1 ? true : false}
                marginBottom={data.index === props.userSearch.length - 1 ? normalise(80) : normalise(0)}
                onPressImage={() => {
                    props.navigation.navigate("OthersProfile",
                        { id: data.item._id, following: data.item.isFollowing })
                }}
                onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                TouchableOpacityDisabled={false}
            />
        )
    };

    function renderSongData(data) {
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
                        index: data.index, type: 'search',
                        comment: data.item.comment, image: data.item.song_image,
                        username: data.item.userDetails.username, userComment: data.item.post_content,
                        time: data.item.createdAt, id: data.item._id
                    });
                }}
                onPressSecondImage={() => {
                    setPositionInArray(data.index)
                    setModalVisible(true)
                }}
                marginBottom={data.index === searchPostData.length - 1 ? normalise(50) : 0} />
        )
    };


    function renderGenreData(data) {
        return (
            <TouchableOpacity style={{
                marginBottom: data.index === top50.length - 1 ? normalise(30) : normalise(4),
                margin: normalise(6)
            }}
                onPress={() => { props.navigation.navigate("GenreSongClicked", { data: data.item._id }) }}
            >

                <Image source={{ uri: data.item.song_image.replace("100x100bb.jpg", "500x500bb.jpg") }}
                    style={{
                        height: normalise(140), width: normalise(140),
                    }}
                    resizeMode="contain" />
            </TouchableOpacity>
        )
    };
    // RENDER FUNCTION FLATLIST END 


    // SEND REACTION
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


    // HIT REACT
    function hitreact(x, rindex) {

        if (!_.isEmpty(props.searchPostData[rindex].reaction)) {
            console.log('here');

            const present = props.searchPostData[rindex].reaction.some(obj => obj.user_id.includes(props.userProfileResp._id) && obj.text.includes(x))

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


    //MODAL MORE PRESSED
    const MorePressed = () => {
        return (

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
                                    song_uri: props.searchPostData[positionInArray].song_uri,
                                    song_name: props.searchPostData[positionInArray].song_name,
                                    song_image: props.searchPostData[positionInArray].song_image,
                                    artist_name: props.searchPostData[positionInArray].artist_name,
                                    album_name: props.searchPostData[positionInArray].album_name,
                                    post_id: props.searchPostData[positionInArray]._id,
                                    isrc_code: props.searchPostData[positionInArray].isrc_code,
                                    original_song_uri: props.searchPostData[positionInArray].original_song_uri,
                                    original_reg_type: props.searchPostData[positionInArray].userDetails.register_type,
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


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                Clipboard.setString(props.searchPostData[positionInArray].song_uri);
                                setModalVisible(!modalVisible);

                                setTimeout(() => {
                                    toast("Success", "Song copied to clipboard.")
                                }, 1000);
                            }}>
                            <Image source={ImagePath.more_copy} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Copy Link</Text>
                        </TouchableOpacity>


                        {/* <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                setModalVisible(!modalVisible)
                                setSearchPostData([]);

                                props.userProfileResp._id !== props.searchPostData[positionInArray].user_id ?                      // USER - FOLLOW/UNFOLLOW
                                    props.followReq({ follower_id: props.searchPostData[positionInArray].userDetails._id })    // USER - FOLLOW/UNFOLLOW
                                    : props.deletePostReq(props.searchPostData[positionInArray]._id)

                                    setPositionInArray(0);
                            }}>

                            <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />

                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>{! _.isEmpty(props.searchPostData) ? props.userProfileResp._id === props.searchPostData[positionInArray].user_id ? "Delete Post" :
                                `Unfollow ${props.searchPostData[positionInArray].userDetails.username}` : null}</Text>

                        </TouchableOpacity> */}

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
        )
    };
    //END OF MODAL MORE PRESSED




    // SEARCH AND CLEAR FUNCTIONS
    const search = (text) => {
        if (usersSearch) {
            if (text.length >= 1) {
                isInternetConnected()
                    .then(() => { props.userSearchReq({ keyword: text }, sendSong) })
                    .catch(() => { toast('Error', 'Please Connect To Internet') })
            }
        }

        else if (songSearch) {
            if (text.length >= 1) {
                isInternetConnected().then(() => { props.searchPost(text, flag) })
                    .catch(() => { toast('Error', 'Please Connect To Internet') })

            }

        }

        else {
            let search = _.filter(props.top50SongsResponse, (item) => {
                return item._id.toLowerCase().indexOf(text.toLowerCase()) !== -1
            });
            setTop50(search);
        }
    };


    const clearSearch = () => {
        if (usersSearch) {
            setSongData([]);
        }

        else if (songSearch) {
            setSearchPostData([]);
            setPositionInArray(0);
        }

        else {
            setTop50(props.top50SongsResponse)
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


    const getContacts = () => {
        Contacts.getAll((err, contacts) => {
            if (err) {
                console.log(err);
            }
            else {
                let contactsArray = contacts;
                let finalArray = [];
                setContactsLoading(false);
                //console.log(JSON.stringify(contacts));
                contactsArray.map((item, index) => {
                    item.phoneNumbers.map((item, index) => {
                        let number = item.number.replace(/[- )(]/g, '');
                        let check = number.charAt(0);
                        let number1 = parseInt(number);
                        if (check === 0) {
                            finalArray.push(number1);
                        }
                        else {
                            const converToString = number1.toString()
                            const myVar = number1.toString().substring(0, 2);
                            const threeDigitVar = number1.toString().substring(0, 3);

                            if (threeDigitVar === "440") {
                                let backToInt = converToString.replace(threeDigitVar, "0");
                                finalArray.push(backToInt);
                            } else {
                                if (myVar === "44" || myVar === "91") {
                                    let backToInt = converToString.replace(myVar, "0");
                                    finalArray.push(backToInt);
                                }
                                else {
                                    let updatednumber = `0${number1}`
                                    finalArray.push(updatednumber);
                                }
                            }
                        }
                    })
                });

                console.log(finalArray);
                props.navigation.navigate('UsersFromContacts', { data: finalArray })
            }
        })
    };




    //VIEW
    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === USER_SEARCH_REQUEST} />

            <Loader visible={props.postStatus === SEARCH_POST_REQUEST} />

            <Loader visible={props.top50SongsStatus === TOP_50_SONGS_REQUEST} />

            <Loader visible={contactsLoading} />

            <Loader visible={bool} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <SafeAreaView style={{ flex: 1 }}>

                    <HeaderComponent firstitemtext={true}
                        textone={""}
                        title={"SEARCH"}
                        thirditemtext={true}
                        texttwo={""}
                    />

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalise(15)
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.fadeblack,
                                width: "33%",
                                height: normalise(40),
                                justifyContent: 'flex-end'
                            }}
                            onPress={() => {
                                setUsersSearch(true),
                                    setGenreSearch(false),
                                    setSongSearch(false)
                            }}
                        >
                            <Text
                                style={{
                                    color: usersSearch ? Colors.white : Colors.grey_text,
                                    fontFamily: 'ProximaNova-Black',
                                    position: 'absolute',
                                    top: normalise(14),
                                    // left: normalise(26),
                                    alignSelf: 'center',
                                    fontSize: normalise(12)
                                }}>USERS</Text>

                            {usersSearch ? <Image
                                source={ImagePath.gradient_border_horizontal}
                                style={{ width: "100%", height: normalise(2) }}
                            /> : null}


                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.fadeblack,
                                width: "34%",
                                height: normalise(40),
                                justifyContent: 'flex-end'
                            }}
                            onPress={() => {
                                props.getTop50SongReq()
                                setUsersSearch(false),
                                    setGenreSearch(true),
                                    setSongSearch(false)


                            }}
                        >
                            <Text
                                style={{
                                    color: genreSearch ? Colors.white : Colors.grey_text,
                                    fontFamily: 'ProximaNova-Black',
                                    position: 'absolute',
                                    top: normalise(14),
                                    // left: normalise(26),
                                    alignSelf: 'center',
                                    fontSize: normalise(12)
                                }}>TOP 50</Text>

                            {genreSearch ? <Image
                                source={ImagePath.gradient_border_horizontal}
                                style={{ width: "100%", height: normalise(2) }}
                            /> : null}

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.fadeblack,
                                width: "33%",
                                height: normalise(40),
                                justifyContent: 'flex-end'
                            }}
                            onPress={() => {
                                setUsersSearch(false),
                                    setGenreSearch(false),
                                    setSongSearch(true)
                            }}
                        >
                            <Text
                                style={{
                                    color: songSearch ? Colors.white : Colors.grey_text,
                                    fontFamily: 'ProximaNova-Black',
                                    position: 'absolute',
                                    top: normalise(14),
                                    // left: normalise(26),
                                    alignSelf: 'center',
                                    fontSize: normalise(12)
                                }}>SONGS</Text>

                            {songSearch ? <Image
                                source={ImagePath.gradient_border_horizontal}
                                style={{ width: "100%", height: normalise(2) }}
                            /> : null}

                        </TouchableOpacity>
                    </View>

                    <View style={{
                        width: '92%',
                        alignSelf: 'center',
                    }}>

                        <TextInput style={{
                            height: normalise(35),
                            width: '100%',
                            backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8),
                            marginTop: normalise(20),
                            padding: normalise(10),
                            color: Colors.white,
                            paddingLeft: normalise(30)
                        }} value={usersSearch ? usersSearchText : genreSearch ? genreSearchText : songSearchText}
                            placeholder={usersSearch ? "Search Users" : genreSearch ? "Search Top 50 Songs " : "Search Songs"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => {
                                search(text),
                                    usersSearch ? setUsersSearchText(text) : genreSearch ? setGenreSearchText(text) :
                                        setSongSearchText(text)
                            }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {usersSearch && usersSearchText || genreSearch && genreSearchText || songSearch && songSearchText ?
                            <TouchableOpacity onPress={() => {
                                clearSearch()
                                usersSearch ? setUsersSearchText("") : genreSearch ? setGenreSearchText("") :
                                    setSongSearchText("")
                            }}
                                style={{
                                    position: 'absolute', right: 0,
                                    bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                    paddingRight: normalise(10)
                                }}>
                                <Text style={{
                                    color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                                }}>CLEAR</Text>

                            </TouchableOpacity> : null}
                    </View>



                    {usersSearch ?              //USERS VIEW

                        _.isEmpty(songData) ?

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                                <Image source={ImagePath.user} style={{ height: normalise(40), width: normalise(40) }}
                                    resizeMode='contain' />

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                    marginTop: normalise(20), width: '68%', textAlign: 'center'
                                }}>Search for users via username or their full name</Text>

                                <TouchableOpacity style={{
                                    marginBottom: normalise(30),
                                    marginTop: normalise(40), height: normalise(50), width: '80%', alignSelf: 'center',
                                    borderRadius: normalise(25), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'center', borderColor: Colors.grey,
                                }} onPress={() => { setContactsLoading(true), getContacts() }}>

                                    <Text style={{
                                        marginLeft: normalise(10), color: Colors.white, fontSize: normalise(12),
                                        fontWeight: 'bold'
                                    }}>CHECK YOUR PHONEBOOK</Text>

                                </TouchableOpacity>

                            </View>

                            : <View>

                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                    marginTop: normalise(5), justifyContent: 'flex-start'
                                }}>
                                    <Text style={{
                                        fontFamily: 'ProximaNova-Bold',
                                        color: Colors.white, fontSize: normalise(12),
                                        fontWeight: 'bold'
                                    }}> RESULTS ({songData.length})</Text>

                                </View>


                                <FlatList
                                    style={{ height: '70%' }}
                                    data={songData}
                                    renderItem={renderUserData}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false} />
                            </View>

                        : null}


                    {songSearch ?               //SONG VIEW

                        _.isEmpty(searchPostData) ?

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                                <Image source={ImagePath.music_icon} style={{ height: normalise(40), width: normalise(40) }}
                                    resizeMode='contain' />

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                    marginTop: normalise(20), width: '68%', textAlign: 'center'
                                }}>Search for posts which contain a particular song</Text>

                            </View>

                            : <View>

                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: '92%', alignSelf: 'center',
                                    marginTop: normalise(5), justifyContent: 'flex-start'
                                }}>
                                    <Text style={{
                                        fontFamily: 'ProximaNova-Bold',
                                        color: Colors.white, fontSize: normalise(12),
                                        fontWeight: 'bold'
                                    }}> RESULTS ({searchPostData.length})</Text>

                                </View>


                                <FlatList
                                    style={{ height: '70%' }}
                                    data={searchPostData}
                                    renderItem={renderSongData}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false} />

                                {MorePressed()}
                                {renderAddToUsers()}

                            </View>

                        : null}


                    {genreSearch ?              //GENRE VIEW

                        _.isEmpty(top50) ?

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>

                                {/* <Image source={ImagePath.music_icon} style={{ height: normalise(40), width: normalise(40) }}
                                    resizeMode='contain' /> */}

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(15), fontWeight: '500',
                                    marginTop: normalise(20), width: '68%', textAlign: 'center'
                                }}>No songs are posted today</Text>

                            </View> :

                            <FlatList
                                //style={{ height: '70%' }}
                                style={{ alignSelf: 'center', width: '90%' }}
                                data={top50}
                                renderItem={renderGenreData}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                showsVerticalScrollIndicator={false} />

                        : null}


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

                </SafeAreaView>
            </TouchableWithoutFeedback>
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
        height: normalise(190),
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
        userSearch: state.UserReducer.userSearch,
        postStatus: state.PostReducer.status,
        searchPostData: state.PostReducer.searchPost,
        savedSongResponse: state.SongReducer.savedSongResponse,
        userProfileResp: state.UserReducer.userProfileResp,
        top50SongsResponse: state.SongReducer.top50SongsResponse,
        top50SongsStatus: state.SongReducer.status,
        error: state.SongReducer.error,
        messageStatus: state.MessageReducer.status,
        userstatus: state.UserReducer.status,
        userSearchFromHome: state.UserReducer.userSearchFromHome,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSearchReq: (payload, sendSong) => {
            dispatch(userSearchRequest(payload, sendSong))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },

        searchPost: (text, flag) => {
            dispatch(searchPostReq(text, flag))
        },

        reactionOnPostRequest: (payload) => {
            dispatch(reactionOnPostRequest(payload))
        },

        saveSongReq: (payload) => {
            dispatch(saveSongRequest(payload))
        },

        deletePostReq: (payload) => {
            dispatch(deletePostReq(payload))
        },

        getTop50SongReq: () => {
            dispatch(getTop50SongsRequest())
        },

        getusersFromHome: (payload) => {
            dispatch(getUsersFromHome(payload))
        },

        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenFromSearchRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);