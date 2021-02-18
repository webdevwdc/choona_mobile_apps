import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Platform, PickerIOS, Picker } from "react-native";
import PropTypes from "prop-types";
import Colors from "../../assests/Colors";
import normalize from "../../utils/helpers/Dimens"


function NewPicker(props) {

    const [showDropdown, manageShowDropdown] = useState(false)
    const [itemIndex, setItemIndex] = useState(0)

    const [text, setText] = useState(props.selectedValue == "" ? props.emptySelectText : getSelectedValue())
    const [selValue, setSelValue] = useState(props.selectedValue)

    function getSelectedValue() {
        for (i = 0; i < props.data.length; i++) {
            if (props.valueParam != "") {
                if (props.data[i][props.valueParam] == props.selectedValue) {
                    return props.data[i][props.itemParam];
                }
            } else {
                return props.selectedValue;
            }


        }
        return "";
    }


    function toggleShowDropdown() {
        if (showDropdown) {
            manageShowDropdown(false);
        } else {
            manageShowDropdown(true);
        }

    }

    function onSelectItem(item, itemIndex) {
        if (props.itemParam == "") {
            setText(item)
        } else {
            setText(props.data.length > 0 ? props.data[itemIndex][props.itemParam] : props.emptySelectText)
        }

        setSelValue(item)
    }

    function onDone() {
        manageShowDropdown(false);
        if (props.data.length > 0) {
            if (props.valueParam != "") {
                onSelectItem(props.data[itemIndex][props.valueParam], itemIndex)
            } else {
                onSelectItem(props.data[itemIndex], itemIndex)
            }
            console.log("ITEM", props.data[itemIndex])
            if (props.onPickerItemSelected) {
                props.onPickerItemSelected(props.data[itemIndex],itemIndex);
            }
        }

    }

    function setRef(ref) {
        if (props.ref) {
            props.ref(ref)
        }
    }



    function renderIOSPicker() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDropdown}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>

                    <View style={{ width: "100%", height: normalize(200), position: "absolute", bottom: 0, alignItems: "center", backgroundColor: Colors.white }}>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableOpacity
                                onPress={() => manageShowDropdown(false)}
                                style={{ padding: normalize(10) }}>
                                <Text style={{ fontSize: normalize(12), color: Colors.blue }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ padding: normalize(10) }}
                                onPress={() => {
                                    console.log("JJJ")
                                    onDone()
                                }}>
                                <Text style={{ fontSize: normalize(12), color: Colors.blue }}>DONE</Text>
                            </TouchableOpacity>
                        </View>

                        <PickerIOS
                            selectedValue={selValue}
                            style={{
                                marginTop: normalize(-8),
                                width: "100%",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                                setItemIndex(itemIndex)
                                setSelValue(itemValue)
                                // onSelectItem(itemValue, itemIndex)
                                // if (props.onPickerItemSelected) {
                                //     props.onPickerItemSelected(props.data[itemIndex]);
                                // }
                            }}>

                            {props.data.map((item, itemIndex) => {

                                return (
                                    <Picker.Item key={itemIndex.toString()} label={props.itemParam != "" ? item[props.itemParam] : item} value={props.valueParam != "" ? item[props.valueParam] : item} />
                                )

                            })
                            }

                        </PickerIOS>
                    </View>

                </View>


            </Modal>

        )
    }

    return (

        <View style={{ width: normalize(80),
            backgroundColor: Colors.fadeblack,
            height: normalize(45),
            borderRadius: normalize(5),
            borderWidth: normalize(1),
            padding: normalize(5),
            borderColor: Colors.grey,
            marginTop: Platform.OS =='android' ? normalize(43.5) : normalize(37) }}>
            {props.placeholder != "" ?
                <Text style={{ fontSize: normalize(12), marginBottom: normalize(5) }}>{props.placeholder}</Text> : null}


            {Platform.OS == "ios" ?
                <TouchableOpacity
                    activeOpacity={0.6}
                    disabled={!props.editable}
                    ref={(ref) => setRef(ref)}
                    style={{ 
                        height: normalize(35),
                        width: normalize(70),
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                    onPress={() => {
                        toggleShowDropdown()
                    }}>
                    <Text numberOfLines={1}
                        style={{
                            fontSize: normalize(props.textSize), color: props.textColor,
                            paddingRight: normalize(props.textPadding),
                            textAlign: props.textAlign, fontFamily: 'ProximaNova-Semibold',
                        }}>{text}</Text>
                </TouchableOpacity> :
                <Picker
                    enabled={props.editable}
                    ref={(ref) => setRef(ref)}
                    selectedValue={props.selectedValue}
                    style={{ height: normalize(45),marginTop:normalize(-6),
                        width: normalize(150),color:'white' }}
                    onValueChange={(itemValue, itemIndex) => {
                        //setSelValue(itemValue);
                        if (props.onPickerItemSelected) {
                            props.onPickerItemSelected(props.data[itemIndex],itemIndex);
                        }
                    }}>

                    {props.data.map((item, index) => {

                        return (

                            <Picker.Item key={index} label={props.itemParam != "" ? item[props.itemParam] : item} value={props.valueParam != "" ? item[props.valueParam] : item} />
                        )
                    })}
                </Picker>

            }


            {renderIOSPicker()}



        </View >
    )
}

export default NewPicker;

NewPicker.propTypes = {
    ref: PropTypes.func,
    selectedValue: PropTypes.any,
    placeholder: PropTypes.string,
    textSize: PropTypes.number,
    onTextChange: PropTypes.func,
    marginTop: PropTypes.number,
    data: PropTypes.array,
    itemParam: PropTypes.string,
    valueParam: PropTypes.string,
    onPickerItemSelected: PropTypes.func,
    width: PropTypes.any,
    textAlign: PropTypes.string,
    textPadding: PropTypes.number,
    emptySelectText: PropTypes.string,
    editable: PropTypes.bool,
    textColor:PropTypes.string

};

NewPicker.defaultProps = {
    ref: null,
    selectedValue: "",
    placeholder: "",
    textSize: 15,
    onTextChange: null,
    marginTop: 10,
    data: [],
    itemParam: "",
    valueParam: "",
    onPickerItemSelected: null,
    width: "100%",
    textAlign: "left",
    textPadding: 0,
    emptySelectText: "",
    editable: true,
    textColor:''
};
