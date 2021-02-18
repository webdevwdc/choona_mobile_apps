

import React from 'react';
import { View, Modal, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../assests/Colors';


export default function AuthLoader(props) {

  return (
   props.visible ? 
      <SafeAreaView
      style={{flex:1,position:'absolute',
      backgroundColor:'rgba(0,0,0,0.5)',zIndex:10,top:0,bottom:0,left:0,right:0,
      height:Dimensions.get('window').height,width:'100%',alignItems:'center',justifyContent:'center'}} >

        <ActivityIndicator size="large" color={Colors.white} />

      </SafeAreaView> : null
  );
}

AuthLoader.propTypes = {

  visible: PropTypes.bool,
};

AuthLoader.defaultProps = {

  visible: true,
};
