import React, { useEffect, Fragment, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
  Platform,
  Alert
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import ImagePath from '../../assests/ImagePath';
import Colors from '../../assests/Colors';
import MyStatusBar from '../../utils/MyStatusBar';
import { loginWithSpotify, getSpotifyToken } from '../../utils/helpers/SpotifyLogin'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE
} from '../../action/TypeConstants'
import { loginRequest } from '../../action/UserAction'
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux';
import _ from 'lodash'
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { getDeviceToken } from '../../utils/helpers/FirebaseToken'

let user = null;
let status = "";

function SignUp(props) {

  const [userDetails, setUserDetails] = useState({});
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  const [loginType, setLoginType] = useState("");

  useEffect(() => {
    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
    return () => { };
  }, []);


  function spotifyLogin() {

    loginWithSpotify().then((value) => {

      if (!_.isEmpty(value)) {

        setUserDetails(value)

        getDeviceToken()
          .then((token) => {

            let payload = {
              social_id: value.id,
              social_type: 'spotify',
              deviceToken: token,
              deviceType: Platform.OS
            }

            props.loginRequest(payload);

          })
          .catch((err) => {

            let payload = {
              social_id: value.id,
              social_type: 'spotify',
              deviceToken: '',
              deviceType: Platform.OS
            }

            props.loginRequest(payload);

          })

      }

    }).catch((error) => { console.log(error) })

  };


  //ON APLLE BUTTON PRESS
  async function onAppleButtonPress(updateCredentialStateForUser) {
    setLoginType("Apple")
    console.warn('Beginning Apple Authentication');
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;

      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );

      if (identityToken) {
        appleLoginWithOurServer(appleAuthRequestResponse)
        console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };


  //FETCH AND UPDATE CRED STATE
  async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
      updateCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED');
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  };

  //TOKEN FIREBASE
  function appleLoginWithOurServer(appleData) {

    getDeviceToken()
      .then((token) => {
        signInwithApple(appleData, token);
      })
      .catch((err) => {
        signInwithApple(appleData, "");
      })

  };


  // API REQUEST
  function signInwithApple(appleData, token) {

    // isInternetConnected().then(() => {

    var appleSignUpObject = {}

    appleSignUpObject.social_id = ("user" in appleData) ? appleData.user : "";
    appleSignUpObject.social_type = "apple";
    appleSignUpObject.deviceType = Platform.OS;
    appleSignUpObject.deviceToken = token;

    console.log("Apple ", appleData)
    props.loginRequest(appleSignUpObject);
    setUserDetails(appleData)

    // }).catch(() => {
    //   console.log('Error', 'Please connect to internet')
    // });

  };
  //APPLE SIGN IN END



  if (status === "" || props.status !== status) {
    switch (props.status) {

      case USER_LOGIN_REQUEST:
        status = props.status
        break;

      case USER_LOGIN_SUCCESS:
        status = props.status
        break;

      case USER_LOGIN_FAILURE:
        status = props.status

        if (props.error.status === 201) {
          props.navigation.navigate("SignUp", { userDetails: userDetails, loginType: loginType })
        } else {
          alert(props.error.message)
        }

        break;
    }
  };

  console.log(loginType);
  //VIEW
  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>

      {Platform.OS === 'android' ? <MyStatusBar /> : <StatusBar barStyle={'light-content'} />}

      <View style={{ height: '50%' }}>
        <Image
          source={ImagePath.albumsPic}

          style={{ height: '90%', width: '100%', alignItems: "center", justifyContent: 'center', }}
        />

        <Image source={ImagePath.applogo}
          style={{ height: normalise(60), width: '60%', alignSelf: 'center', }}
          resizeMode='contain' />
      </View>


      <View style={{
        height: Platform.OS === 'android' ? '45%' : '50%', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-end'
      }}>

        <TouchableOpacity style={{
          height: normalise(50), width: '80%', alignSelf: 'center',
          borderRadius: normalise(25),
          backgroundColor: Colors.darkerblack,
          borderWidth: normalise(0.5),
          borderColor: Colors.grey,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5, },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 11,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={() => {
          spotifyLogin(), setLoginType('Spotify')
        }}  >

          <Image source={ImagePath.spotifyicon}
            style={{ height: normalise(22), width: normalise(22) }}
            resizeMode='contain' />

          <Text style={{
            marginLeft: normalise(10),
            color: Colors.white,
            fontSize: normalise(12),
            fontFamily: 'ProximaNova-Extrabld',
          }}>LOGIN WITH SPOTIFY</Text>

        </TouchableOpacity>


        {/* <TouchableOpacity style={{
                    marginBottom: normalise(40),
                    marginTop: normalise(20), height: normalise(50), width: '80%', alignSelf: 'center',
                    borderRadius: normalise(25), backgroundColor: Colors.white, borderWidth: normalise(0.5),
                    shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.36,
                    shadowRadius: 6.68, elevation: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }} onPress={() => { props.navigation.navigate("SignUp") }}   >

                    <Image source={ImagePath.applemusic}
                        style={{ height: normalise(25), width: normalise(25) }}
                        resizeMode='contain' />

                    <Text style={{
                        marginLeft: normalise(10),
                        color: Colors.black,
                        fontSize: normalise(12),
                        fontFamily: 'ProximaNova-Extrabld',
                    }}>LOGIN WITH APPLE MUSIC</Text>

                </TouchableOpacity> */}

        {Platform.OS === 'ios' ?
          <AppleButton
            style={{
              marginTop: normalise(10),
              marginBottom: normalise(20),
              width: '80%',
              height: normalize(48),
            }}
            cornerRadius={100}
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => onAppleButtonPress(updateCredentialStateForUser)}
          /> : null}

      </View>

    </View>
  )
}


const mapStateToProps = (state) => {
  return {

    status: state.UserReducer.status,
    error: state.UserReducer.error,
    loginResponse: state.UserReducer.loginResponse,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (payload) => {
      dispatch(loginRequest(payload))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);