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
    USER_PROFILE_FAILURE,

    COUNTRY_CODE_REQUEST, COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE
} from '../../action/TypeConstants';
import { getProfileRequest, userLogoutReq, getCountryCodeRequest } from '../../action/UserAction';
import toast from '../../utils/helpers/ShowErrorAlert';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';


let status = "";

function Profile(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [flag, setFlag] = useState('');
    const [activity, setActivity] = useState(props.route.params.fromAct)

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getProfileReq();
                    props.getCountryCode();
                })
                .catch(() => {
                    toast('Error', 'Please Connect To Internet')
                })
        });

        return () => {
            unsuscribe();
        }
    });

    console.log(props.route.params.fromAct);

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case USER_PROFILE_REQUEST:
                status = props.status
                break;

            case USER_PROFILE_SUCCESS:
                status = props.status;
                if (activity) {
                    console.log('get index');
                    getIndex();
                }
                break;

            case USER_PROFILE_FAILURE:
                status = props.status
                toast("Oops", "Something Went Wrong, Please Try Again")
                break;

            case COUNTRY_CODE_REQUEST:
                status = props.status
                break;

            case COUNTRY_CODE_SUCCESS:
                status = props.status
                getLocationFlag(props.userProfileResp.location);
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


    function getIndex() {
        let index = props.userProfileResp.post.findIndex(obj => obj._id === props.route.params.postId);
        if (index !== -1) {
            props.navigation.replace('PostListForUser', {
                profile_name: props.userProfileResp.full_name,
                posts: props.userProfileResp.post,
                index: index
            })
        }
        else {
            toast('Oops', 'Post not found');
        }
    };


    function renderProfileData(data) {
        return (
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('PostListForUser', {
                        profile_name: props.userProfileResp.full_name,
                        posts: props.userProfileResp.post,
                        index: data.index
                    })
                }}
                style={{
                    margin: normalise(4),
                    marginBottom: data.index === props.userProfileResp.post.length - 1 ? normalise(30) : normalise(5)
                }}>
                <Image source={{
                    uri: props.userProfileResp.register_type === 'spotify' ? data.item.song_image :
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
    };


    const renderModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                }}>

                <ImageBackground
                    source={ImagePath.page_gradient}
                    style={styles.centeredView}>

                    <View
                        style={styles.modalView}>

                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(12),
                            fontFamily: 'ProximaNova-Semibold',

                        }}>PROFILE MENU</Text>

                        <View style={{
                            backgroundColor: Colors.activityBorderColor,
                            height: 0.5,
                            marginTop: normalise(12),
                            marginBottom: normalise(12),
                        }} />

                        <TouchableOpacity style={{ marginTop: normalise(10) }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Privacy Policy</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ marginTop: normalise(18) }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Terms of Usage</Text>
                        </TouchableOpacity>


                        {/* <TouchableOpacity
                            style={{ marginTop: normalise(18) }}>
                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Change Password</Text>
                        </TouchableOpacity> */}


                        <TouchableOpacity style={{ marginTop: normalise(18) }}
                            onPress={() => { setModalVisible(!modalVisible), props.logoutReq() }}>
                            <Text style={{
                                color: Colors.red,
                                fontSize: normalise(13),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>Logout</Text>
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
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === USER_PROFILE_REQUEST} />
            <Loader visible={props.status === COUNTRY_CODE_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center',
                    justifyContent: 'space-between'
                }}>

                    <View style={{ marginTop: normalise(10) }}>
                        <TouchableOpacity style={{ marginRight: normalise(10) }}
                            onPress={() => { props.navigation.goBack() }}>
                            <Image source={ImagePath.backicon}
                                style={{ height: normalise(15), width: normalise(15) }}
                                resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        flexDirection: 'row', marginTop: normalise(10)
                    }}>

                        <TouchableOpacity style={{ marginRight: normalise(10) }}
                            onPress={() => { props.navigation.navigate("EditProfile") }}>
                            <Image source={ImagePath.settings}
                                style={{ height: normalise(20), width: normalise(20) }}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                            <Image source={ImagePath.iconmenu}
                                style={{ height: normalise(20), width: normalise(20) }}
                                resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={{
                    width: '90%', alignSelf: 'center', flexDirection: 'row',
                    alignItems: 'center', marginTop: normalise(15)
                }}>

                    <Image source={{ uri: constants.profile_picture_base_url + props.userProfileResp.profile_image }}
                        style={{ height: normalise(80), width: normalise(80), borderRadius: normalise(40) }} />

                    <View style={{
                        flexDirection: 'column', alignItems: 'flex-start',
                        marginLeft: normalise(20)
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(15),
                            fontFamily: 'ProximaNova-Semibold'
                        }}>{props.userProfileResp.full_name}</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey,
                            fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }}>{props.userProfileResp.username}</Text>

                        <Text style={{
                            marginTop: normalise(2),
                            color: Colors.darkgrey, fontSize: normalise(11),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }}>{props.userProfileResp.location}  {flag}</Text>


                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginTop: normalise(2),

                        }}>

                            <TouchableOpacity onPress={() => {
                                props.navigation.push("Following", { type: 'user', id: "" })
                            }}>
                                <Text style={{
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold'
                                }}><Text style={{
                                    color: Colors.white, fontFamily: 'ProximaNova-Semibold'
                                }}>{props.userProfileResp.following}</Text>  Following</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.push("Followers", { type: 'user', id: "" })
                                }}>
                                <Text style={{
                                    marginLeft: normalise(10),
                                    color: Colors.darkgrey, fontSize: normalise(11),
                                    fontFamily: 'ProximaNova-Semibold'
                                }}><Text style={{
                                    color: Colors.white, fontFamily: 'ProximaNova-Semibold'
                                }}>{props.userProfileResp.follower}</Text>  Followers</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <ImageBackground source={ImagePath.gradientbar}
                    style={{
                        width: '100%', height: normalise(50),
                        marginTop: normalise(10),
                    }}>

                    {_.isEmpty(props.userProfileResp.feature_song) ?              // IF DATA IS EMPTY
                        <View style={{
                            width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', height: normalise(50),
                        }}>

                            <TouchableOpacity style={{
                                backgroundColor: Colors.fadeblack, height: normalise(40),
                                width: normalise(40), justifyContent: 'center', alignItems: 'center',
                                // borderColor: Colors.white, borderWidth:1, borderRadius: normalise(5)

                            }} onPress={() => { props.navigation.navigate("FeaturedTrack") }}>

                                <Image source={ImagePath.addicon} style={{
                                    height: normalise(20),
                                    width: normalise(20),
                                    borderRadius: normalise(10)
                                }} />

                            </TouchableOpacity>


                            <View style={{
                                flexDirection: 'column', alignItems: 'flex-start', marginLeft: normalise(10)
                            }}>

                                <Text style={{
                                    color: Colors.white, fontSize: normalise(9),
                                    fontFamily: 'ProximaNova-Bold'
                                }}>FEATURED TRACK</Text>

                                <Text style={{
                                    width: '70%', marginTop: normalise(2), fontFamily: 'ProximaNova-Semibold',
                                    color: Colors.white, fontSize: normalise(10),
                                }}>You don't currently have a featured track. Let's add one</Text>

                            </View>

                        </View>

                        // IF DATA IS NOT EMPTY
                        : <View style={{
                            width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', height: normalise(50),
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => {
                                    props.navigation.navigate('Player', {
                                        song_title: JSON.parse(props.userProfileResp.feature_song)[0].song_name,
                                        album_name: JSON.parse(props.userProfileResp.feature_song)[0].album_name,
                                        song_pic: JSON.parse(props.userProfileResp.feature_song)[0].song_pic,
                                        uri: JSON.parse(props.userProfileResp.feature_song)[0].song_uri,
                                        artist: JSON.parse(props.userProfileResp.feature_song)[0].artist_name,
                                        changePlayer: true,
                                        originalUri: JSON.parse(props.userProfileResp.feature_song)[0].hasOwnProperty("original_song_uri") ?
                                            JSON.parse(props.userProfileResp.feature_song)[0].original_song_uri : undefined,
                                        registerType: props.userProfileResp.register_type,
                                        isrc: JSON.parse(props.userProfileResp.feature_song)[0].isrc_code
                                    })
                                }}>

                                    <Image source={{ uri: JSON.parse(props.userProfileResp.feature_song)[0].song_pic }}
                                        style={{ height: normalise(40), width: normalise(40) }} />
                                    <Image source={ImagePath.play} style={{
                                        height: normalise(25), width: normalise(25),
                                        position: 'absolute', marginLeft: normalise(8), marginTop: normalise(8)
                                    }} />
                                </TouchableOpacity>


                                <View style={{
                                    marginStart: normalise(10),
                                    width: "70%"
                                }}>

                                    <Text style={{
                                        color: Colors.white, fontSize:
                                            normalise(9), fontFamily: 'ProximaNova-Regular',
                                    }}>FEATURED TRACK</Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: Colors.white, fontSize: normalise(10),
                                            fontFamily: 'ProximaNova-Bold'
                                        }}>{JSON.parse(props.userProfileResp.feature_song)[0].song_name}</Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: Colors.white, fontSize: normalise(9),
                                            fontFamily: 'ProximaNova-Regular',
                                        }}>{JSON.parse(props.userProfileResp.feature_song)[0].album_name}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("FeaturedTrack") }}>
                                <Image source={ImagePath.change} style={{
                                    height: normalise(40),
                                    width: normalise(40),
                                }} />
                            </TouchableOpacity>
                        </View>}
                </ImageBackground>


                {_.isEmpty(props.userProfileResp.post) ?

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{
                            height: '50%', justifyContent: 'flex-end', alignItems: "center",
                            width: '60%'
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(15), fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                Your Profile is Empty</Text>

                            <Text style={{
                                marginTop: normalise(10), color: Colors.grey, fontSize: normalise(15),
                                textAlign: 'center'
                            }}>You haven't posted any songs yet, let's post one </Text>
                        </View>

                        <View style={{ height: '50%', justifyContent: 'flex-end', alignItems: "center", width: '80%' }}>
                            <TouchableOpacity style={{
                                marginBottom: normalise(10),
                                height: normalise(40), width: '100%', alignItems: 'center',
                                justifyContent: 'center', borderRadius: normalise(20),
                                backgroundColor: Colors.white
                            }} onPress={() => { props.navigation.replace("bottomTab", { screen: "Add" }) }}>

                                <Text style={{
                                    color: Colors.black, fontSize: normalise(12),
                                    fontWeight: 'bold'
                                }}>
                                    POST YOUR FIRST SONG
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    : <FlatList
                        style={{ paddingTop: normalise(10) }}
                        data={props.userProfileResp.post}
                        renderItem={renderProfileData}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2} />}

                {renderModal()}


            </SafeAreaView>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp,
        countryCode: state.UserReducer.countryCodeOject
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfileReq: () => {
            dispatch(getProfileRequest())
        },

        logoutReq: () => {
            dispatch(userLogoutReq())
        },

        getCountryCode: () => {
            dispatch(getCountryCodeRequest())
        }

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    modalView: {
        marginBottom: normalise(10),
        height: normalise(180),
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