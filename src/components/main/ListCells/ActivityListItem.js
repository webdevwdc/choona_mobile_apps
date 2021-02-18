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


function ActivityListItem(props) {

    const [follow, setFollow] = useState(props.follow)

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

    return (

        <View style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: props.marginTop,
            marginBottom: props.marginBottom,
        }}>

            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', marginTop: normalise(10),
                marginBottom: normalise(10),
            }}>

                <TouchableOpacity
                    onPress={() => { onPressImage() }}>
                    <Image source={props.image === "" ? ImagePath.dp : { uri: props.image }}
                        style={{ height: normalise(35), width: normalise(35), borderRadius: normalise(35) }}
                        resizeMode="contain" />
                </TouchableOpacity>

                <TouchableOpacity disabled={props.TouchableOpacityDisabled}
                    style={{ width: props.type ? '50%' : '70%' }}
                    onPress={() => { onPressImage() }}>
                    <Text style={{
                        color: Colors.white, fontSize: normalise(11),
                        width: '90%',
                        fontFamily: 'ProximaNova-Regular', fontWeight: 'bold',
                        marginRight: props.type ? normalise(10) : 0,
                        textAlign: 'left'
                    }} numberOfLines={2}>{props.title}</Text>
                </TouchableOpacity>

                {props.type ?
                    <TouchableOpacity
                        style={{
                            height: normalise(25), width: normalise(80),
                            borderRadius: normalise(12),
                            backgroundColor: follow ? Colors.white : Colors.fadeblack,
                            justifyContent: 'center', alignItems: 'center',
                        }} onPress={() => { onPress(), setFollow(!follow) }} >

                        {follow ?
                            <Text style={{
                                color: Colors.black,
                                fontWeight: 'bold',
                                fontFamily: 'ProximaNova-Regular',
                                fontSize: normalise(10)
                            }}>FOLLOW</Text> :
                            <Text style={{
                                color: Colors.white,
                                fontWeight: 'bold',
                                fontFamily: 'ProximaNova-Regular',
                                fontSize: normalise(10)
                            }}>FOLLOWING</Text>}
                    </TouchableOpacity>

                    :
                    <TouchableOpacity onPress={() => { onPress() }}>
                        <Image source={props.image2 === "" ? ImagePath.dp2 : { uri: props.image2 }}
                            style={{ height: normalise(35), width: normalise(35) }}
                            resizeMode='contain' />
                    </TouchableOpacity>}
            </View>


            {props.bottom ? null :
                <View style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.activityBorderColor
                }} />
            }


        </View>
    )
}

export default ActivityListItem;

ActivityListItem.propTypes = {
    image: PropTypes.string,
    image2: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    type: PropTypes.bool,
    follow: PropTypes.bool,
    marginBottom: PropTypes.number,
    onPressImage: PropTypes.bool,
    marginTop: PropTypes.number,
    TouchableOpacityDisabled: PropTypes.bool
};

ActivityListItem.defaultProps = {
    image: "",
    image2: "",
    title: "",
    onPress: null,
    type: true,
    marginBottom: 0,
    onPressImage: null,
    marginTop: 0,
    TouchableOpacityDisabled: true
}