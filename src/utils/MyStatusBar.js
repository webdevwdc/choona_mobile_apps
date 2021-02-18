//import liraries
import React, { useEffect } from "react";
import { View, StatusBar, Platform } from "react-native";
import propTypes from "prop-types";
import StatusBarSizeIOS from 'react-native-status-bar-size';
import Colors from '../assests/Colors';

const MyStatusBar = ({ backgroundColor, barStyle, height,opacity, ...props }) =>

  (
    <View
      style={[
        { height: Platform.OS === "ios" ? StatusBarSizeIOS.currentHeight : StatusBar.currentHeight },
        { backgroundColor },{opacity}
      ]}
    >
      <StatusBar

        translucent
        backgroundColor={backgroundColor}
        {...props}
        barStyle={barStyle}
        hidden={false}
      />
    </View>
  );

export default MyStatusBar;

MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  height: propTypes.number,
  opacity:propTypes.number
};

MyStatusBar.defaultProps = {
  backgroundColor: Colors.black,
  barStyle: "light-content",
  height: 20,
  opacity:null
};