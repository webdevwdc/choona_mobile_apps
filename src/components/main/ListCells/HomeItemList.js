import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Modal,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from "prop-types";
import { normalizeUnits } from 'moment';
import constants from '../../../utils/helpers/constants';
import moment from "moment";


function HomeItemList(props) {

    const react = ["🔥", "😍", "💃", "🕺", "🤤", "👍"]

    const [plusVisible, setPlusVisible] = useState(false);
    const [numberOfLines, setNumberOfLines] = useState(3);
    const [viewMore, setViewMore] = useState(false);

    let fire = [];
    let heartEyes = [];
    let dancingGirl = [];
    let party = [];
    let laughing = [];
    let hundred = [];


    if (props.reactions.length > 0) {
        props.reactions.map((item, index) => {

            if (item.text === react[0]) {
                fire.push(item)
            }

            else if (item.text === react[1]) {
                heartEyes.push(item)
            }

            else if (item.text === react[2]) {
                dancingGirl.push(item)
            }

            else if (item.text === react[3]) {
                party.push(item)
            }

            else if (item.text === react[4]) {
                laughing.push(item)
            }

            else if (item.text === react[5]) {
                hundred.push(item)
            }
        })
    }


    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    }

    const onPressImage = () => {
        if (props.onPressImage) {
            props.onPressImage()
        }
    };

    const onPressSecondImage = () => {
        if (props.onPressSecondImage) {
            props.onPressSecondImage()
        }
    };
    const onPressCommentbox = () => {

        if (props.onPressCommentbox) {
            props.onPressCommentbox()
        }
    };


    const onPressReactionbox = () => {
        if (props.onPressReactionbox) {
            props.onPressReactionbox()
        }
    };


    const onPressMusicbox = () => {
        if (props.onPressMusicbox) {
            props.onPressMusicbox()
        }
    };


    const onReactionPress = (reaction) => {
        if (props.onReactionPress) {
            props.onReactionPress(reaction)
        }

    };

    return (

        <View style={{
            width: normalise(285),
            alignSelf: 'center',
            marginTop: normalise(10),
            marginBottom: props.marginBottom
        }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
            }}>

                <View style={{ flexDirection: 'row' }}>

                    <Image source={props.postType ? ImagePath.spotifyicon : ImagePath.apple_icon_round}
                        style={{
                            height: normalise(24),
                            width: normalise(24),
                            borderRadius: normalise(12)
                        }}
                        resizeMode="contain" />



                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginStart: normalise(5),
                        width: normalise(200)
                    }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(11),
                            fontFamily: 'ProximaNova-Semibold',
                        }} numberOfLines={1}> {props.title} </Text>

                        <Text style={{
                            color: Colors.grey, fontSize: normalise(10),
                            fontFamily: 'ProximaNovaAW07-Medium',
                        }} numberOfLines={1}> {props.singer} </Text>


                    </View>

                </View>



                <View style={{
                    height: normalise(40), width: normalise(50), backgroundColor: Colors.black,
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity style={{
                        height: normalise(25), width: normalise(45),
                        borderRadius: normalise(5), alignSelf: 'center', backgroundColor: Colors.fadeblack,
                        justifyContent: 'center', alignItems: 'center'
                    }} onPress={() => { props.onPressSecondImage() }} >

                        <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                            resizeMode='contain' />

                    </TouchableOpacity>
                </View>
            </View>


            <TouchableOpacity onPress={() => { props.onPressMusicbox() }}
                style={{
                    height: normalise(250), width: normalise(280), alignSelf: 'center',
                    borderRadius: normalise(10), backgroundColor: Colors.darkerblack, borderWidth: normalise(0.5),
                    borderColor: Colors.grey, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}   >


                <Image source={props.image === "" ? ImagePath.profiletrack1 : { uri: props.image }}
                    style={{ height: normalise(250), width: normalise(280), borderRadius: normalise(10) }}
                    resizeMode="cover" />

                <Image source={props.play ? ImagePath.pause : ImagePath.play}
                    style={{
                        height: normalise(60), width: normalise(60), position: 'absolute',
                        marginLeft: normalise(10), marginTop: normalise(11)
                    }} />

                <View style={{
                    position: 'absolute',
                    width: '95%',
                    marginBottom: normalise(10),
                    alignSelf: 'center',
                    marginHorizontal: normalise(10),
                    bottom: 0,
                    height: normalise(50),
                    justifyContent: 'space-between',
                    borderRadius: normalise(35),
                    backgroundColor: Colors.white,
                    opacity: 0.9,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: normalise(10)
                }}>

                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[0]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[0]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{fire.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[1]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[1]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{heartEyes.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[2]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[2]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{dancingGirl.length}</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[3]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[3]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{party.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[4]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[4]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{laughing.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onReactionPress(react[5]);
                        }}
                    >
                        <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[5]}</Text>
                        <View style={{
                            backgroundColor: Colors.white, opacity: 15, height: normalise(16),
                            width: normalise(16), borderRadius: normalise(8),
                            position: "absolute", right: 0, alignItems: 'center',
                            top: Platform.OS === 'android' ? 2 : 0
                        }}>
                            <Text style={{ fontFamily: 'ProximaNova-Semibold' }}>{hundred.length}</Text>
                        </View>
                    </TouchableOpacity>


                    {/* <TouchableOpacity
                        onPress={() => { onAddReaction() }}>


                        <Image source={props.modalVisible ? ImagePath.greycross : ImagePath.greyplus}
                            style={{
                                height: normalise(35), width: normalise(35),

                            }} resizeMode="contain" />
                    </TouchableOpacity> */}


                </View>
            </TouchableOpacity>


            <View style={{

                width: normalise(280), marginTop: normalize(10),
                alignSelf: 'center',
            }}>

                <View style={{
                    flexDirection: 'row', alignItems: 'flex-start',
                    justifyContent: 'space-between', width: '100%',
                }}>

                    <TouchableOpacity style={{ width: '9%' }}
                        onPress={() => { onPressImage() }}>
                        <Image source={props.picture === "" ? ImagePath.dp1 : { uri: constants.profile_picture_base_url + props.picture }}
                            style={{
                                height: normalise(20), width: normalise(20),
                                borderRadius: normalise(20)
                            }}
                            resizeMode="contain" />
                    </TouchableOpacity>


                    <View style={{
                        width: '91%', flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity onPress={() => { onPressImage() }}>
                            <Text style={{
                                color: Colors.white, fontSize: 14,
                                fontFamily: 'ProximaNova-Semibold',

                            }} numberOfLines={1}>{props.name}</Text>
                        </TouchableOpacity>

                        <Text style={{
                            color: Colors.grey_text,
                            fontFamily: 'ProximaNovaAW07-Medium', fontSize: 12,
                        }}>{moment(props.time).fromNow()} </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={numberOfLines}
                    style={{
                        color: Colors.white, fontSize: 12,
                        fontFamily: 'ProximaNovaAW07-Medium', bottom: 6,
                        width: '90.6%',
                        alignSelf: 'flex-end', textAlign: 'left',
                    }}>{props.content}</Text>

                {props.content.length > 150 ? <TouchableOpacity onPress={() => {
                    !viewMore ? setNumberOfLines(10) : setNumberOfLines(3),
                        setViewMore(!viewMore)
                }}>
                    <Text
                        style={{
                            color: Colors.white, fontSize: 12,
                            fontFamily: 'ProximaNovaAW07-Medium', bottom: 6,
                            width: '90.6%',
                            alignSelf: 'flex-end', textAlign: 'left',
                        }}>{!viewMore ? `...View More` : `View Less`}</Text>
                </TouchableOpacity> : null}

                <View style={{
                    height: normalise(30), flexDirection: 'row',
                    justifyContent: 'space-between', marginStart: Platform.OS === 'android' ?
                        normalize(25) : normalise(24),
                    marginTop: normalise(5)
                }}>


                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { onPressCommentbox() }} >



                        <Text style={{
                            color: Colors.white, fontSize: 10,
                            fontFamily: 'ProximaNova-Bold',
                        }}>{props.comments.length > 0 ? props.comments.length > 1 ? `${props.comments.length} COMMENTS`
                            : `${props.comments.length} COMMENT` : `COMMENT`}</Text>

                    </TouchableOpacity>



                    <TouchableOpacity style={{
                        height: normalise(28), width: "48%", alignSelf: 'center',
                        borderRadius: normalise(5), backgroundColor: Colors.fadeblack, borderWidth: normalise(0.2),
                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }} onPress={() => { onPressReactionbox() }} >



                        <Text style={{
                            color: Colors.white, fontSize: 10,
                            fontFamily: "ProximaNova-Bold"
                        }}>{props.reactions.length > 1 ? `${props.reactions.length} REACTIONS`
                            : `${props.reactions.length} REACTION`}</Text>

                    </TouchableOpacity>
                </View>
            </View>



        </View>

    )
}

export default HomeItemList;

HomeItemList.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    onPressImage: PropTypes.bool,
    singer: PropTypes.string,
    marginBottom: PropTypes.number,
    change: PropTypes.bool,
    image2: PropTypes.string,
    onPressSecondImage: PropTypes.func,
    onPressCommentbox: PropTypes.func,
    onPressReactionbox: PropTypes.func,

    onPressReact1: PropTypes.func,

    onPressReact2: PropTypes.func,
    onPressReact3: PropTypes.func,

    onPressReact4: PropTypes.func,
    onAddReaction: PropTypes.func,
    modalVisible: PropTypes.bool,
    play: PropTypes.bool,
    postType: PropTypes.bool

};

HomeItemList.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    onPressImage: null,
    singer: "",
    marginBottom: 0,
    change: false,
    image2: "",
    onPressSecondImage: null,
    modalVisible: false,
    postType: true,
    play: false
}