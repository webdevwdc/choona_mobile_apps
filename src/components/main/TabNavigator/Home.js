import React, { useState, useEffect, Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text, TextInput,
  ImageBackground,
  TouchableOpacity, KeyboardAvoidingView,
  Image, TouchableWithoutFeedback,
  Modal,
  Platform,
  Clipboard,
  Linking,
  Keyboard, ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import HomeHeaderComponent from '../../../widgets/HomeHeaderComponent';
import _ from 'lodash'
import HomeItemList from '../ListCells/HomeItemList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { normalizeUnits } from 'moment';
import StatusBar from '../../../utils/MyStatusBar';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import MusicPlayerBar from '../../../widgets/MusicPlayerBar';
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
  COUNTRY_CODE_SUCCESS,
  OTHERS_PROFILE_SUCCESS, EDIT_PROFILE_SUCCESS, DUMMY_ACTION_SUCCESS, DUMMY_ACTION_REQUEST
} from '../../../action/TypeConstants';
import {
  getProfileRequest, homePageReq, reactionOnPostRequest, userFollowUnfollowRequest,
  getUsersFromHome, dummyRequest
} from '../../../action/UserAction';
import { saveSongRequest, saveSongRefReq } from '../../../action/SongAction';
import { deletePostReq } from '../../../action/PostAction';
import { createChatTokenRequest } from '../../../action/MessageAction'
import { connect } from 'react-redux'
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import Loader from '../../../widgets/AuthLoader';
import constants from '../../../utils/helpers/constants';
import { useScrollToTop } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import Contacts from 'react-native-contacts';
// import {getDeviceToken} from '../../../utils/helpers/FirebaseToken'
import { getSpotifyToken } from '../../../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../../../utils/helpers/AppleDevToken';
import axios from 'axios';
import MusicPlayer from '../../../widgets/MusicPlayer';


let status = "";
let songStatus = "";
let postStatus = "";
let messageStatus;

