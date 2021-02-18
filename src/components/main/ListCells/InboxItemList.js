import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image
} from 'react-native';
import normalise from '../../../utils/helpers/Dimens';
import Colors from '../../../assests/Colors';
import ImagePath from '../../../assests/ImagePath';
import PropTypes from "prop-types";


function InboxListItem(props) {



    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
    };

    const onPressImage = () => {
        if (props.onPressImage) {
            props.onPressImage()
        }
    };

    const onPressDelete = () => {
        if (props.onPressImage) {
            props.onPressDelete()
        }
    };

    return (

        <TouchableOpacity style={{
            width: '90%',
            height: normalise(45),
            alignSelf: 'center',
            marginTop: normalise(10),
            marginBottom: props.marginBottom,
        }} onPress={() => { onPress() }}  >


            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', width:'80%' }}>
                    <TouchableOpacity onPress={() => { onPressImage() }}>
                        <Image source={{ uri: props.image }}
                            style={{
                                height: normalise(35),
                                width: normalise(35),
                                borderRadius: normalise(17),
                            }}
                            resizeMode="contain" />
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '70%',
                        alignSelf:'center',
                        marginHorizontal: normalise(10),
                        justifyContent: 'flex-start'
                    }}>
                        <TouchableOpacity onPress={() => { onPressImage() }}>
                            <Text style={{
                                color: Colors.white, fontSize: normalise(11),
                                fontFamily: 'ProximaNova-Bold',
                            }} numberOfLines={1}>{props.title}</Text>
                        </TouchableOpacity>

                        <Text style={{
                            marginTop: normalise(2),
                            color: props.read ? Colors.grey : Colors.white, fontSize: normalise(10),
                            fontFamily: 'ProximaNovaAW07-Medium'
                        }} numberOfLines={2} >{props.description}</Text>



                    </View>

                    <View style={{
                        height: normalise(12), width: normalise(12), borderRadius: normalise(6), alignSelf:'center',
                        backgroundColor: props.read ? Colors.black : Colors.red
                    }} />

                </View>
                <TouchableOpacity style={{
                    height: normalise(25), width: normalise(45),
                    borderRadius: normalise(5), alignSelf: 'center',
                    backgroundColor: Colors.fadeblack,
                    marginHorizontal: normalise(5),
                    justifyContent: 'center', alignItems: 'center'
                }} onPress={() => { onPressDelete() }} >

                    <Image source={ImagePath.threedots} style={{ height: normalise(15), width: normalise(15) }}
                        resizeMode='contain' />

                </TouchableOpacity>

            </View>


            {/* {props.bottom ? null : */}
            <View style={{
                height: 0.5,
                backgroundColor: Colors.activityBorderColor,
                marginTop: normalise(10),
            }} />
            {/* } */}


        </TouchableOpacity>
    )
}

export default InboxListItem;

InboxListItem.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    marginBottom: PropTypes.number,
    description: PropTypes.string,
    read: PropTypes.bool,
    onPressImage: PropTypes.func,
    onPressDelete: PropTypes.func,

};

InboxListItem.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    marginBottom: 0,
    description: "",
    read: false,
    onPressImage: null,
    onPressDelete: null,

}