import React, { useState, useEffect } from 'react';
import propTypes from "prop-types";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Image,
    FlatList,
    Alert,
    CheckBox,
    Slider,
    Platform,
    ImageBackground,
    Dimensions
} from 'react-native';

import normalise from "../utils/helpers/Dimens";
import Colors from "../assests/Colors";
import ImagePath from '../assests/ImagePath';
import { connect } from 'react-redux';
import Loader from './AuthLoader';

function MusicPlayerBar(props) {

    const [play, setPlay] = useState(false);
    const [bool, setBool] = useState(true);
    const [time, setTime] = useState(0);

    const ref = global.playerReference !== null && global.playerReference !== undefined ? global.playerReference : null;

    useEffect(() => {
        getPlatingState();
        getPlayingPosition();
        setTimeout(() => {
            setBool(false);
        }, 1000)
    }, []);


    function getPlatingState() {

        if (ref !== null) {

            setInterval(() => {
                const isPlaying = ref.isPlaying();
                setPlay(isPlaying);
            }, 1000)


        }
    };


    function getPlayingPosition() {

        if (ref !== null) {

            setInterval(() => {
                ref.getCurrentTime((seconds) => { setTime(seconds) });
            }, 1000)


        }
    };


    const playOrPause = () => {
        const res = ref.isPlaying();
        if (res) {
            ref.pause();
            console.log('paused');
        }
        else {
            ref.play((success) => {
                if (success) {
                    console.log('Playback End');
                }
            })
        }
    };


    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    };


    const onPressPlayOrPause = () => {
        if (props.onPressPlayOrPause) {
            props.onPressPlayOrPause()
        }
    };
    

    return (

        props.playingSongRef !== "" ?

            <View
                // source={ImagePath.gradientbar}
                style={{
                    width: '100%', height: normalize(45),
                    backgroundColor: Colors.fadeblack,
                    opacity: 0.9, position: 'absolute', bottom: 0
                }}>

                <Loader visible={bool} />

                {/* <Slider
                    style={{
                        width: Platform.OS == 'ios' ? '100%' : normalise(335),
                        height: Platform.OS === 'android' ? 5 : 0, alignSelf: 'center'
                    }}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                /> */}

                <View style={{
                    height: normalise(2), width: `${time * 3.4}%`, alignSelf: 'flex-start',
                    backgroundColor: Colors.white
                }} />

                <TouchableOpacity onPress={() => { onPress() }}>
                    <View style={{
                        width: '90%', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between',
                        marginTop: Platform.OS === 'ios' ? normalize(10) : normalize(8), flexDirection: 'row'
                    }}>

                        <TouchableOpacity onPress={() => { onPress() }}>
                            <Image source={{ uri: props.playingSongRef.song_pic }}
                                style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
                            position: 'absolute', left: 50, width: '70%'
                        }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(11),
                                fontFamily: 'ProximaNova-Semibold',
                                width: '100%',
                            }} numberOfLines={1}>{props.playingSongRef.song_name}</Text>

                            <Text style={{
                                color: Colors.grey_text, fontSize: normalise(10),
                                fontFamily: 'ProximaNovaAW07-Medium', width: '100%',
                            }} numberOfLines={1}>{props.playingSongRef.album_name}</Text>
                        </View>

                        <TouchableOpacity onPress={() => { playOrPause(), onPressPlayOrPause() }}>
                            <Image source={play ? ImagePath.pause : ImagePath.play}
                                style={{ height: normalize(25), width: normalize(25) }}
                                resizeMode={'contain'} />
                        </TouchableOpacity>

                    </View>
                </TouchableOpacity>
            </View> : null
    )

};


MusicPlayerBar.propTypes = {
    onPress: propTypes.func,
    onPressPlayOrPause: propTypes.func
};

MusicPlayerBar.defaultProps = {
    onPress: null,
    onPressPlayOrPause: null
};

const mapStateToProps = (state) => {
    return {
        playingSongRef: state.SongReducer.playingSongRef
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayerBar);