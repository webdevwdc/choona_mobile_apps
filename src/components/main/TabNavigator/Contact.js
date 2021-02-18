import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Modal, Linking,
    Keyboard,
    Text, ImageBackground,
    TouchableOpacity,
    TextInput, FlatList,
    Image, Clipboard,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HeaderComponent from '../../../widgets/HeaderComponent';
import SavedSongsListItem from '../ListCells/SavedSongsListItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import StatusBar from '../../../utils/MyStatusBar';
import {
    SAVED_SONGS_LIST_REQUEST, SAVED_SONGS_LIST_SUCCESS,
    SAVED_SONGS_LIST_FAILURE,
    UNSAVE_SONG_REQUEST,
    UNSAVE_SONG_SUCCESS,
    UNSAVE_SONG_FAILURE,
    GET_USER_FROM_HOME_REQUEST,
    GET_USER_FROM_HOME_SUCCESS,
    GET_USER_FROM_HOME_FAILURE,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_SUCCESS,
    CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE,
} from '../../../action/TypeConstants';
import { savedSongsListRequset, unsaveSongRequest } from '../../../action/SongAction';
import Loader from '../../../widgets/AuthLoader';
import toast from '../../../utils/helpers/ShowErrorAlert';
import { connect } from 'react-redux';
import isInternetConnected from '../../../utils/helpers/NetInfo';
import _ from 'lodash';
import RBSheet from "react-native-raw-bottom-sheet";
import {
    getUsersFromHome
} from '../../../action/UserAction';
import constants from '../../../utils/helpers/constants';
import { createChatTokenFromSavedSongRequest } from '../../../action/MessageAction'
import {
    getSongFromisrc
} from '../../../action/PlayerAction';
import { getSpotifyToken } from '../../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../../utils/helpers/AppleDevToken';
import axios from 'axios';


