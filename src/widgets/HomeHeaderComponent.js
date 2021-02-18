
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import normalise from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import ImagePath from '../assests/ImagePath';
import PropTypes from 'prop-types'
import { normalizeUnits } from 'moment';


function HomeHeaderComponent(props) {

    function onPressFirstItem() {
        if (props.onPressFirstItem) {
            props.onPressFirstItem()
        }
    }

    function onPressThirdItem() {
        if (props.onPressThirdItem) {
            props.onPressThirdItem()
        }
    }

    return (

        <View style={{
            width: '90%', alignSelf: 'center', marginTop: props.marginTop,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            height: props.height,
        }}>

            {props.firstitemtext ?

                <TouchableOpacity style={{ left: 0, position: 'absolute' }}
                    onPress={() => { onPressFirstItem() }}>
                    <Text style={{ color: Colors.white, fontSize: normalise(12), fontWeight: 'bold' }}>
                        {props.textone}</Text>
                </TouchableOpacity> :

                <View style={{ left: 0, position: 'absolute' }}>
                    <TouchableOpacity style={{ left: 0, position: 'absolute' }}
                        onPress={() => { onPressFirstItem() }}>
                        <Image source={props.staticFirstImage ? props.imageone : { uri: props.imageone }}
                            style={{
                                height: props.imageoneheight,
                                width: props.imageonewidth,
                                borderRadius: props.borderRadius,
                                marginTop: normalise(-8)
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ left: normalize(40), position: 'absolute', flexDirection: 'row', marginTop: normalise(-12) }}
                        onPress={() => { onPressFirstItem() }}>
                        {/* <Text>Hello</Text> */}
                        <Image source={props.imagesecond}
                            style={{ height: normalise(25), width: normalise(25) }}
                            resizeMode="contain"
                        />
                        <Image source={props.imagesecond}
                            style={{ height: normalise(25), width: normalise(25), marginLeft: normalise(-5) }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>}

            {!props.middleImageReq ? <Text style={{ color: Colors.white, fontSize: normalise(15), fontFamily: 'ProximaNova-Black' }}>
                {props.title}</Text> : <Image
                    style={{ width: normalise(85) }}
                    source={ImagePath.home_icon_choona}
                    resizeMode={'contain'}
                />}



            {props.thirditemtext ?
                <TouchableOpacity style={{ right: 0, position: 'absolute' }}
                    onPress={() => { onPressThirdItem() }}>
                    <Text style={{ color: Colors.white, fontSize: normalise(12), fontWeight: 'bold' }}>
                        {props.texttwo}</Text>
                </TouchableOpacity>
                :

                <TouchableOpacity style={{ right: 0, position: 'absolute' }}
                    onPress={() => { onPressThirdItem() }}>
                    <Image source={props.imagetwo}
                        style={{ height: props.imagetwoheight, width: props.imagetwowidth }}
                        resizeMode="contain"
                    />
                    {props.notRead ? <View style={{
                        backgroundColor: Colors.red,
                        height: 10,
                        width: 10,
                        borderRadius: 10,
                        position: 'absolute',
                        top: 0,
                        right: -5
                    }} /> : null}

                </TouchableOpacity>}
        </View>
    )
}

export default HomeHeaderComponent;

HomeHeaderComponent.propTypes = {
    firstitemtext: PropTypes.bool,
    thirditemtext: PropTypes.bool,
    imageone: PropTypes.string,
    imagetwo: PropTypes.string,
    textone: PropTypes.string,
    texttwo: PropTypes.string,
    title: PropTypes.string,
    onPressFirstItem: PropTypes.func,
    onPressThirdItem: PropTypes.func,
    imageoneheight: PropTypes.number,
    imageonewidth: PropTypes.number,
    imagetwoheight: PropTypes.number,
    imagetwowidth: PropTypes.number,
    middleImageReq: PropTypes.bool,
    marginTop: PropTypes.number,
    height: PropTypes.number,
    borderRadius: PropTypes.number,
    staticFirstImage: PropTypes.bool,
    read: PropTypes.bool
};
HomeHeaderComponent.defaultProps = {
    firstitemtext: true,
    thirditemtext: true,
    imageone: "",
    imagetwo: "",
    textone: "",
    texttwo: "",
    title: "",
    onPressFirstItem: null,
    onPressThirdItem: null,
    imageoneheight: normalise(15),
    imageonewidth: normalise(15),
    borderRadius: normalise(7.5),
    imagesecondheight: normalise(30),
    imagesecondwidth: normalise(30),
    imagetwoheight: normalise(15),
    imagetwowidth: normalise(15),
    middleImageReq: false,
    marginTop: normalise(15),
    height: normalise(35),
    staticFirstImage: true,
    notRead: false

}











