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
    Dimensions
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import {
    OTHERS_PROFILE_REQUEST, OTHERS_PROFILE_SUCCESS, OTHERS_PROFILE_FAILURE,
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS, USER_FOLLOW_UNFOLLOW_FAILURE,
    HOME_PAGE_REQUEST, HOME_PAGE_SUCCESS,

    COUNTRY_CODE_REQUEST, COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE
} from '../../action/TypeConstants';
import { othersProfileRequest, userFollowUnfollowRequest, getCountryCodeRequest } from '../../action/UserAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import { connect } from 'react-redux'
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from "lodash"

let status;
let changePlayer = true;

function OthersProfile(props) {


    const [id, setId] = useState(props.route.params.id);
    const [isFollowing, setIsFollowing] = useState(false);
    const [flag, setFlag] = useState('');

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.othersProfileReq(id);
                    props.getCountryCode();
                })
                .catch(() => {
                    toast('Error', 'Please Connect to Internet')
                })
        });

        return () => {
            unsuscribe();
        }
    }, []);

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case OTHERS_PROFILE_REQUEST:
                status = props.status
                break;

            case OTHERS_PROFILE_SUCCESS:
                setIsFollowing(props.othersProfileresp.isFollowing)
                status = props.status;
                break;

            case OTHERS_PROFILE_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong, Please Try Again')
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status
                toast('Oops', 'Something Went Wrong, Please Try Again')
                break;

            case HOME_PAGE_SUCCESS:
                status = props.status
                props.othersProfileReq(props.othersProfileresp._id);

            case COUNTRY_CODE_REQUEST:
                status = props.status
                break;

            case COUNTRY_CODE_SUCCESS:
                status = props.status
                getLocationFlag(props.othersProfileresp.location)
                break;

            case COUNTRY_CODE_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;
        }
    };


    function getLocationFlag(country) {
        let index = props.countryCode.findIndex(obj => obj.name === country);
        if (index !== -1) {
            setFlag(props.countryCode[index].flag);
        }
    };

    function renderProfileData(data) {
        return (
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('PostListForUser', {
                        profile_name: props.othersProfileresp.full_name,
                        posts: props.othersProfileresp.post,
                        index: data.index
                    })
                }}
                style={{
                    margin: normalise(4),
                    marginBottom: data.index === props.othersProfileresp.post.length - 1 ? normalise(30) : normalise(5)
                }}>
                <Image source={{
                    uri: props.othersProfileresp.register_type === 'spotify' ? data.item.song_image :
                        data.item.song_image.replace("100x100bb.jpg", "500x500bb.jpg")
                }}

                    style={{
                        width: Dimensions.get("window").width / 2.1,
                        height: Dimensions.get("window").height * 0.22,
                        borderRadius: normalise(10)
                    }}

                    resizeMode="cover" />
            </TouchableOpacity>
        )
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <Loader visible={props.status === OTHERS_PROFILE_REQUEST} />

            <Loader visible={props.status === HOME_PAGE_REQUEST} />

            <Loader visible={props.status === COUNTRY_CODE_REQUEST} />

            <StatusBar />

            {props.status === OTHERS_PROFILE_SUCCESS || props.status === USER_FOLLOW_UNFOLLOW_SUCCESS
                || props.status === HOME_PAGE_SUCCESS || props.status === COUNTRY_CODE_SUCCESS

                ? <SafeAreaView style={{ flex: 1, }}>

                    <HeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon}
                        title={props.othersProfileresp.username}
                        thirditemtext={true}
                        texttwo={""}
                        onPressFirstItem={() => { props.navigation.goBack() }}
                    />


                    <View style={{
                        width: '90%', alignSelf: 'center', flexDirection: 'row',
                        alignItems: 'center', marginTop: normalise(15)
                    }}>
                        <Image source={{ uri: constants.profile_picture_base_url + props.othersProfileresp.profile_image }}
                            style={{ height: normalise(80), width: normalise(80), borderRadius: normalise(40) }} />

                        <View style={{
                            flexDirection: 'column', alignItems: 'flex-start',
                            marginLeft: normalise(20),
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15),
                                fontFamily: 'ProximaNovaAW07-Medium',

                            }}>{props.othersProfileresp.full_name}</Text>

                            <Text style={{
                                marginTop: normalise(2),
                                color: Colors.darkgrey, fontSize: normalise(11),
                                fontFamily: 'ProximaNovaAW07-Medium',

                            }}>{props.othersProfileresp.post !== undefined ?
                                `${props.othersProfileresp.post.length} ${props.othersProfileresp.post.length > 1 ? "Posts" : "Post"}` : null}
                            </Text>

                            <Text style={{
                                marginTop: normalise(2),
                                color: Colors.darkgrey, fontSize: normalise(11),
                                fontFamily: 'ProximaNovaAW07-Medium',

                            }}>{props.othersProfileresp.location}  {flag}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalise(2), }}>

                                <TouchableOpacity onPress={() => {
                                    props.navigation.push("Following", { type: "public", id: props.othersProfileresp._id })
                                }}>
                                    <Text style={{
                                        color: Colors.darkgrey, fontSize: normalise(11),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}><Text style={{ color: Colors.white }}>{props.othersProfileresp.following}</Text>  Following</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    props.navigation.push("Followers", { type: "public", id: props.othersProfileresp._id })
                                }}>
                                    <Text style={{
                                        marginLeft: normalise(10),
                                        color: Colors.darkgrey, fontSize: normalise(11),
                                        fontFamily: 'ProximaNova-Semibold',
                                    }}><Text style={{ color: Colors.white }}>{props.othersProfileresp.follower}</Text>  Followers</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <View style={{
                        width: '95%', alignSelf: 'center', marginTop: normalise(20), flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-around'
                    }}>

                        <TouchableOpacity
                            style={{
                                height: normalise(30), width: '45%', borderRadius: normalise(15),
                                backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'
                            }} onPress={() => {
                                props.navigation.navigate('AddAnotherSong', {
                                    othersProfile: true,
                                    index: 0, users: [{
                                        _id: props.othersProfileresp._id, username: props.othersProfileresp.username,
                                        full_name: props.othersProfileresp.full_name, profile_image: props.othersProfileresp.profile_image
                                    }]
                                });
                            }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(11), color: Colors.black,
                                fontFamily: 'ProximaNova-Bold'
                            }}>
                                SEND A SONG
            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: normalise(30), width: '45%', borderRadius: normalise(15),
                                backgroundColor: props.othersProfileresp.isFollowing ? Colors.fadeblack : Colors.white,
                                alignItems: 'center', justifyContent: 'center'
                            }} onPress={() => { setIsFollowing(!isFollowing), props.followReq({ follower_id: id }) }}>

                            <Text style={{
                                fontSize: normalise(11), color: props.othersProfileresp.isFollowing ? Colors.white : Colors.black,
                                fontFamily: 'ProximaNova-Bold'
                            }}>
                                {props.othersProfileresp.isFollowing ? "FOLLOWING" : "FOLLOW"}
                            </Text>

                        </TouchableOpacity>

                    </View>

                    <ImageBackground source={ImagePath.gradientbar}
                        style={{
                            width: '100%', height: normalise(50),
                            marginTop: normalise(15),
                        }}>

                        {_.isEmpty(props.othersProfileresp.feature_song) ?

                            <View style={{
                                width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                                justifyContent: 'center', height: normalise(50),
                            }}>
                                <Text style={{
                                    color: Colors.white,
                                    fontSize: normalise(9),
                                    fontFamily: 'ProximaNova-Bold'
                                }}>NO FEATURED TRACK</Text>

                            </View>


                            : <View style={{
                                width: '90%', alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: normalise(50),
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate('Player', {
                                            song_title: JSON.parse(props.othersProfileresp.feature_song)[0].song_name,
                                            album_name: JSON.parse(props.othersProfileresp.feature_song)[0].album_name,
                                            song_pic: JSON.parse(props.othersProfileresp.feature_song)[0].song_pic,
                                            uri: JSON.parse(props.othersProfileresp.feature_song)[0].song_uri,
                                            // originalUri: JSON.parse(props.othersProfileresp.feature_song)[0].original_song_uri,
                                            artist: JSON.parse(props.othersProfileresp.feature_song)[0].artist_name,
                                            changePlayer: changePlayer,
                                            originalUri: JSON.parse(props.othersProfileresp.feature_song)[0].hasOwnProperty("original_song_uri") ?
                                                JSON.parse(props.othersProfileresp.feature_song)[0].original_song_uri : undefined,
                                            registerType: props.othersProfileresp.register_type,
                                            isrc: JSON.parse(props.othersProfileresp.feature_song)[0].isrc_code

                                        })
                                    }}>
                                    <Image source={{ uri: JSON.parse(props.othersProfileresp.feature_song)[0].song_pic }}
                                        style={{ height: normalise(40), width: normalise(40) }} />

                                    <Image source={ImagePath.play} style={{
                                        height: normalise(25), width: normalise(25),
                                        position: 'absolute', marginLeft: normalise(8), marginTop: normalise(8)
                                    }} />
                                </TouchableOpacity>


                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    marginStart: normalise(10),
                                    width: "80%"
                                }}>

                                    <Text style={{
                                        color: Colors.white,
                                        fontSize: normalise(9),
                                        fontFamily: 'ProximaNova-Bold'
                                    }}>FEATURED TRACK</Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: Colors.white,
                                            fontSize: normalise(10),
                                            fontFamily: 'ProximaNova-Bold'

                                        }}>{JSON.parse(props.othersProfileresp.feature_song)[0].song_name}</Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: Colors.white,
                                            fontSize: normalise(9),
                                            fontFamily: 'ProximaNova-Regular',
                                            fontWeight: '400'
                                        }}>{JSON.parse(props.othersProfileresp.feature_song)[0].album_name}</Text>
                                </View>

                            </View>}

                    </ImageBackground>


                    {_.isEmpty(props.othersProfileresp.post) ?

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


                            <Text style={{ color: Colors.white, fontSize: normalise(15), fontWeight: 'bold' }}>
                                Profile is Empty</Text>

                            <Text style={{
                                marginTop: normalise(10), color: Colors.grey, fontSize: normalise(15),
                                width: '60%', textAlign: 'center'
                            }}>{props.othersProfileresp.username} has not posted any songs yet</Text>

                        </View>

                        :

                        <FlatList
                            style={{ paddingTop: normalise(10) }}
                            data={props.othersProfileresp.post}
                            renderItem={renderProfileData}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false}
                            numColumns={2} />
                    }


                </SafeAreaView> : null}


        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        othersProfileresp: state.UserReducer.othersProfileresp,
        countryCode: state.UserReducer.countryCodeOject
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        othersProfileReq: (id) => {
            dispatch(othersProfileRequest(id))
        },
        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },
        getCountryCode: () => {
            dispatch(getCountryCodeRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersProfile)