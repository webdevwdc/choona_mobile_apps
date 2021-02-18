import React, { useEffect, Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    Platform,
    PermissionsAndroid
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';
import StatusBar from '../../utils/MyStatusBar';

export default function Splash(props) {

    useEffect(() => {
        requestAllpermissions()
    }, []);


    //REQUEST CAMERA PERMISSION
    async function requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: "Choona Camera Permission",
                message: "Choona needs access to your camera",
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });

            if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
                console.log("Camera Permission Given")
            }
            else {
                console.log('Camera Permisiion Denied')
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    // REQUEST READ PERMISSION
    async function requestExternalReadPermission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: "Choona External Storage Read Permission",
                message: "Choona needs access to read data from your SD Card ",
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });

            if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
                console.log('External Read Permisiion Given')
            }
            else {
                console.log('External Read Permisiion Denied')
            }
        }
        catch (error) {
            console.log(error)
        }
    };


    // REQUEST CONTACT READ PERMISSION
    async function contactReadPermission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: "Choona Contacts Permission",
                message: "Choona needs access to your contacts",
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });

            if (granted === PermissionsAndroid.PERMISSIONS.GRANTED) {
                console.log('Contacts Read Permisiion Given')
            }
            else {
                console.log('Contacts Read Permisiion Denied')
            }
        }
        catch (error) {
            console.log(error)
        }
    };


    //MERGING FUNCTIONS
    async function requestAllpermissions() {
        await requestCameraPermission()
        await requestExternalReadPermission()
        await contactReadPermission()
    };


    //VIEW
    return (

        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.black }}>
            <StatusBar
                backgroundColor={Colors.black} />

            <Image source={ImagePath.appIcon512}
                style={{ height: normalise(130), width: '60%' }}
                resizeMode='contain' />

            <Text style={{
                color: Colors.white,
                fontSize: normalise(10),
                position: 'absolute',
                fontFamily: 'ProximaNova-Bold',
                bottom: 20
            }} >
                Copyright ©2020 CHOONA
                        </Text>

        </View>
    )
};