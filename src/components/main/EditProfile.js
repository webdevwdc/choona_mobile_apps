import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    Alert
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
import HeaderComponent from '../../widgets/HeaderComponent';
import StatusBar from '../../utils/MyStatusBar';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';
import constants from '../../utils/helpers/constants';
import {
    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,

    COUNTRY_CODE_REQUEST,
    COUNTRY_CODE_SUCCESS,
    COUNTRY_CODE_FAILURE

} from '../../action/TypeConstants';
import { editProfileRequest, getCountryCodeRequest } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import axios from 'axios';
import Picker from '../../utils/helpers/Picker'
let status = "";


function EditProfile(props) {

    const [username, setUsername] = useState(props.userProfileResp.username);
    const [fullname, setFullname] = useState(props.userProfileResp.full_name);
    const [phoneNumber, setPhoneNumber] = useState(props.userProfileResp.phone);
    const [location, setLocation] = useState(props.userProfileResp.location);
    const [picture, setPicture] = useState(false);
    const [profilePic, setProfilePic] = useState(constants.profile_picture_base_url + props.userProfileResp.profile_image)
    const [imageDetails, setImageDetails] = useState("");
    const [userNameAvailable, setUserNameAvailable] = useState(true);
    const [codePick, setCodePick] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCountry();
    }, []);


    const getCountry = () => {
        props.countryObject.map((item, index) => {
            if (item.name === location) {
                setCodePick(item.flag + item.dial_code);
                console.log(item.flag + item.dial_code);
                setLoading(false);
            }
        });
    };


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case EDIT_PROFILE_REQUEST:
                status = props.status
                break;

            case EDIT_PROFILE_SUCCESS:
                toast("Oops", "Profile updated successfully.")
                //props.navigation.goBack()
                status = props.status
                break;

            case EDIT_PROFILE_FAILURE:
                status = props.status
                toast("Oops", props.error.message)
                break;
        }
    };



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
                setPicture(true)
                setImageDetails(image)
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
                setPicture(true)
                setImageDetails(image)
                setProfilePic(image.path)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const updateProfile = () => {

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
        else if (location === "") {
            alert("Please enter your location")
        }
        else if (profilePic === "") {
            alert("Please upload your profile picture")
        } else {
            let formdata = new FormData;

            if (picture) {

                let uploadPicture = {
                    name: imageDetails.filename === undefined || imageDetails.filename === null ? 'xyz.jpg' : imageDetails.filename,
                    type: imageDetails.mime,
                    uri: profilePic
                };

                formdata.append("profile_image", uploadPicture);
                formdata.append("full_name", fullname);
                formdata.append("location", location);
                formdata.append("username", username);
                formdata.append("phone", phoneNumber);



                isInternetConnected()
                    .then(() => {
                        props.editProfileReq(formdata)
                    })
                    .catch((err) => {
                        toast("Oops", "Please Connect To Internet")
                    })


            } else {


                formdata.append("full_name", fullname);
                formdata.append("location", location);
                formdata.append("username", username);
                formdata.append("phone", phoneNumber);

                isInternetConnected()
                    .then(() => {
                        props.editProfileReq(formdata)
                    })
                    .catch((err) => {
                        toast("Oops", "Please Connect To Internet")
                    })
            }
        }

    };

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

            <StatusBar />

            <Loader visible={props.status === EDIT_PROFILE_REQUEST} />

            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <HeaderComponent
                        firstitemtext={false}
                        imageone={ImagePath.backicon}
                        title={"EDIT PROFILE"}
                        thirditemtext={true}
                        texttwo={"SAVE"}
                        onPressFirstItem={() => { props.navigation.goBack() }}
                        onPressThirdItem={() => { updateProfile() }}
                    />


                    <View style={{
                        height: normalise(120), width: normalise(120), borderRadius: normalise(60),
                        backgroundColor: Colors.fadeblack, alignSelf: 'center', marginTop: normalise(40),
                        justifyContent: 'center', alignItems: 'center'
                    }}>

                        <Image
                            source={{ uri: profilePic }}
                            style={{
                                height: normalise(120), width: normalise(120),
                                borderRadius: normalise(60)
                            }}
                            resizeMode='contain' />



                    </View>

                    <TouchableOpacity style={{ marginTop: normalise(10) }} onPress={() => { showPickerOptions() }}>

                        <Text style={{
                            color: Colors.white, fontSize: normalise(12),
                            alignSelf: 'center', fontWeight: 'bold', textDecorationLine: 'underline'
                        }}>
                            CHANGE PROFILE PIC
                    </Text>

                    </TouchableOpacity>


                    <View style={{ width: '90%', alignSelf: 'center', marginBottom: normalise(30) }}>

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
                            maxLength={25}
                            value={fullname}
                            placeholderTextColor={Colors.grey}
                            onChangeText={(text) => { setFullname(text) }}
                            borderColor={fullname === "" ? Colors.grey : Colors.white}
                            marginTop={normalise(20)} />


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            {loading ? null :
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
                                    />
                                </View>}

                            <TextInputField
                                placeholder={"Enter Phone number"}
                                placeholderTextColor={Colors.grey}
                                maxLength={15}
                                width={normalize(200)}
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
                            value={location}
                            placeholderTextColor={Colors.grey}
                            onChangeText={(text) => { setLocation(text) }}
                            borderColor={location === "" ? Colors.grey : Colors.white} /> */}

                    </View>
                </ScrollView>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp,
        error: state.UserReducer.error,
        countryCodeRequest: state.UserReducer.countryCodeRequest,
        countryObject: state.UserReducer.countryCodeOject
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editProfileReq: (payload) => {
            dispatch(editProfileRequest(payload))
        },
        countrycodeRequest: () => {
            dispatch(getCountryCodeRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);