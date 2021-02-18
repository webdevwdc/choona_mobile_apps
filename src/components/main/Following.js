import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Image,
    ImageBackground,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import {
    FOLLOWING_LIST_REQUEST, FOLLOWING_LIST_SUCCESS, FOLLOWING_LIST_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS, USER_FOLLOW_UNFOLLOW_FAILURE, TOP_5_FOLLOWED_USER_REQUEST, TOP_5_FOLLOWED_USER_SUCCESS, TOP_5_FOLLOWED_USER_FAILURE
}
    from '../../action/TypeConstants';
import { followingListReq, userFollowUnfollowRequest, getTop5FollowedUserRequest, followingSearchReq } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux'
import _ from 'lodash'

let status;

function Following(props) {

    const [type, setType] = useState(props.route.params.type)
    const [id, setId] = useState(props.route.params.id)
    // const [following, setFollowing] = useState("")
    const [search, setSearch] = useState("")
    const [bool, setBool] = useState(false)
    // const [followingList, setFollowingList] = useState([]);
    const [top5followingList, setTop5FollowingList] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.followingListReq(type, id)
                })
                .catch(() => {
                    toast('Error', "Please Connect To Internet")
                })
        });

        return () => {
            unsuscribe();
        }
    }, []);


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case FOLLOWING_LIST_REQUEST:
                status = props.status
                break;

            case FOLLOWING_LIST_SUCCESS:
                status = props.status
                // setFollowing(props.followingData.length);
                // setFollowingList(props.followingData);
                if (_.isEmpty(props.followingData)) { props.top5followingListReq() }
                break;

            case FOLLOWING_LIST_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status
                break;

            case TOP_5_FOLLOWED_USER_REQUEST:
                status = props.status
                break;

            case TOP_5_FOLLOWED_USER_SUCCESS:
                status = props.status
                setTop5FollowingList(props.top5FollowedResponse)
                break;

            case TOP_5_FOLLOWED_USER_FAILURE:
                status = props.status
                break;
        }
    };

    // function filterArray(keyword) {

    //     let data = _.filter(props.followingData, (item) => {
    //         return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    //     });
    //     console.log(data);
    //     setFollowingList([]);
    //     setBool(true);
    //     setTimeout(() => {
    //         setFollowingList(data);
    //         setBool(false);
    //     }, 800);
    // };


    function renderFollowersItem(data) {

        if (props.userProfileResp._id === data.item._id) {
            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={false}
                    image2={"123"}
                    marginBottom={data.index === props.followingData.length - 1 ? normalise(20) : 0}
                    onPressImage={() => { props.navigation.push("Profile", { fromAct: false }) }}
                    TouchableOpacityDisabled={false}
                />
            );
        } else {

            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={true}
                    follow={data.item.isFollowing ? false : true}
                    marginBottom={data.index === props.followingData.length - 1 ? normalise(20) : 0}
                    onPressImage={() => {
                        props.navigation.push("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                    TouchableOpacityDisabled={false}
                />
            );
        }
    };

    function rendertop5FollowersItem(data) {

        if (props.userProfileResp._id === data.item._id) {
            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={false}
                    image2={"123"}
                    marginBottom={data.index === props.top5FollowedResponse.length - 1 ? normalise(20) : 0}
                    onPressImage={() => { props.navigation.navigate("Profile", { fromAct: false }) }}
                    TouchableOpacityDisabled={false}
                />
            );
        } else {

            return (

                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={true}
                    follow={data.item.isFollowing ? false : true}
                    marginBottom={data.index === props.top5FollowedResponse.length - 1 ? normalise(20) : 0}
                    onPressImage={() => {
                        props.navigation.replace("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                    TouchableOpacityDisabled={false}
                />
            );
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

            <Loader visible={props.status === FOLLOWING_LIST_REQUEST} />
            <Loader visible={bool} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1 }}>

                    <HeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon} title={`FOLLOWING (${props.followingData.length})`}
                        thirditemtext={true} texttwo={""}
                        onPressFirstItem={() => { props.navigation.goBack() }} />


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
                            onChangeText={(text) => { setSearch(text), props.followingSearch(text) }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => { setSearch(""), props.followingSearch("") }}
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


                    {_.isEmpty(props.followingData) ?

                        <View style={{ flex: 1 }}>
                            <View style={{ height: '45%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{
                                    color: Colors.white, fontSize: normalise(15), textAlign: 'center',
                                    fontFamily: 'ProximaNova-Bold', fontWeight: 'bold',
                                }}>YOU DON'T FOLLOW ANYONE</Text>

                                <Text style={{
                                    color: Colors.grey_text, fontSize: normalise(12), textAlign: 'center',
                                    fontFamily: 'ProximaNova-Semibold', fontWeight: 'bold', width: '80%', marginTop: normalise(5)
                                }}>Choona is a lonely place when you aeen't following anyone, See if you already have friends by connecting below</Text>
                            </View>


                            <Text style={{
                                color: Colors.white, fontSize: normalise(12), marginLeft: normalise(10),
                                fontFamily: 'ProximaNova-Semibold', fontWeight: 'bold',
                            }}>FOLLOW SOME OF OUR POPULAR USERS</Text>

                            <FlatList
                                style={{ marginTop: normalise(10) }}
                                data={top5followingList}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => { index.toString() }}
                                renderItem={rendertop5FollowersItem} />
                        </View>

                        :

                        <FlatList
                            data={props.followingData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => { index.toString() }}
                            renderItem={renderFollowersItem} />
                    }



                </SafeAreaView>

            </TouchableWithoutFeedback>

        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        followingData: state.UserReducer.followingData,
        userProfileResp: state.UserReducer.userProfileResp,
        top5FollowedResponse: state.UserReducer.top5FollowedResponse,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        followingListReq: (usertype, id) => {
            dispatch(followingListReq(usertype, id))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },
        
        top5followingListReq: () => {
            dispatch(getTop5FollowedUserRequest())
        },

        followingSearch: (search) => {
            dispatch(followingSearchReq(search))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Following)