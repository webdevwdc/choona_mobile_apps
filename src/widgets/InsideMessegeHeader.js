
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


function InsideMessegeHeader(props) {

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
            width: '90%',
            height: normalise(10),
            alignSelf: 'center',
            marginTop: normalise(15),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

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
                        <Image source={ImagePath.backicon}
                            style={{ height: props.imageoneheight, width: props.imageonewidth, marginTop: normalise(-8) }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ left: normalize(40), position: 'absolute', flexDirection: 'row', marginTop: normalise(-12) }}
                        onPress={() => { onPressFirstItem() }}>
                        {/* <Text>Hello</Text> */}
                        <Image source={{uri: props.imageone}}
                            style={{
                                height: normalise(25),
                                width: normalise(25),
                                borderRadius: normalise(25)
                            }}
                            resizeMode="contain"
                        />
                        <Image source={{uri: props.imagesecond}}
                            style={{
                                height: normalise(25),
                                width: normalise(25),
                                marginLeft: normalise(-5),
                                borderRadius: normalise(25)
                            }}
                            resizeMode="contain"
                        />
                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(15),
                            fontFamily: ('ProximaNova-Black'),
                            marginStart: normalise(10),
                            marginTop: normalise(3)
                        }}>
                            {props.title}</Text>
                    </TouchableOpacity>
                </View>}




        </View>
    )
}

export default InsideMessegeHeader;

InsideMessegeHeader.propTypes = {
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
    imagetwowidth: PropTypes.number
};

InsideMessegeHeader.defaultProps = {
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
    imagesecondheight: normalise(30),
    imagesecondwidth: normalise(30),
    imagetwoheight: normalise(15),
    imagetwowidth: normalise(15),

}












// import React, { useEffect, Fragment, useState } from 'react';
// import {
//     SafeAreaView,
//     StyleSheet,
//     ScrollView,
//     View,
//     Text,
//     StatusBar,
//     TouchableOpacity,
//     Image,
//     Alert
// } from 'react-native';
// import normalise from '../utils/helpers/Dimens';
// import Colors from '../assests/Colors';
// import ImagePath from '../assests/ImagePath';
// import PropTypes from 'prop-types'


// function HeaderComponent(props) {

//    function onPressFirstItem () {
//        if(props.onPressFirstItem){
//            props.onPressFirstItem()
//        }
//    }

//    function onPressThirdItem () {
//     if(props.onPressThirdItem){
//         props.onPressThirdItem()
//     }
// }


//     return (

//         <View style={{ width:'90%', alignSelf:'center',
//             flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//             marginTop: normalise(10),
//         }}>

//             {props.firstitemtext ?

//                 <TouchableOpacity style={{ left: 0, position: 'absolute' }}
//                     onPress={() => { onPressFirstItem()}}>
//                    <Text style={{ color: Colors.white, fontSize: normalise(12), fontWeight: 'bold' }}>
//                        {props.textone}</Text>
//                 </TouchableOpacity>:

//                 <TouchableOpacity style={{ left: 0, position: 'absolute' }}
//                     onPress={() => {  onPressFirstItem() }}>
//                     <Image source={props.imageone}
//                         style={{ height: props.imageoneheight, width: props.imageonewidth }}
//                         resizeMode="contain"
//                     />
//                 </TouchableOpacity>}

//              <Text style={{ color: Colors.white, fontSize: normalise(15), fontWeight: 'bold' }}>{props.title}</Text>


//             {props.thirditemtext ?
//                 <TouchableOpacity style={{ right: 0, position: 'absolute' }}
//                 onPress={() => { onPressThirdItem() }}>
//                     <Text style={{ color: Colors.white, fontSize: normalise(12), fontWeight: 'bold' }}>
//                         {props.texttwo}</Text>
//                 </TouchableOpacity>
//                 :

//                 <TouchableOpacity style={{ right: 0, position: 'absolute' }}
//                     onPress={() => { onPressThirdItem() }}>
//                     <Image source={props.imagetwo}
//                         style={{ height: props.imagetwoheight, width: props.imagetwowidth }}
//                         resizeMode="contain"
//                     />
//                 </TouchableOpacity>}
//         </View>
//     )
// }

// export default HeaderComponent;

// HeaderComponent.propTypes = {
//     firstitemtext : PropTypes.bool,
//     thirditemtext: PropTypes.bool,
//     imageone: PropTypes.string,
//     imagetwo: PropTypes.string,
//     textone: PropTypes.string,
//     texttwo: PropTypes.string,
//     title: PropTypes.string,
//     onPressFirstItem: PropTypes.func,
//     onPressThirdItem: PropTypes.func,
//     imageoneheight: PropTypes.number,
//     imageonewidth: PropTypes.number,
//     imagetwoheight: PropTypes.number,
//     imagetwowidth: PropTypes.number
// };

// HeaderComponent.defaultProps = {
//     firstitemtext : true,
//     thirditemtext: true,
//     imageone: "",
//     imagetwo: "",
//     textone: "",
//     texttwo: "",
//     title: "",
//     onPressFirstItem: null,
//     onPressThirdItem: null,
//     imageoneheight: normalise(15),
//     imageonewidth: normalise(15),
//     imagetwoheight: normalise(15),
//     imagetwowidth: normalise(15),
// }