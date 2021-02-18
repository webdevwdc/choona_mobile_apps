import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ActivityListItem from '../ListCells/ActivityListItem';
import ImagePath from '../../../assests/ImagePath';
import StatusBar from '../../../utils/MyStatusBar';
import { activityListReq, userFollowUnfollowRequest, getProfileRequest } from '../../../action/UserAction';
import {
    ACTIVITY_LIST_REQUEST, ACTIVITY_LIST_SUCCESS,
    ACTIVITY_LIST_FAILURE,

    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,
    USER_PROFILE_REQUEST,
    EDIT_PROFILE_REQUEST,
} from '../../../action/TypeConstants';
import { connect } from 'react-redux'
import isInternetConnected from '../../../utils/helpers/NetInfo';
import toast from '../../../utils/helpers/ShowErrorAlert';
import Loader from '../../../widgets/AuthLoader';
import constants from '../../../utils/helpers/constants';
import _ from 'lodash'
import { editProfileRequest } from '../../../action/UserAction';

let status;

function Notification(props) {

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    updateProfile(),
                        props.activityListReq()

                })
                .catch(() => {
                    toast('Error', "Please Connect To Internet")
                })
        });

        return () => {
            unsuscribe();
        }
    });


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case ACTIVITY_LIST_REQUEST:
                status = props.status
                break;

            case ACTIVITY_LIST_SUCCESS:
                status = props.status
                break;

            case ACTIVITY_LIST_FAILURE:
                status = props.status
                toast('Error', "Something Went Wrong, Please Try Again")
                break;

        }
    };

    const updateProfile = () => {

        let formdata = new FormData;

        formdata.append("isActivity", false);

        isInternetConnected()
            .then(() => {
                props.editProfileReq(formdata),
                setTimeout(()=>{
                    props.getProfileReq();
                },1000);
            })
            .catch((err) => {
                toast("Oops", "Please Connect To Internet")
            })
    }

    function renderTodayitem(data) {

        if (data.item.activity_type === 'following') {

            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} started following you`}
                    follow={!data.item.isFollowing}
                    bottom={data.index === props.activityListToday.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListToday.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                />
            );
        }
        else if (data.item.activity_type === 'reaction') {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} reacted ${data.item.text} on your post`}
                    type={false}
                    image2={data.item.image}
                    bottom={data.index === props.activityListToday.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListToday.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.navigation.navigate('Profile', { postId: data.item.post_id, fromAct: true }) }}
                />
            );
        }
        else {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} commented "${data.item.text}" on your post`}
                    type={false}
                    image2={data.item.image}
                    bottom={data.index === props.activityListToday.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListToday.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.navigation.navigate('Profile', { postId: data.item.post_id, fromAct: true })  }}
                />
            )
        }

    };


    function renderPreviousItem(data) {

        if (data.item.activity_type === 'following') {

            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} started following you`}
                    follow={!data.item.isFollowing}
                    bottom={data.index === props.activityListPrevious.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListPrevious.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                />
            );
        }
        else if (data.item.activity_type === 'reaction') {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} reacted ${data.item.text} on your post`}
                    type={false}
                    image2={data.item.image}
                    bottom={data.index === props.activityListPrevious.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListPrevious.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.navigation.navigate('Profile', { postId: data.item.post_id, fromAct: true }) }}
                />
            );
        }
        else {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={`${data.item.username} commented "${data.item.text}" on your post`}
                    type={false}
                    image2={data.item.image}
                    bottom={data.index === props.activityListPrevious.length - 1 ? true : false}
                    marginBottom={data.index === props.activityListPrevious.length - 1 ? normalise(4) : normalise(0)}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.navigation.navigate('Profile', { postId: data.item.post_id, fromAct: true })  }}
                />
            )
        }

    };


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === ACTIVITY_LIST_REQUEST} />
            <Loader visible={props.status === USER_PROFILE_REQUEST} />
            <Loader visible={props.status === EDIT_PROFILE_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <Text style={{
                    fontSize: normalise(15),
                    fontFamily: ('ProximaNova-Black'),
                    color: Colors.white,
                    marginTop: normalise(10),
                    alignSelf: 'center',
                    marginBottom: normalise(10)
                }}> ACTIVITY</Text>


                {_.isEmpty(props.activityListToday) && _.isEmpty(props.activityListPrevious) ?

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: Colors.white, fontSize: normalise(15) }}>No Activity</Text>
                    </View>

                    :
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {_.isEmpty(props.activityListToday) ? null :
                            <View style={{
                                marginTop: normalise(12), flexDirection: 'row',
                                width: '100%', height: normalise(40), alignItems: 'center', backgroundColor: Colors.fadeblack
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(12), marginLeft: normalise(20),
                                    fontFamily: 'ProximaNova-Regular', fontWeight: 'bold',
                                }}>TODAY</Text>
                            </View>}

                        <FlatList
                            data={props.activityListToday}
                            renderItem={renderTodayitem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />



                        {_.isEmpty(props.activityListPrevious) ? null :
                            <View style={{
                                flexDirection: 'row', width: '100%', height: normalise(40),
                                alignItems: 'center', backgroundColor: Colors.fadeblack
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(12), marginLeft: normalise(20),
                                    fontFamily: 'ProximaNova-Regular', fontWeight: 'bold',
                                }}>PREVIOUSLY</Text>
                            </View>}

                        <FlatList
                            style={{ marginBottom: normalise(5) }}
                            data={props.activityListPrevious}
                            renderItem={renderPreviousItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                        />

                    </ScrollView>}
            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        activityListPrevious: state.UserReducer.activityListPrevious,
        activityListToday: state.UserReducer.activityListToday
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        activityListReq: () => {
            dispatch(activityListReq())
        },
        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },
        editProfileReq: (payload) => {
            dispatch(editProfileRequest(payload))
        },
        getProfileReq: () => {
            dispatch(getProfileRequest())
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification)