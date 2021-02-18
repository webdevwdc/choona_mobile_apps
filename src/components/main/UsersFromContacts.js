import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import ActivityListItem from '../../components/main/ListCells/ActivityListItem';
import StatusBar from '../../utils/MyStatusBar';
import {
    USER_FOLLOW_UNFOLLOW_REQUEST, USER_FOLLOW_UNFOLLOW_SUCCESS, USER_FOLLOW_UNFOLLOW_FAILURE,
    GET_USERS_FROM_CONTACTS_REQUEST, GET_USERS_FROM_CONTACTS_SUCCESS, GET_USERS_FROM_CONTACTS_FAILURE
}
    from '../../action/TypeConstants';
import { userFollowUnfollowRequest, getUsersFromContacts } from '../../action/UserAction';
import Loader from '../../widgets/AuthLoader';
import constants from '../../utils/helpers/constants';
import toast from '../../utils/helpers/ShowErrorAlert';
import isInternetConnected from '../../utils/helpers/NetInfo';
import { connect } from 'react-redux'
import _ from 'lodash'

let status;

function UsersFromContacts(props) {

    const [search, setSearch] = useState("");
    const [bool, setBool] = useState(false);
    const [numberArray, setNumberArray] = useState(props.route.params.data);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        isInternetConnected()
            .then(() => {
                props.getUsersFromContacts({ phone: numberArray })
            })
            .catch(() => {
                toast('Error', "Please Connect To Internet")
            })
    }, []);


    if (status === "" || props.status !== status) {
        switch (props.status) {

            case GET_USERS_FROM_CONTACTS_REQUEST:
                status = props.status
                break;

            case GET_USERS_FROM_CONTACTS_SUCCESS:
                setUsersList(props.usersFromContacts)
                status = props.status
                break;

            case GET_USERS_FROM_CONTACTS_FAILURE:
                status = props.status
                toast('Oops, Something Went Wrong, Please Try Again')
                break;

            case USER_FOLLOW_UNFOLLOW_REQUEST:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_SUCCESS:
                status = props.status
                break;

            case USER_FOLLOW_UNFOLLOW_FAILURE:
                status = props.status
                break;

        }
    };


    function filterArray(keyword) {

        let data = _.filter(props.usersFromContacts, (item) => {
            return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });
        console.log(data);
        setUsersList([])
        setBool(true);
        setTimeout(() => {
            setUsersList(data);
            setBool(false);
        }, 800);
    };


    function renderUserItem(data) {

        if (props.userProfileResp._id === data.item._id) {

            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={false}
                    image2={'123'}
                    marginBottom={data.index === props.usersFromContacts.length - 1 ? normalise(20) : 0}
                // onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                />
            )
        } else {

            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={true}
                    follow={!data.item.isFollowing}
                    TouchableOpacityDisabled={false}
                    marginBottom={data.index === props.usersFromContacts.length - 1 ? normalise(20) : 0}
                    onPressImage={() => {
                        props.navigation.navigate("OthersProfile",
                            { id: data.item._id, following: data.item.isFollowing })
                    }}
                    onPress={() => { props.followReq({ follower_id: data.item._id }) }}
                />
            )
        }
    };


    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />

            <Loader visible={props.status === GET_USERS_FROM_CONTACTS_REQUEST} />
            <Loader visible={bool} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1 }}>

                    <HeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon} title={`USERS`}
                        thirditemtext={true} texttwo={""}
                        onPressFirstItem={() => { props.navigation.goBack() }} />


                    <View style={{
                        width: '92%',
                        alignSelf: 'center',
                    }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30),
                        }} value={search}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => {
                                setSearch(text), filterArray(text)
                            }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => {
                                setSearch(""), filterArray("")
                            }}
                                style={{
                                    position: 'absolute', right: 0,
                                    bottom: Platform.OS === 'ios' ? normalise(26) : normalise(25),
                                    paddingRight: normalise(10)
                                }}>
                                <Text style={{
                                    color: Colors.white, fontSize: normalise(10), fontWeight: 'bold',
                                }}>CLEAR</Text>

                            </TouchableOpacity>}

                    </View>


                    {_.isEmpty(usersList) ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{
                                color: Colors.white, fontSize: normalise(12), marginLeft: normalise(10),
                                fontFamily: 'ProximaNova-Semibold', fontWeight: 'bold',
                            }}>NO USERS FOUND</Text>

                        </View>

                        :

                        <FlatList
                            data={usersList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => { index.toString() }}
                            renderItem={renderUserItem} />
                    }


                </SafeAreaView>

            </TouchableWithoutFeedback>
        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp,
        usersFromContacts: state.UserReducer.getUsersFromContact
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        },

        getUsersFromContacts: (payload) => {
            dispatch(getUsersFromContacts(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersFromContacts)