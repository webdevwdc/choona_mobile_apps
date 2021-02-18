import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    Platform
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import { tokenRequest } from '../../action/index';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import TextInputField from '../../widgets/TextInputField';
import Button from '../../widgets/ButtonComponent';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../../utils/helpers/ShowErrorAlert';
import StatusBar from '../../utils/MyStatusBar';
import {
    USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE,
    USER_LOGIN_FAILURE,
    COUNTRY_CODE_REQUEST,
    COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE
} from '../../action/TypeConstants';
import { signupRequest, getCountryCodeRequest } from '../../action/UserAction';
import { connect } from 'react-redux';
import { register } from 'react-native-app-auth';
import constants from '../../utils/helpers/constants'
import axios from 'axios';
import isInternetConnected from '../../utils/helpers/NetInfo';
import Picker from '../../utils/helpers/Picker'
import { getDeviceToken } from '../../utils/helpers/FirebaseToken'
let status = ""

function Login(props) {

    if (status === "" || props.status !== status) {
        switch (props.status) {
            case USER_SIGNUP_REQUEST:
                status = props.status
                break;

            case USER_SIGNUP_SUCCESS:
                status = props.status
                break;

            case USER_SIGNUP_FAILURE:
                status = props.status;
                toast("Oops", props.error.message)
                break;

            case COUNTRY_CODE_REQUEST:
                status = props.status
                break;

            case COUNTRY_CODE_SUCCESS:
                status = props.status
                //console.log("COUNTRY", props.countryObject)
                //setLocation(props.countryObject[0].name)
                break;

            case COUNTRY_CODE_FAILURE:
                status = props.status
                break;
        }
    };

    useEffect(() => {
        isInternetConnected()
            .then(() => {
                props.countrycodeRequest()
                getDeviceToken()
                    .then((token) => {
                        setDeviceToken(token)
                        console.log(token)
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            })
            .catch(() => {
                toast('Check your Internet')
            })
    }, [])

    // const dispatch = useDispatch()

    // const [username, setUsername] = useState(props.route.params.loginType === 'Spotify' ?
    //     props.route.params.userDetails.display_name : props.route.params.userDetails.fullName.givenName);
    const [username, setUsername] = useState("");

    const [fullname, setFullname] = useState(props.route.params.loginType === 'Spotify' ?
        "" : `${props.route.params.userDetails.fullName.givenName} ${props.route.params.userDetails.fullName.familyName}`);

    const [phoneNumber, setPhoneNumber] = useState('');

    const [imageDetails, setImageDetails] = useState({});

    const [location, setLocation] = useState('Canada');

    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState("")


    const [userDetails, setUserDetails] = useState(props.route.params.userDetails);

    const [userNameAvailable, setUserNameAvailable] = useState(true);

    const [codePick, setCodePick] = useState('');
    const [deviceToken, setDeviceToken] = useState('');



    console.log("Location", location)


    //console.log('DETAILS' + JSON.stringify(userDetails))

    // IMAGE PICKER OPTIONS
    const showPickerOptions = () => {
        Alert.alert(
            "Choose Profile Image", "Select from where you want to choose the image",
            [
                { text: 'CAMERA', onPress: () => { pickImagewithCamera() } },
                { text: 'GALLERY', onPress: () => { pickImagefromGallery() } }
            ],
            { cancelable: true }
        )
    };


    // IMAGE PICKER FROM GALLERY
    const pickImagefromGallery = () => {

        
        
       ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            sortOrder: 'none',
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
        })
            .then((image) => {
                console.log(`IMAGE: ${JSON.stringify(image)}`)
                setImageDetails(image)
                setPicture(true)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    //IMAGE PICKER FROM CAMERA
    const pickImagewithCamera = () => {

        

        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 500,
            includeExif: true,
            mediaType: 'photo'
        })
            .then((image) => {
                setImageDetails(image)
                setPicture(true)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const register = () => {

        if (username === "") {
            alert("Please enter your username")
        }
        if (!userNameAvailable) {
            alert("Please enter a valid username")
        }
        else if (fullname === "") {
            alert("Please enter your name")
        }
        else if (phoneNumber === "") {
            alert("Please enter your phone number")
        }
        // else if (location === "") {
        //     alert("Please enter your location")
        // }
        else if (profilePic === "") {
            alert("Please upload your profile picture")
        }

        else {

            let profileImage = {
                name: imageDetails.filename === undefined || imageDetails.filename === null ? 'xyz.jpg' : imageDetails.filename,
                type: imageDetails.mime,
                uri: Platform.OS === "android" ? profilePic : profilePic.replace("file://", "")
            }

            let formdata = new FormData;

            formdata.append("full_name", fullname);

            formdata.append("profile_image", profileImage);

            formdata.append("username", username);
            formdata.append("phone", phoneNumber);

            formdata.append("location", location);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("social_username", userDetails.display_name) :
                formdata.append("social_username", userDetails.fullName.givenName);

            formdata.append("email", userDetails.email);

            formdata.append("deviceToken", deviceToken);

            formdata.append("deviceType", Platform.OS);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("social_id", userDetails.id) :
                formdata.append("social_id", userDetails.user);

            props.route.params.loginType === 'Spotify' ?
                formdata.append("register_type", 'spotify') :
                formdata.append("register_type", 'apple');

            console.log(formdata)
            props.signUpRequest(formdata);
        }
    }

    const check = async (username) => {
        await axios.post(constants.BASE_URL + '/user/available', { "username": username }, {
            headers: {
                Accept: "application/json",
                contenttype: "application/json",
            }
        })
            .then(res => {
                setUserNameAvailable(res.data.status === 200)

            })
            .catch(err => {
                setUserNameAvailable(false)
            })
    }


    //VIEW BEGINS
    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.black, }}
            behavior="height"
        >

            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={{ flex: 1, width: '90%', alignSelf: 'center' }}>

                <ScrollView style={{ height: '90%' }} showsVerticalScrollIndicator={false}>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        marginTop: normalise(25)
                    }}>
                        <TouchableOpacity style={{ left: normalise(-2), position: 'absolute' }}
                            onPress={() => { props.navigation.goBack() }}>
                            <Image source={ImagePath.backicon}
                                style={{ height: normalise(15), width: normalise(15) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <Text style={{
                            color: Colors.white,
                            fontSize: normalise(15),
                            fontFamily: 'ProximaNova-Black'
                        }}>CREATE PROFILE</Text>
                    </View>

                    <View style={{
                        height: normalise(120),
                        width: normalise(120),
                        borderRadius: normalise(60),
                        backgroundColor: Colors.fadeblack, alignSelf: 'center', marginTop: normalise(40),
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        {picture ?
                            <Image
                                source={{ uri: profilePic }}
                                style={{
                                    height: normalise(120),
                                    width: normalise(120),
                                    borderRadius: normalise(55)
                                }}
                                resizeMode='contain' />

                            : <TouchableOpacity onPress={() => { showPickerOptions() }}>
                                <Image source={ImagePath.add_white} style={{
                                    height: normalise(40), width: normalise(40),
                                    borderRadius: normalise(20)
                                }} />
                            </TouchableOpacity>
                        }
                    </View>

                    <TouchableOpacity style={{ marginTop: normalise(10) }}
                        onPress={() => { showPickerOptions() }}>
                        {picture ?
                            <Text style={{
                                color: Colors.white, fontSize: normalise(14),
                                alignSelf: 'center',
                                fontFamily: 'ProximaNova-Bold',
                                textDecorationLine: 'underline'
                            }}>
                                CHANGE PROFILE PIC
                            </Text>

                            : <Text style={{
                                color: Colors.white, fontSize: normalise(14),
                                alignSelf: 'center',
                                fontFamily: 'ProximaNova-Bold',
                                textDecorationLine: 'underline',

                            }}>
                                UPLOAD PROFILE PIC
                    </Text>}
                    </TouchableOpacity>

                    <TextInputField text={"CHOOSE USERNAME"}
                        placeholder={"Enter Username"}
                        placeholderTextColor={Colors.grey}
                        marginTop={normalise(30)}
                        tick_req={true}
                        value={username}
                        userNameAvailable={userNameAvailable}
                        tick_visible={username}
                        onChangeText={(text) => { setUsername(text), check(text) }}
                    />

                    <TextInputField text={"FULL NAME"}
                        placeholder={"Enter Name"}
                        placeholderTextColor={Colors.grey}
                        maxLength={25}
                        value={fullname}
                        onChangeText={(text) => { setFullname(text) }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                        <View>
                            <Picker
                                textColor={Colors.white}
                                textSize={normalize(9)}
                                emptySelectText="Select"
                                editable={true}
                                data={props.countryCodeRequest}
                                selectedValue={codePick == '' ? props.countryCodeRequest[0] : codePick}
                                onPickerItemSelected={(selectedvalue, index) => {
                                    //console.log(index)
                                    setLocation(props.countryObject[index].name)
                                    // console.log(props.countryObject[index].name)
                                    setCodePick(selectedvalue)
                                }}
                            //uniqueKey={"areaCode"}
                            />

                        </View>

                        <TextInputField
                            placeholder={"Enter Phone number"}
                            placeholderTextColor={Colors.grey}
                            width={normalize(200)}
                            maxLength={15}
                            isNumber={true}
                            value={phoneNumber}
                            onChangeText={(text) => { setPhoneNumber(text) }} />

                        <Text style={{
                            position: 'absolute',
                            fontSize: normalize(12),
                            top: 20,
                            color: Colors.white,
                            fontFamily: 'ProximaNova-Bold'
                        }}>PHONE NUMBER</Text>
                    </View>


                    {/* <TextInputField text={"ENTER LOCATION"}
                        placeholder={"Type Location"}
                        placeholderTextColor={Colors.grey}
                        value={location}
                        onChangeText={(text) => { setLocation(text) }} /> */}


                    {props.route.params.loginType === "Spotify" ?
                        <View style={{
                            marginTop: normalize(30), height: normalize(45), borderRadius: normalize(10),
                            borderWidth: normalise(1), borderColor: Colors.grey, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'center', padding: normalize(5)
                        }}>

                            <Image source={ImagePath.spotifyicon}
                                style={{ height: normalise(22), width: normalise(22), position: 'absolute', left: 20 }}
                                resizeMode="contain" />

                            <Text style={{
                                color: Colors.white,
                                fontSize: normalise(12),
                                fontFamily: 'ProximaNova-Semibold',
                            }}>
                                {`Spotify Username: ${userDetails.display_name}`}
                            </Text>
                        </View> : null}


                    <Button title={"COMPLETE PROFILE"}
                        marginTop={normalise(40)}
                        marginBottom={normalise(40)}
                        fontSize={normalise(15)}
                        onPress={() => { register() }} />


                </ScrollView>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        signupResponse: state.UserReducer.signupResponse,
        error: state.UserReducer.error,
        countryCodeRequest: state.UserReducer.countryCodeRequest,
        countryObject: state.UserReducer.countryCodeOject
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUpRequest: (payload) => {
            dispatch(signupRequest(payload))
        },
        countrycodeRequest: () => {
            dispatch(getCountryCodeRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)