import React, { useState } from 'react';
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
} from 'react-native';

import normalize from "../utils/helpers/Dimens";
import Colors from "../assests/Colors";

export default function ButtonComponent(props) {

    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    }

    return (

        <TouchableOpacity activeOpacity={props.activeOpacity} style={{
            marginTop: props.marginTop, width: props.width,
            marginBottom: props.marginBottom,
            backgroundColor: props.buttonColor,
            borderRadius: props.borderRadius,
            height: props.height,
            borderWidth: normalize(props.buttonBorderWidth),
            borderColor: props.buttonBorderColor,
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: "center"
        }}
            onPress={() => { onPress() }}>

            <Text
                style={{
                    color: props.textcolor,
                    textAlign: 'center',
                    fontFamily: 'ProximaNova-Extrabld',
                    fontSize: props.fontSize,
                }} >{props.title}
            </Text>
        </TouchableOpacity>

    )

}
ButtonComponent.propTypes = {

    backcolor: propTypes.string,
    textcolor: propTypes.string,
    marginTop: propTypes.number,
    width: propTypes.string,
    title: propTypes.string,
    onPress: propTypes.func,
    activeOpacity: propTypes.number,
    buttonColor: propTypes.string,
    buttonBorderColor: propTypes.string,
    buttonBorderWidth: propTypes.number,
    height: propTypes.number,
    fontSize: propTypes.number,
    marginBottom: propTypes.number,
    borderRadius: propTypes.number
}

ButtonComponent.defaultProps = {
    textcolor: Colors.black,
    marginTop: normalize(20),
    marginBottom: null,
    title: "",
    onPress: null,
    activeOpacity: null,
    width: '100%',
    buttonColor: Colors.white,
    buttonBorderColor: '',
    buttonBorderWidth: 0,
    height: normalize(45),
    fontSize: normalize(15),
    marginBottom: normalize(0),
    borderRadius: normalize(25)

}