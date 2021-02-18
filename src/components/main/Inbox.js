
import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Image,
    ImageBackground,
    TextInput,
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ImagePath from '../../assests/ImagePath';
import HeaderComponent from '../../widgets/HeaderComponent';
import InboxListItem from '../../components/main/ListCells/InboxItemList';
import StatusBar from '../../utils/MyStatusBar';
import database from '@react-native-firebase/database';
import moment from "moment";
import { connect } from 'react-redux';
import {
    GET_CHAT_LIST_REQUEST, GET_CHAT_LIST_SUCCESS,
    GET_CHAT_LIST_FAILURE,
    DELETE_CONVERSATION_REQUEST,
    DELETE_CONVERSATION_SUCCESS,
    DELETE_CONVERSATION_FAILURE
} from '../../action/TypeConstants';
import { getChatListRequest, deleteConversationRequest } from '../../action/MessageAction';
import constants from '../../utils/helpers/constants';
import Loader from '../../widgets/AuthLoader';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';
import _ from 'lodash';


let status;

function Inbox(props) {


    const [search, setSearch] = useState("");
    const [mesageList, setMessageList] = useState("");
    const [bool, setBool] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', (payload) => {
            isInternetConnected()
                .then(() => {
                    props.getChatListReq();
                })
                .catch((err) => {
                    toast('Error', 'Please Connect To Internet')
                });

            return () => {
                unsuscribe();
            }
        })
    });

    if (props.status === "" || props.status !== status) {
        switch (props.status) {

            case GET_CHAT_LIST_REQUEST:
                status = props.status
                break;

            case GET_CHAT_LIST_SUCCESS:
                status = props.status;
                sortArray(props.chatList)
                break;

            case GET_CHAT_LIST_FAILURE:
                status = props.status
                toast('Error', 'Something Went Wrong, Please Try Again');
                break;

            case DELETE_CONVERSATION_REQUEST:
                status = props.status
                break;

            case DELETE_CONVERSATION_SUCCESS:
                status = props.status;

                isInternetConnected()
                    .then(() => {
                        props.getChatListReq();
                    })
                    .catch((err) => {
                        toast('Error', 'Please Connect To Internet')
                    });
                break;

            case DELETE_CONVERSATION_FAILURE:
                status = props.status
                toast('Error', 'Something Went Wrong, Please Try Again');
                break;
        }
    };

    function sortArray(value) {

        const res = value.sort((a, b) => {
            // console.log('yooo' + new Date(Object.values(a)[0].time))
            return new Date(Object.values(b)[0].time) - new Date(Object.values(a)[0].time)
        });
        // console.log('Sort' + JSON.stringify(res));
        setMessageList(res);

    };

    function filterArray(keyword) {

        let data = _.filter(props.chatList, (item) => {
            return item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
                item.full_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });

        console.log(data);
        setMessageList([]);
        setBool(true);
        setTimeout(() => {
            setMessageList(data);
            setBool(false);
        }, 800);
    };

    function renderInboxItem(data) {
        console.log("message: " + data.item.message.length)

        return (
            <InboxListItem
                image={constants.profile_picture_base_url + data.item.profile_image}
                title={data.item.username}
                description={data.item.message[data.item.message.length - 1].text}
                read={data.item.user_id == data.item.receiver_id
                    ? true : data.item.read}
                onPress={() => props.navigation.navigate('InsideaMessage', { index: data.index })}
                marginBottom={data.index === props.chatList.length - 1 ? normalise(20) : 0}
                onPressImage={() => {
                    props.navigation.navigate('OthersProfile', { id: data.item.user_id })
                }}
                onPressDelete={() => Alert.alert('Do you want to delete this conversation?', '', [
                    { text: 'No', },

                    {
                        text: 'Delete',
                        onPress: () => {
                            props.deleteConversationRequest({"chat_token":data.item.chat_token});
                        },
                        style: 'destructive'
                    }
                ])}
            />
        )
    }


    function hideKeyboard() {

        if (typingTimeout) {
            clearInterval(typingTimeout)
        }
        setTypingTimeout(setTimeout(() => {
            Keyboard.dismiss();
        }, 1500))

    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar />
            <Loader visible={props.status === GET_CHAT_LIST_REQUEST} />
            <Loader visible={bool} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1, }}>

                    <HeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon}
                        title={`INBOX`}
                        thirditemtext={false}
                        imagetwo={ImagePath.newmessage}
                        imagetwoheight={25}
                        imagetwowidth={25}
                        onPressFirstItem={() => { props.navigation.goBack() }}
                        onPressThirdItem={() => {
                            props.navigation.navigate('AddSongsInMessage')
                        }}
                    />

                    <View style={{
                        width: '92%',
                        alignSelf: 'center',
                    }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30), paddingRight: normalise(50)
                        }} value={search}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.darkgrey}
                            onChangeText={(text) => { setSearch(text), filterArray(text) }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => { setSearch(""), filterArray("") }}
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

                    {_.isEmpty(props.chatList) ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.white, fontSize: normalise(15) }}>No Messages</Text>
                        </View>

                        : <FlatList
                            data={mesageList}
                            renderItem={renderInboxItem}
                            keyExtractor={(item, index) => { index.toString() }}
                            showsVerticalScrollIndicator={false} />}




                </SafeAreaView>

            </TouchableWithoutFeedback>

        </View>
    )
};

const mapStateToProps = (state) => {
    return {
        status: state.MessageReducer.status,
        chatList: state.MessageReducer.chatList,
        error: state.MessageReducer.error,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getChatListReq: () => {
            dispatch(getChatListRequest())
        },
        deleteConversationRequest: (payload) => {
            dispatch(deleteConversationRequest(payload))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);