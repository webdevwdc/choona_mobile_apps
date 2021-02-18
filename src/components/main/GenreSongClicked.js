
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
  ImageBackground, Modal,
  TextInput,
  Clipboard
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import HomeItemList from './ListCells/HomeItemList';
import { connect } from 'react-redux';
import { searchPostReq } from '../../action/PostAction';
import { saveSongRequest } from '../../action/SongAction';
import { reactionOnPostRequest, getUsersFromHome } from '../../action/UserAction';
import {
  GET_POST_FROM_TOP_50_REQUEST, GET_POST_FROM_TOP_50_SUCCESS, GET_POST_FROM_TOP_50_FAILURE,
  REACTION_ON_POST_REQUEST, REACTION_ON_POST_SUCCESS, REACTION_ON_POST_FAILURE, HOME_PAGE_SUCCESS,
  GET_USER_FROM_HOME_REQUEST,
  GET_USER_FROM_HOME_SUCCESS,
  GET_USER_FROM_HOME_FAILURE,
  CREATE_CHAT_TOKEN_REQUEST,
  CREATE_CHAT_TOKEN_SUCCESS,
  CREATE_CHAT_TOKEN_FAILURE,
}
  from '../../action/TypeConstants';
import Loader from '../../widgets/AuthLoader';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import _ from 'lodash';
import RBSheet from "react-native-raw-bottom-sheet";
import { createChatTokenRequest } from '../../action/MessageAction'
import constants from '../../utils/helpers/constants';

let status;
let userStatus;
let messageStatus;

