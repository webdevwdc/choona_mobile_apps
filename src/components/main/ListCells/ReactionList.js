








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


function ReactionList(props) {


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

    return (

        <View style={{ width: '90%', alignSelf: 'center', marginTop: normalise(15), marginBottom: props.marginBottom }}>

            <View style={{
                flexDirection: 'row', 
             
            }}>

                <TouchableOpacity onPress={() => { onPressImage() }}  >
                    <Image source={props.image}
                        style={{ height: normalise(30), width: normalise(30),borderRadius:normalise(15) }}
                        resizeMode="contain" />

                    
                </TouchableOpacity>
             <View style={{marginLeft:normalise(10),}}>
                <View  style={{flexDirection:'row'}}>

                 <Text style={{width:normalise(180),color:Colors.white,fontSize:14}}>
                      {props.name}
                  </Text>
                  <Text style={{width:normalise(70),color:Colors.white,fontSize:12}}>
                     {props.time} minutes ago
                  </Text>
                  </View>
                  <View>
                  <Text style={{width:normalise(220),color:Colors.white,fontSize:12,marginTop:normalise(8)}}>
                 {props.comment}
                   
                  </Text>
                  </View>
             </View>
    
            </View>

            <View style={{
                marginTop: normalise(10), borderBottomWidth: normalise(1),
                borderBottomColor: Colors.grey
            }} />

        </View>

    )
}

export default CommentList;

ReactionList.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func,
    onPressImage: PropTypes.bool,
    singer: PropTypes.string,
    marginBottom: PropTypes.number,
    change: PropTypes.bool,
    image2: PropTypes.string,
    onPressSecondImage: PropTypes.func,
    comments: PropTypes.bool
};
ReactionList.defaultProps = {
    image: "",
    title: "",
    onPress: null,
    onPressImage: null,
    singer: "",
    marginBottom: 0,
    change: false,
    image2: "",
    onPressSecondImage: null,
    comments: false
}