let status;
let userstatus;
let messageStatus;
function Contact(props) {

    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const [userClicked, setUserClicked] = useState(false);
    const [userSeach, setUserSeach] = useState("");
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);
    const [bool, setBool] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0);

    var bottomSheetRef;

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getSavedSongs(search)
                    setUserSearchData([]);
                    sesUsersToSEndSong([]);
                    setUserSeach("");
                })
                .catch(() => {
                    toast("Oops", "Please Connect To Internet")
                })


        });

        return () => {
            unsuscribe()
        }
    }, []);


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case SAVED_SONGS_LIST_REQUEST:
                status = props.status
                break;

            case SAVED_SONGS_LIST_SUCCESS:
                status = props.status
                break;

            case SAVED_SONGS_LIST_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong')
                break;

            case UNSAVE_SONG_REQUEST:
                status = props.status
                break;

            case UNSAVE_SONG_SUCCESS:
                status = props.status
                setIndex(0);
                props.getSavedSongs(search)
                break;

            case UNSAVE_SONG_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong')
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

            case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_REQUEST:
                messageStatus = props.messageStatus
                break;

            case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_SUCCESS:
                messageStatus = props.messageStatus
                console.log('saved song');
                setUserSearchData([]);
                sesUsersToSEndSong([]);
                setUserSeach("");
                props.navigation.navigate('SendSongInMessageFinal', {
                    image: props.savedSong[index].song_image,
                    title: props.savedSong[index].song_name,
                    title2: props.savedSong[index].artist_name,
                    users: usersToSEndSong, details: props.savedSong[index], registerType: props.registerType,
                    fromAddAnotherSong: false, index: 0, fromHome: true, details: props.savedSong[index]
                });
                break;

            case CREATE_CHAT_TOKEN_FROM_SAVEDSONG_FAILURE:
                messageStatus = props.messageStatus;
                toast("Error", "Something Went Wong, Please Try Again")
                break;
        }
    };


    function renderItem(data) {
        return (
            <SavedSongsListItem
                image={data.item.song_image}
                title={data.item.song_name}
                singer={data.item.artist_name}
                marginBottom={data.index === props.savedSong.length - 1 ? normalise(20) : 0}
                onPressImage={() => {
                    props.navigation.navigate("Player",
                        {
                            song_title: data.item.song_name,
                            album_name: data.item.album_name,
                            song_pic: data.item.song_image,
                            uri: data.item.song_uri,
                            id: data.item.post_id,
                            artist: data.item.artist_name,
                            changePlayer: true,
                            isrc: data.item.isrc_code,
                            registerType: data.item.original_reg_type,
                            originalUri: data.item.original_song_uri
                        })
                }}
                onPress={() => { setIndex(data.index), setModalVisible(true) }}
            />
        )
    };

    const renderModalMorePressed = () => {
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
                            onPress={() => { props.unsaveSongReq(props.savedSong[index]._id), setModalVisible(!modalVisible) }}>

                            <Image source={ImagePath.boxicon} style={{ height: normalise(18), width: normalise(18), }}
                                resizeMode='contain' />
                            <Text style={{
                                color: Colors.white, marginLeft: normalise(15),
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Unsave Song</Text>
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
                                Clipboard.setString(props.savedSong[index].original_song_uri);
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


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                            onPress={() => {
                                if (props.savedSong[index].original_reg_type === props.registerType) {
                                    console.log('same reg type');
                                    setModalVisible(!modalVisible), setBool(true),
                                        Linking.canOpenURL(props.savedSong[index].original_song_uri)
                                            .then(() => {
                                                Linking.openURL(props.savedSong[index].original_song_uri)
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
                                else {
                                    console.log('diffirent reg type');
                                    setModalVisible(!modalVisible), setBool(true),
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
                                            originalUri: props.savedSong[index].original_song_uri,
                                            registerType: props.savedSong[index].original_reg_type,
                                            isrc: props.savedSong[index].isrc_code
                                        })
                                else
                                    // setTimeout(() => {
                                    //     toast("Oops", "Only, Spotify users can add to their playlist now.")
                                    // }, 1000)
                                    props.navigation.navigate("AddToPlayListScreen", { isrc: props.savedSong[index].isrc_code })
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

    // GET ISRC CODE
    const callApi = async () => {
        if (props.registerType === 'spotify') {

            const spotifyToken = await getSpotifyToken();

            return await axios.get(`https://api.spotify.com/v1/search?q=isrc:${props.savedSong[index].isrc_code}&type=track`, {
                headers: {
                    "Authorization": spotifyToken
                }
            });
        }
        else {
            const AppleToken = await getAppleDevToken();

            return await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.savedSong[index].isrc_code}`, {
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
                        setBool(false)
                    }
                }

                else {
                    setBool(false)
                    toast('', 'No Song Found');
                }

            }
            else {
                setBool(false)
                toast('Oops', 'Something Went Wrong');
            }

        } catch (error) {
            setBool(false)
            console.log(error);
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

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === SAVED_SONGS_LIST_REQUEST} />

            <Loader visible={bool} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <SafeAreaView style={{ flex: 1 }}>

                    <HeaderComponent firstitemtext={true}
                        textone={""}
                        title={"SAVED SONGS"}
                        thirditemtext={true}
                        texttwo={""}
                    />

                    <View style={{
                        width: '92%',
                        alignSelf: 'center',
                    }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30),
                        }} value={search}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => {
                                setSearch(text),
                                    props.getSavedSongs(text)
                            }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => {
                                setSearch(""),
                                    props.getSavedSongs("")
                            }}
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

                    {_.isEmpty(props.savedSong) ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                marginBottom: '20%',
                                marginTop: normalise(10), color: Colors.white,
                                fontSize: normalise(12), fontWeight: 'bold'
                            }}>NO SAVED SONGS</Text>
                        </View>
                        :
                        <SwipeListView
                            data={props.savedSong}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            renderHiddenItem={(rowData, rowMap) => (

                                <TouchableOpacity style={{
                                    backgroundColor: Colors.red,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: "space-evenly",
                                    height: normalise(39),
                                    width: normalise(42),
                                    marginTop: normalise(10),
                                    position: 'absolute', right: 21
                                }}
                                    onPress={() => {
                                        props.unsaveSongReq(rowData.item._id)
                                        rowMap[rowData.item.key].closeRow()
                                    }}
                                >

                                    <Image source={ImagePath.unsaved}
                                        style={{ height: normalise(15), width: normalise(15), }}
                                        resizeMode='contain' />
                                    <Text style={{
                                        fontSize: normalise(8), color: Colors.white,
                                        fontWeight: 'bold'
                                    }}>UNSAVE</Text>

                                </TouchableOpacity>
                            )}

                            keyExtractor={(item, index, rowData) => { index.toString() }}
                            disableRightSwipe={true}
                            rightOpenValue={-75} />
                    }
                </SafeAreaView>
            </TouchableWithoutFeedback>

            {renderModalMorePressed()}
            {renderAddToUsers()}
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
        height: normalise(260),
        width: "95%",
        backgroundColor: Colors.darkerblack,
        borderRadius: 20,
        padding: 20,
        paddingTop: normalise(20),

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
        status: state.SongReducer.status,
        error: state.SongReducer.error,
        savedSong: state.SongReducer.savedSongList,
        userProfileResp: state.UserReducer.userProfileResp,
        userstatus: state.UserReducer.status,
        userSearchFromHome: state.UserReducer.userSearchFromHome,
        messageStatus: state.MessageReducer.status,
        registerType: state.TokenReducer.registerType,
        isrcResp: state.PlayerReducer.getSongFromISRC,
    }
};

const mapDistapchToProps = (dispatch) => {
    return {
        getSavedSongs: (search) => {
            dispatch(savedSongsListRequset(search))
        },

        unsaveSongReq: (id) => {
            dispatch(unsaveSongRequest(id))
        },
        getusersFromHome: (payload) => {
            dispatch(getUsersFromHome(payload))
        },
        createChatTokenRequest: (payload) => {
            dispatch(createChatTokenFromSavedSongRequest(payload))
        },
        getSongFromIsrc: (regType, isrc) => {
            dispatch(getSongFromisrc(regType, isrc))
        },
    }
};

export default connect(mapStateToProps, mapDistapchToProps)(Contact)

