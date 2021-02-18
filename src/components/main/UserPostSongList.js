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
    Platform, Modal,
    Dimensions
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import _ from 'lodash';
import StatusBar from '../../utils/MyStatusBar';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import {
    USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE
} from '../../action/TypeConstants';
import { getProfileRequest, userLogoutReq } from '../../action/UserAction';
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import HomeHeaderComponent from '../../widgets/HomeHeaderComponent';
import HomeItemList from './ListCells/HomeItemList';


let status = "";

function UserPostSongList(props) {

    const [postData, setPostData] = useState(props.route.params.postList)
    const [user, setUser] = useState(props.route.params.user)
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalReact, setModalReact] = useState("");
    const [modal1Visible, setModal1Visible] = useState(false);
    const [positionInArray, setPositionInArray] = useState(0);

    const [userClicked, setUserClicked] = useState(false);
    const [userSeach, setUserSeach] = useState("");
    const [userSearchData, setUserSearchData] = useState([]);
    const [usersToSEndSong, sesUsersToSEndSong] = useState([]);

    console.log(postData)


    function hitreact1(modal1Visible) {

        if (modal1Visible == true) {
            setModal1Visible(false)
        }
        else {
            setModal1Visible(true)
        }
    };



    function hitreact(x) {
        setVisible(true)
        setModalReact(x)
        setTimeout(() => {
            setVisible(false)
        }, 2000);
    };

    function sendReaction(id, reaction) {
        let reactionObject = {
            post_id: id,
            text: reaction
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
                //picture={data.item.userDetails.profile_image}
                //name={data.item.userDetails.username}
                comments={data.item.comment}
                reactions={data.item.reaction}
                content={data.item.post_content}
                time={data.item.createdAt}
                title={data.item.song_name}
                singer={data.item.artist_name}
                modalVisible={modal1Visible}
                postType={data.item.social_type === "spotify"}
                onReactionPress={(reaction) => {
                    hitreact(reaction),
                        sendReaction(data.item._id, reaction);
                }}
                onPressImage={() => {
                    if (props.userProfileResp._id === data.item.user_id) {
                        props.navigation.navigate("Profile", {fromAct: false})
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
                        registerType: data.item.userDetails.register_type
                    })
                }}
                onPressReactionbox={() => {
                    props.navigation.navigate('HomeItemReactions', { reactions: data.item.reaction, post_id: data.item._id })
                }}
                onPressCommentbox={() => {
                    props.navigation.navigate('HomeItemComments', { index: data.index });
                }}
                onPressSecondImage={() => {
                    setPositionInArray(data.index)
                    setModalVisible(true)
                }}
                marginBottom={data.index === postData.length - 1 ? normalise(60) : 0} />
            // </TouchableOpacity>
        )
    };


    return (
        <Fragment>
            <StatusBar />
            <View style={{
                flexDirection: 'row',
                backgroundColor: Colors.black, paddingTop: normalise(10)
            }}>
                <TouchableOpacity style={{ marginRight: normalise(10) }}
                    onPress={() => { props.navigation.goBack() }}>
                    <Image source={ImagePath.backicon}
                        style={{ height: normalise(15), width: normalise(15) }}
                        resizeMode="contain" />
                </TouchableOpacity>
                <Text style={{
                    color: Colors.white, textAlign: 'center', marginTop: -2, width: '80%', fontWeight: 'bold',
                    fontSize: normalise(14)
                }}>{user}</Text>
            </View>

            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.black }}>

                <FlatList
                    data={postData}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                />


            </SafeAreaView>

        </Fragment>

    )

}

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
  
      homePage: () => {
        dispatch(homePageReq())
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
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserPostSongList);