function GenreSongClicked(props) {

  const [name, setName] = useState(props.route.params.data);
  const [positionInArray, setPositionInArray] = useState(0);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalReact, setModalReact] = useState("");

  // SEND SONG VARIABLES
  const [userClicked, setUserClicked] = useState(false);
  const [userSeach, setUserSeach] = useState("");
  const [userSearchData, setUserSearchData] = useState([]);
  const [usersToSEndSong, sesUsersToSEndSong] = useState([]);

  let flag = false;
  let changePlayer = false;
  var bottomSheetRef;

  const react = ["🔥", "😍", "💃", "🕺", "🤤", "👍"];

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', (payload) => {

      isInternetConnected()
        .then(() => {
          props.searchPost(name.length > 5 ? name.substring(0, 5) : name, flag),
            setUserSearchData([]);
          sesUsersToSEndSong([]);
          setUserSeach("");
        })
        .catch(() => {
          toast('Opps', 'Please Connect To Internet')
        })
    });

    return () => {
      unsuscribe();
    }
  });


  if (userStatus === "" || props.userStatus !== userStatus) {

    switch (props.userStatus) {

      case REACTION_ON_POST_REQUEST:
        userStatus = props.userStatus
        break;

      case REACTION_ON_POST_SUCCESS:
        userStatus = props.userStatus
        props.searchPost(name.length > 5 ? name.substring(0, 5) : name, flag)
        break;

      case REACTION_ON_POST_FAILURE:
        userStatus = props.userStatus
        break;

      case HOME_PAGE_SUCCESS:
        userStatus = props.userStatus
        props.searchPost(name.length > 5 ? name.substring(0, 5) : name, flag)
        break;

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

    }
  };

  if (status === "" || status !== props.status) {
    switch (props.status) {

      case GET_POST_FROM_TOP_50_REQUEST:
        status = props.status
        break;

      case GET_POST_FROM_TOP_50_SUCCESS:
        status = props.status
        break;

      case GET_POST_FROM_TOP_50_FAILURE:
        status = props.status
        toast('Error', 'Something Went Wrong, Please Try Again');
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
        console.log('top50 page');
        setUserSearchData([]);
        sesUsersToSEndSong([]);
        setUserSeach("");
        props.navigation.navigate('SendSongInMessageFinal', {
          image: props.getPostFromTop50[positionInArray].song_image,
          title: props.getPostFromTop50[positionInArray].song_name,
          title2: props.getPostFromTop50[positionInArray].artist_name,
          users: usersToSEndSong, details: props.getPostFromTop50[positionInArray], registerType: props.registerType,
          fromAddAnotherSong: false, index: 0, fromHome: true, details: props.getPostFromTop50[positionInArray]
        });
        break;

      case CREATE_CHAT_TOKEN_FAILURE:
        messageStatus = props.messageStatus;
        toast("Error", "Something Went Wong, Please Try Again")
        break;
    }
  };



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

    if (!_.isEmpty(props.getPostFromTop50[rindex].reaction)) {
      console.log('here');

      const present = props.getPostFromTop50[rindex].reaction.some(obj => obj.user_id.includes(props.userProfileResp._id) && obj.text.includes(x))

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


  // FLATLIST RENDER FUNCTION
  function renderGenreData(data) {
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
            index: data.index, type: 'top50',
            comment: data.item.comment,
            image: data.item.song_image, username: data.item.userDetails.username, userComment: data.item.post_content,
            time: data.item.createdAt, id: data.item._id
          });
        }}
        onPressSecondImage={() => {
          setPositionInArray(data.index)
          setModalVisible(true)
        }}
        marginBottom={data.index === props.getPostFromTop50.length - 1 ? normalise(50) : 0} />
    )
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
                  song_uri: props.getPostFromTop50[positionInArray].song_uri,
                  song_name: props.getPostFromTop50[positionInArray].song_name,
                  song_image: props.getPostFromTop50[positionInArray].song_image,
                  artist_name: props.getPostFromTop50[positionInArray].artist_name,
                  album_name: props.getPostFromTop50[positionInArray].album_name,
                  post_id: props.getPostFromTop50[positionInArray]._id,
                  isrc_code: props.getPostFromTop50[positionInArray].isrc_code,
                  original_song_uri: props.getPostFromTop50[positionInArray].original_song_uri,
                  original_reg_type: props.getPostFromTop50[positionInArray].userDetails.register_type,
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
                Clipboard.setString(props.getPostFromTop50[positionInArray].song_uri);
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
  //END OF MODAL MORE PRESSED



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

      <Loader visible={props.status === GET_POST_FROM_TOP_50_REQUEST} />

      <SafeAreaView style={{ flex: 1, }}>

        <HeaderComponent firstitemtext={false}
          imageone={ImagePath.backicon} title={'POSTS'}
          thirditemtext={true} texttwo={""}
          onPressFirstItem={() => { props.navigation.goBack() }} />

        {props.status === GET_POST_FROM_TOP_50_SUCCESS ?

          _.isEmpty(props.getPostFromTop50) ?

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: normalise(12), color: Colors.white }}>NO POSTS</Text>
            </View>
            :
            <FlatList
              style={{ marginTop: normalise(10) }}
              data={props.getPostFromTop50}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => { index.toString() }}
              renderItem={renderGenreData} /> : null}

        {MorePressed()}
        {renderAddToUsers()}


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
    status: state.PostReducer.status,
    getPostFromTop50: state.PostReducer.getPostFromTop50,
    userStatus: state.UserReducer.status,
    userProfileResp: state.UserReducer.userProfileResp,
    userSearchFromHome: state.UserReducer.userSearchFromHome,
    messageStatus: state.MessageReducer.status,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {

    searchPost: (text, flag) => {
      dispatch(searchPostReq(text, flag))
    },

    reactionOnPostRequest: (payload) => {
      dispatch(reactionOnPostRequest(payload))
    },

    saveSongReq: (payload) => {
      dispatch(saveSongRequest(payload))
    },

    getusersFromHome: (payload) => {
      dispatch(getUsersFromHome(payload))
    },

    createChatTokenRequest: (payload) => {
      dispatch(createChatTokenRequest(payload))
    },

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GenreSongClicked)