
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HomeHeaderComponent';
import CommentList from '../main/ListCells/CommentList';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import moment from 'moment'
import {
    COMMENT_ON_POST_REQUEST, COMMENT_ON_POST_SUCCESS,
    COMMENT_ON_POST_FAILURE
} from '../../action/TypeConstants';
import { commentOnPostReq } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';


let status;

function HomeItemComments(props) {

    const [type, setType] = useState(props.route.params.type);
    const [index, setIndex] = useState(props.route.params.index);

    const [commentData, setCommentData] = useState(props.route.params.comment);

    const [image, setImage] = useState(props.route.params.image);

    const [username, setUserName] = useState(props.route.params.username);

    const [userComment, setUserComment] = useState(props.route.params.userComment);

    const [time, setTime] = useState(props.route.params.time);

    const [id, setId] = useState(props.route.params.id);

    const [commentText, setCommentText] = useState("");
    const [arrayLength, setArrayLength] = useState(`${commentData.length} ${commentData.length > 1 ? "COMMENTS" : "COMMENT"}`)


    function renderItem(data) {
        return (
            <CommentList
                image={constants.profile_picture_base_url + data.item.profile_image}
                name={data.item.username}
                comment={data.item.text}
                time={moment(data.item.createdAt).from()}
                marginBottom={data.index === commentData.length - 1 ?
                    Platform.OS === 'android' ? normalise(80) : normalise(50) : normalise(0)}
                onPressImage={() => {
                    if (props.userProfileResp._id === data.item.user_id) {
                        props.navigation.navigate('Profile', {fromAct: false})
                    }
                    else {
                        props.navigation.navigate('OthersProfile', { id: data.item.user_id })
                    }
                }}
            />
        )
    };

    if (status === "" || props.status !== status) {
        switch (props.status) {

            case COMMENT_ON_POST_REQUEST:
                status = props.status
                break;

            case COMMENT_ON_POST_SUCCESS:
                status = props.status
                setCommentText("")
                let data = props.commentResp.comment[props.commentResp.comment.length - 1]
                data.profile_image = props.userProfileResp.profile_image
                commentData.push(data);
                setArrayLength(`${commentData.length} ${commentData.length > 1 ? "COMMENTS" : "COMMENT"}`)
                break;

            case COMMENT_ON_POST_FAILURE:
                status = props.status;
                toast('Oops', 'Something Went Wrong');
                break;

        }
    };


    return (

        <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1, backgroundColor: Colors.black, }}>

            <Loader visible={props.status === COMMENT_ON_POST_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <HeaderComponent
                    firstitemtext={false}
                    imageone={ImagePath.backicon}
                    //imagesecond={ImagePath.dp}
                    title={arrayLength}
                    thirditemtext={false}
                    marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
                    // imagetwo={ImagePath.newmessage} 
                    imagetwoheight={25}
                    imagetwowidth={25}
                    onPressFirstItem={() => { props.navigation.goBack() }} />

                <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}>

                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <Image source={{ uri: image }}
                                style={{ height: normalise(60), width: normalise(60), }}
                                resizeMode="contain" />

                            {/* <Image source={ImagePath.play}
                                style={{
                                    height: normalise(20), width: normalise(20), position: 'absolute',
                                    alignSelf: 'center'
                                }} /> */}
                        </TouchableOpacity>


                        <View style={{ marginLeft: normalise(10) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: normalise(230) }}>

                                <Text style={{
                                    color: Colors.white, fontSize: 14, fontFamily: 'ProximaNova-Semibold',
                                }}>{username}</Text>

                                <Text style={{
                                    marginEnd: normalise(12.5),
                                    color: Colors.grey_text, fontSize: 12, fontFamily: 'ProximaNovaAW07-Medium',
                                }}>{moment(time).from()}</Text>

                            </View>

                            <View>

                                <Text style={{
                                    width: normalise(218), color: Colors.white, fontSize: 12, marginTop: normalise(2),
                                    fontFamily: 'ProximaNovaAW07-Medium'
                                }}>{userComment}</Text>

                            </View>
                        </View>
                    </View>


                    <View style={{
                        marginTop: normalise(10), borderBottomWidth: normalise(1),
                        borderBottomColor: Colors.activityBorderColor
                    }} />

                </View>

                <SwipeListView
                    data={commentData}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => { index.toString() }}
                    disableRightSwipe={true}
                    rightOpenValue={-75} />



                <View style={{
                    width: '95%',
                    backgroundColor: Colors.fadeblack,
                    borderColor: Colors.activityBorderColor,
                    borderWidth: 1,
                    flexDirection: 'row',
                    padding: normalise(4),
                    borderRadius: normalise(25),
                    marginTop: normalise(20),
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: normalise(15),
                    justifyContent: 'space-between'
                }}>

                    <TextInput multiline
                        style={{
                            width: '80%',
                            maxHeight: normalise(100),
                            fontSize: normalise(12),
                            color: Colors.white,
                            marginTop: Platform.OS === 'android' ? 0 : normalise(6),
                            marginStart: normalise(10),
                            paddingBottom: normalise(11)
                        }}
                        value={commentText}
                        placeholder={"Add a comment..."}
                        placeholderTextColor={Colors.white}
                        onChangeText={(text) => { setCommentText(text) }} />

                    {commentText !== "" ?
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            onPress={() => {
                                let commentObject = {
                                    post_id: id,
                                    text: commentText
                                };
                                isInternetConnected()
                                    .then(() => {
                                        props.commentOnPost(commentObject)
                                    })
                                    .catch(() => {
                                        toast('Error', 'Please Connect To Internet')
                                    })

                            }}>
                            <Text style={{
                                fontSize: normalise(13),
                                color: Colors.white,
                                marginEnd: normalise(10),
                                fontWeight: 'bold'
                            }}>POST</Text>

                        </TouchableOpacity> : null}

                </View>

            </SafeAreaView>

        </KeyboardAvoidingView>
    )
};


const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        postData: state.UserReducer.postData,
        searchData: state.PostReducer.searchPost,
        commentResp: state.UserReducer.commentResp,
        userProfileResp: state.UserReducer.userProfileResp,
        getPostFromTop50: state.PostReducer.getPostFromTop50,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        commentOnPost: (payload) => {
            dispatch(commentOnPostReq(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeItemComments);