function Home(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState("");
  const [modal1Visible, setModal1Visible] = useState(false);
  const [positionInArray, setPositionInArray] = useState(0);

  const [userClicked, setUserClicked] = useState(false);
  const [userSeach, setUserSeach] = useState("");
  const [userSearchData, setUserSearchData] = useState([]);
  const [usersToSEndSong, sesUsersToSEndSong] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [bool, setBool] = useState(false);
  const [homeReq, setHomeReq] = useState(false);
  const [postArray, setPostArray] = useState([]);
  const [timeoutVar, setTimeoutVar] = useState(0);
  const [onScrolled, setOnScrolled] = useState(false);
  const [offset, setOffset] = useState(1);
  const [refresing, setRefresing] = useState(false);

  const ref = React.useRef(null);
  var bottomSheetRef;
  let changePlayer = false;

  useScrollToTop(ref);

  useEffect(() => {
    setHomeReq(true);
    setOffset(1);
    props.homePage(1);

    const unsuscribe = props.navigation.addListener('focus', (payload) => {
      isInternetConnected()
        .then(() => {
          console.log('home use Effect');
          setOnScrolled(false);
          props.getProfileReq(),
            setUserSearchData([]);
          sesUsersToSEndSong([]);
          setUserSeach("");
          if (!homeReq) {
            props.dummyRequest();
          }
          // if (ref.current !== null) {
          //   ref.current.scrollToIndex({ animated: true, index: 0 })
          // }
        })
        .catch((err) => {
          console.log(err)
          toast('Error', 'Please Connect To Internet')
        })
    });

    return () => {
      unsuscribe();
    }
  }, []);


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
        setPostArray(props.postData);
        findPlayingSong(props.postData);
        console.log('calling success');
        setHomeReq(false);
        setRefresing(false);
        break;

      case HOME_PAGE_FAILURE:
        status = props.status;
        setHomeReq(false);
        toast("Oops", "Something Went Wrong, Please Try Again")
        break;

      case REACTION_ON_POST_SUCCESS:
        status = props.status;
        setOffset(1);
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

      case DUMMY_ACTION_REQUEST:
        status = props.status;
        break;

      case DUMMY_ACTION_SUCCESS:
        status = props.status
        findPlayingSong(props.postData);
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
        setHomeReq(true);
        postStatus = props.postStatus
        break;

      case DELETE_POST_SUCCESS:
        postStatus = props.postStatus
        props.homePage(1)
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
        console.log('home page');
        setUserSearchData([]);
        sesUsersToSEndSong([]);
        setUserSeach("");
        if (!_.isEmpty(props.postData)) {
          props.navigation.navigate('SendSongInMessageFinal', {
            image: props.postData[positionInArray].song_image,
            title: props.postData[positionInArray].song_name,
            title2: props.postData[positionInArray].artist_name,
            users: usersToSEndSong, details: props.postData[positionInArray], registerType: props.registerType,
            fromAddAnotherSong: false, index: 0, fromHome: true, details: props.postData[positionInArray]
          });
        }
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
    console.log('this' + JSON.stringify(props.postData[rindex]));
    if (!_.isEmpty(props.postData[rindex].reaction)) {
      console.log('here');

      const present = props.postData[rindex].reaction.some(obj => obj.user_id.includes(props.userProfileResp._id) && obj.text.includes(x))

      if (present) {
        console.log('nooo');
      }
      else {
        console.log('2');
        setVisible(true)
        setModalReact(x)
        setTimeout(() => {
          setVisible(false)
        }, 2000);
      }

    }
    else {
      console.log('3');
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


  const playSong = (data) => {

    if (props.playingSongRef === "") {

      console.log('first time')

      MusicPlayer(data.item.song_uri, true)
        .then((track) => {
          console.log('Loaded');

          let saveSongResObj = {}
          saveSongResObj.uri = data.item.song_uri,
            saveSongResObj.song_name = data.item.song_name,
            saveSongResObj.album_name = data.item.album_name,
            saveSongResObj.song_pic = data.item.song_image,
            saveSongResObj.username = data.item.userDetails.username,
            saveSongResObj.profile_pic = data.item.userDetails.profile_image,
            saveSongResObj.commentData = data.item.comment
          saveSongResObj.reactionData = data.item.reaction
          saveSongResObj.id = data.item._id,
            saveSongResObj.artist = data.item.artist_name,
            saveSongResObj.changePlayer = changePlayer
          saveSongResObj.originalUri = data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
            saveSongResObj.isrc = data.item.isrc_code,
            saveSongResObj.regType = data.item.userDetails.register_type,
            saveSongResObj.details = data.item,
            saveSongResObj.showPlaylist = true,
            saveSongResObj.comingFromMessage = undefined

          props.saveSongRefReq(saveSongResObj);
          props.dummyRequest()
        })
        .catch((err) => {
          console.log('MusicPlayer Error', err)
        })

    } else {

      if (global.playerReference !== null) {

        if (global.playerReference._filename === data.item.song_uri) {
          console.log("Alreday Playing");

          if (global.playerReference.isPlaying()) {
            global.playerReference.pause();

            setTimeout(() => {
              findPlayingSong(props.postData)
            }, 500);
          }
          else {

            global.playerReference.play((success) => {
              if (success) {
                console.log('PlayBack End')
              }
              else {
                console.log('NOOOOOOOO')
              }
            });

            setTimeout(() => {
              findPlayingSong(props.postData)
            }, 500);
          }
        }

        else {
          console.log('reset');
          global.playerReference.release();
          global.playerReference = null;
          MusicPlayer(data.item.song_uri, true)
            .then((track) => {
              console.log('Loaded');

              let saveSongResObj = {}
              saveSongResObj.uri = data.item.song_uri,
                saveSongResObj.song_name = data.item.song_name,
                saveSongResObj.album_name = data.item.album_name,
                saveSongResObj.song_pic = data.item.song_image,
                saveSongResObj.username = data.item.userDetails.username,
                saveSongResObj.profile_pic = data.item.userDetails.profile_image,
                saveSongResObj.commentData = data.item.comment
              saveSongResObj.reactionData = data.item.reaction
              saveSongResObj.id = data.item._id,
                saveSongResObj.artist = data.item.artist_name,
                saveSongResObj.changePlayer = changePlayer
              saveSongResObj.originalUri = data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
                saveSongResObj.isrc = data.item.isrc_code,
                saveSongResObj.regType = data.item.userDetails.register_type,
                saveSongResObj.details = data.item,
                saveSongResObj.showPlaylist = true,
                saveSongResObj.comingFromMessage = undefined

              props.saveSongRefReq(saveSongResObj);
              props.dummyRequest()
            })
            .catch((err) => {
              console.log('MusicPlayer Error', err)
            })

        }

      } else {
        console.log('reset2');
        MusicPlayer(data.item.song_uri, true)
          .then((track) => {
            console.log('Loaded');

            let saveSongResObj = {}
            saveSongResObj.uri = data.item.song_uri,
              saveSongResObj.song_name = data.item.song_name,
              saveSongResObj.album_name = data.item.album_name,
              saveSongResObj.song_pic = data.item.song_image,
              saveSongResObj.username = data.item.userDetails.username,
              saveSongResObj.profile_pic = data.item.userDetails.profile_image,
              saveSongResObj.commentData = data.item.comment
            saveSongResObj.reactionData = data.item.reaction
            saveSongResObj.id = data.item._id,
              saveSongResObj.artist = data.item.artist_name,
              saveSongResObj.changePlayer = changePlayer
            saveSongResObj.originalUri = data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
              saveSongResObj.isrc = data.item.isrc_code,
              saveSongResObj.regType = data.item.userDetails.register_type,
              saveSongResObj.details = data.item,
              saveSongResObj.showPlaylist = true,
              saveSongResObj.comingFromMessage = undefined

            props.saveSongRefReq(saveSongResObj);
            props.dummyRequest()
          })
          .catch((err) => {
            console.log('MusicPlayer Error', err)
          })

      }
    }
  };


  function renderItem(data) {
    return (

      <HomeItemList
        image={data.item.song_image}
        play={_.isEmpty(postArray) ? false : props.postData.length === postArray.length ? postArray[data.index].playing : false}
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
          if (!homeReq) {
            hitreact(reaction, data.index),
              sendReaction(data.item._id, reaction);
          }
        }}
        onPressImage={() => {
          if (!homeReq) {
            if (props.userProfileResp._id === data.item.user_id) {
              props.navigation.navigate("Profile", { fromAct: false })
            }
            else {
              props.navigation.navigate("OthersProfile",
                { id: data.item.user_id })
            }
          }
        }}

        onAddReaction={() => {
          hitreact1(modal1Visible)
        }}
        onPressMusicbox={() => {
          if (!homeReq) {

            playSong(data);

            // props.navigation.navigate('Player', {
            //   comments: data.item.comment,
            //   song_title: data.item.song_name,
            //   album_name: data.item.album_name,
            //   song_pic: data.item.song_image,
            //   username: data.item.userDetails.username,
            //   profile_pic: data.item.userDetails.profile_image,
            //   time: data.item.time, title: data.item.title,
            //   uri: data.item.song_uri,
            //   reactions: data.item.reaction,
            //   id: data.item._id,
            //   artist: data.item.artist_name,
            //   changePlayer: changePlayer,
            //   originalUri: data.item.original_song_uri !== "" ? data.item.original_song_uri : undefined,
            //   registerType: data.item.userDetails.register_type,
            //   isrc: data.item.isrc_code,
            //   details: data.item
            // });
          }
        }}
        onPressReactionbox={() => {
          if (!homeReq) {
            props.navigation.navigate('HomeItemReactions', { reactions: data.item.reaction, post_id: data.item._id })
          }
        }}
        onPressCommentbox={() => {
          if (!homeReq) {
            props.navigation.navigate('HomeItemComments', {
              index: data.index, comment: data.item.comment,
              image: data.item.song_image, username: data.item.userDetails.username, userComment: data.item.post_content,
              time: data.item.createdAt, id: data.item._id
            });
          }
        }}
        onPressSecondImage={() => {
          if (!homeReq) {
            setPositionInArray(data.index)
            setModalVisible(true)
          }
        }}
        marginBottom={data.index === props.postData.length - 1 ? normalise(60) : 0} />
      // </TouchableOpacity>
    )
  };


  function findIsNotRead() {

    let hasUnseenMessage = false;
    var arr = props.chatList;

    if (!_.isEmpty(arr) && !_.isEmpty(props.userProfileResp)) {

      for (var i = 0; i < arr.length; i++) {

        if (props.userProfileResp._id == arr[i].receiver_id) {

          hasUnseenMessage = !arr[i].read;
          if (hasUnseenMessage)
            break;

        }
      }

      return hasUnseenMessage;
    }

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

            //   idArray.push(item._id)

            // });
            // if (idArray.includes(data.item._id)) {
            //   console.log('Already Exists');
            // }
            // else {
            //   let array = [...usersToSEndSong]
            //   array.push(data.item)
            //   sesUsersToSEndSong(array);
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
                // backgroundColor: Colors.facebookblue
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

      return await axios.get(`https://api.spotify.com/v1/search?q=isrc:${props.postData[positionInArray].isrc_code}&type=track`, {
        headers: {
          "Authorization": spotifyToken
        }
      });
    }
    else {
      const AppleToken = await getAppleDevToken();

      return await axios.get(`https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${props.postData[positionInArray].isrc_code}`, {
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


  // GET PLAYER PLAYING STATE FOR PAUSE/PLAY ICON IN FEED
  function getPlayerState() {
    let isPlaying = null;
    if (global.playerReference !== null && global.playerReference !== undefined) {
      isPlaying = global.playerReference.isPlaying();
    }
    return isPlaying;
  };


  // FIND THE PLAYING SONG AND ADD THE PAUSE/PLAY ICON TO FEED
  function findPlayingSong(postData) {
    const res = getPlayerState();

    // IF PLAYING
    if (res === true && !props.playingSongRef.changePlayer) {
      const myindex = postData.findIndex(obj => obj.song_uri === props.playingSongRef.uri);
      let array = [...postData];

      for (i = 0; i < array.length; i++) {
        if (i === myindex) {

          array[i].playing = true
          let duration = global.playerReference.getDuration();
          global.playerReference.getCurrentTime((seconds) => {
            let timeout = (duration - seconds) * 1000;
            console.log('timeout' + timeout);
            clearTimeout(timeoutVar);
            setTimeoutFunc(timeout);
          });
        }

        else {
          array[i].playing = false
        }

      };
      setPostArray(array);
      console.log(array);

    }
    // NOT PLAYING
    else {
      console.log('player not playing or playing song is not in feed');

      let array = [...postData];

      for (i = 0; i < array.length; i++) {
        array[i].playing = false
      };
      setPostArray(array);
      console.log(array);
    }
  };


  //SET TIMEOUT FOR PAUSE/PLAY ICON
  function setTimeoutFunc(timeout) {
    setTimeoutVar(setTimeout(() => {
      console.log('now');
      findPlayingSong(postArray);
    }, timeout));
  };


  //PULL TO REFRESH
  const onRefresh = () => {
    setRefresing(true);
    setOffset(1);
    props.homePage(1)
  };

  // VIEW
  return (

    <View style={{
      flex: 1,
      backgroundColor: Colors.black
    }}>

      {/* <Loader visible={props.status === USER_PROFILE_REQUEST} /> */}



      <StatusBar />

      <SafeAreaView style={{ flex: 1, position: 'relative' }}>

        <Loader visible={homeReq} />
        <Loader visible={contactsLoading} />
        <Loader visible={bool} />

        {/* { modalVisible ? 
                    <Image source={ImagePath.homelightbg} style={{opacity:0.1,position:'relative'}}/>
                    :null
                }   */}

        <HomeHeaderComponent
          firstitemtext={false}
          marginTop={0}
          imageone={_.isEmpty(props.userProfileResp) ? "" : constants.profile_picture_base_url + props.userProfileResp.profile_image}
          staticFirstImage={false}
          imageoneheight={30}
          imageonewidth={30}
          borderRadius={30}
          title={"CHOONA"}
          thirditemtext={false}
          imagetwo={ImagePath.inbox}
          imagetwoheight={25}
          imagetwowidth={25}
          middleImageReq={true}
          notRead={findIsNotRead()}
          onPressFirstItem={() => { props.navigation.navigate("Profile", { fromAct: false }) }}
          onPressThirdItem={() => { props.navigation.navigate("Inbox") }} />


        {_.isEmpty(props.postData) ?

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

            </TouchableOpacity> */}


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
          :


          <View style={{ flex: 1 }}>

            <FlatList
              style={{ marginTop: normalise(10) }}
              data={props.postData}
              renderItem={renderItem}
              windowSize={150}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => { index.toString() }}
              ref={ref}
              extraData={postArray}
              onEndReached={() => {
                if (onScrolled) {
                  if (offset + 1 === props.currentPage + 1) {
                    setOffset(offset + 1);
                    props.homePage(offset + 1);
                    setOnScrolled(false);
                  }
                }
              }}
              onEndReachedThreshold={0}
              initialNumToRender={10}
              onMomentumScrollBegin={() => { setOnScrolled(true) }}
              ListFooterComponent={

                props.status === HOME_PAGE_REQUEST ?
                  <ActivityIndicator size={'large'} style={{
                    alignSelf: 'center', marginBottom: normalise(50),
                    marginTop: normalise(-40)
                  }} />
                  : null

              }
              getItemLayout={(data, index) => (
                { length: 250, offset: normalise(385) * index, index }
              )}
              onScrollToIndexFailed={(val) => {
                console.log(val)
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refresing}
                  onRefresh={onRefresh}
                  colors={[Colors.black]}
                  progressBackgroundColor={Colors.white}
                  title={'Refreshing...'}
                  titleColor={Colors.white} />
              }
            />

            {renderAddToUsers()}

            {props.status === HOME_PAGE_SUCCESS || props.status === USER_PROFILE_SUCCESS ||
              props.status === COUNTRY_CODE_SUCCESS || props.status === OTHERS_PROFILE_SUCCESS ||
              props.status === EDIT_PROFILE_SUCCESS || props.status === DUMMY_ACTION_SUCCESS ?

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
                    originalUri: props.playingSongRef.originalUri,
                    isrc: props.playingSongRef.isrc,
                    registerType: props.playingSongRef.regType,
                    details: props.playingSongRef.details,
                    showPlaylist: props.playingSongRef.showPlaylist,
                    comingFromMessage: props.playingSongRef.comingFromMessage

                  })
              }}
                onPressPlayOrPause={() => {
                  setTimeout(() => {
                    findPlayingSong(props.postData)
                  }, 500)
                }} />
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
                        song_uri: props.postData[positionInArray].song_uri,
                        song_name: props.postData[positionInArray].song_name,
                        song_image: props.postData[positionInArray].song_image,
                        artist_name: props.postData[positionInArray].artist_name,
                        album_name: props.postData[positionInArray].album_name,
                        post_id: props.postData[positionInArray]._id,
                        isrc_code: props.postData[positionInArray].isrc_code,
                        original_song_uri: props.postData[positionInArray].original_song_uri,
                        original_reg_type: props.postData[positionInArray].userDetails.register_type,
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
                      Clipboard.setString(props.postData[positionInArray].original_song_uri);
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

                      props.userProfileResp._id !== props.postData[positionInArray].user_id ?                      // USER - FOLLOW/UNFOLLOW
                        props.followUnfollowReq({ follower_id: props.postData[positionInArray].userDetails._id })    // USER - FOLLOW/UNFOLLOW
                        : props.deletePostReq(props.postData[positionInArray]._id)                                  //  DELETE POST

                    }}>

                    <Image source={ImagePath.more_unfollow} style={{ height: normalise(18), width: normalise(18), }}
                      resizeMode='contain' />
                    <Text style={{
                      color: Colors.white, marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>{!_.isEmpty(props.userProfileResp) ? props.userProfileResp._id === props.postData[positionInArray].user_id ? "Delete Post" :
                      `Unfollow ${props.postData[positionInArray].userDetails.username}` : ""}</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                    onPress={() => {
                      if (props.postData[positionInArray].userDetails.register_type === props.registerType) {
                        console.log('same reg type');
                        setModalVisible(false)
                        setBool(true),
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
                      else {
                        console.log('diffirent reg type');
                        setModalVisible(false)
                        setBool(true),
                          isInternetConnected().then(() => {
                            openInAppleORSpotify();
                          })
                            .catch(() => {
                              toast('', 'Please Connect To Internet')
                            })
                      }

                    }}
                  >
                    <Image source={!_.isEmpty(props.userProfileResp) ? props.userProfileResp.register_type === 'spotify' ? ImagePath.spotifyicon : ImagePath.applemusic : ""}
                      style={{ height: normalise(18), width: normalise(18), borderRadius: normalise(9) }}
                      resizeMode='contain' />
                    <Text style={{
                      color: Colors.white, marginLeft: normalise(15),
                      fontSize: normalise(13),
                      fontFamily: 'ProximaNova-Semibold',
                    }}>{!_.isEmpty(props.userProfileResp) ? props.userProfileResp.register_type === 'spotify' ? "Open on Spotify" : "Open on Apple" : ""}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: normalise(18) }}
                    onPress={() => {
                      setModalVisible(!modalVisible)
                      if (props.userProfileResp.register_type === 'spotify')
                        props.navigation.navigate('AddToPlayListScreen',
                          {
                            originalUri: props.postData[positionInArray].original_song_uri,
                            registerType: props.postData[positionInArray].social_type,
                            isrc: props.postData[positionInArray].isrc_code
                          })
                      else {
                        // setTimeout(() => {
                        //   toast("Oops", "Only, Spotify users can add to their playlist now.")
                        // }, 1000)
                        props.navigation.navigate("AddToPlayListScreen", { isrc: props.postData[positionInArray].isrc_code })
                      }
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

      </SafeAreaView>
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
    currentPage: state.UserReducer.currentPage
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
    },

    dummyRequest: () => {
      dispatch(dummyRequest())
    },

    saveSongRefReq: (object) => {
      dispatch(saveSongRefReq(object))
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);