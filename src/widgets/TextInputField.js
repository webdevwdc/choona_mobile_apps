import React, { useState } from "react";
import { View, Platform, Text, TextInput, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import normalize from "../utils/helpers/Dimens";
import Colors from "../assests/Colors";
import ImagePath from "../assests/ImagePath";

function TextInputField(props) {

    const [focused, setFocused] = useState(false)

    function onChangeText(text) {
        if (props.onChangeText) {
            props.onChangeText(text)
        }
    }

    return (
        <View style={{  marginTop: normalize(props.marginTop), marginBottom: normalize(props.marginBottom) }}>


            <Text style={{
                fontSize: normalize(12),
                color: Colors.white,
                fontFamily: 'ProximaNova-Bold',

            }}>{props.text}</Text>

            <TextInput

                style={{
                    width: props.width,
                    marginTop: normalize(10),
                    fontFamily: 'ProximaNova-Semibold',
                    fontSize: normalize(12),
                    backgroundColor: Colors.fadeblack,
                    height: normalize(45),
                    borderRadius: normalize(5),
                    borderWidth: normalize(1),
                    padding: normalize(5),
                    paddingLeft: normalize(20),
                    borderColor: focused ? Colors.white : Colors.grey,
                    color: Colors.white,
                }}
                onFocus={() => { setFocused(true) }}
                onBlur={() => setFocused(false)}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                keyboardType={props.isNumber ? 'phone-pad' : 'default'}
                autoCapitalize={props.autoCapitalize}
                value={props.value}
                placeholderTextColor={props.placeholderTextColor}
                secureTextEntry={props.isPassword}
                onChangeText={(text) => { onChangeText(text) }}

            />
            {props.tick_req && props.tick_visible ? <Image
                source={props.userNameAvailable ? ImagePath.green_tick : ImagePath.crossIcon}
                style={{
                    position: 'absolute',
                    height: normalize(20),
                    width: normalize(20),
                    top: normalize(38),
                    right: normalize(10)
                }} /> : null}


        </View>

    )
}


export default TextInputField;

TextInputField.propTypes = {
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    autoCapitalize: PropTypes.string,
    isPassword: PropTypes.bool,
    value: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    onChangeText: PropTypes.func,
    marginTop: PropTypes.number,
    text: PropTypes.string,
    marginBottom: PropTypes.number,
    borderColor: PropTypes.string,
    tick_req: PropTypes.bool,
    tick_visible: PropTypes.bool,
    isNumber: PropTypes.bool,
    userNameAvailable: PropTypes.bool,
    width:PropTypes.bool
}

TextInputField.defaultProps = {
    placeholder: "",
    maxLength: 40,
    autoCapitalize: 'none',
    isPassword: false,
    // value: "",
    placeholderTextColor: Colors.grey,
    onChangeText: null,
    marginTop: normalize(12),
    text: "",
    marginBottom: normalize(0),
    width:'100%',
    borderColor: Colors.grey,
    tick_req: false,
    tick_visible: false,
    isNumber: false,
    userNameAvailable: true,
}