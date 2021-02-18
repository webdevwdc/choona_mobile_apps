import React, { useEffect, Fragment, useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text, Slider,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
    KeyboardAvoidingView,
    Dimensions,
    Modal,
    Linking,
    Alert
} from 'react-native';
import normalise from '../utils/helpers/Dimens';
import Colors from '../assests/Colors';
import ImagePath from '../assests/ImagePath';
import HeaderComponent from '../widgets/HeaderComponent';
import CommentList from '../components/main/ListCells/CommentList';
import StatusBar from '../utils/MyStatusBar';
import RBSheet from "react-native-raw-bottom-sheet";
import toast from '../utils/helpers/ShowErrorAlert';
import { connect } from 'react-redux';
import constants from '../utils/helpers/constants';
import moment from 'moment';
import isInternetConnected from '../utils/helpers/NetInfo';
import _ from 'lodash';

let RbSheetRef;
