import React, { useEffect, Fragment, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image, Modal,
    Text, TextInput,
    StatusBar, Platform,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import normalise from '../../utils/helpers/Dimens';
import Colors from '../../assests/Colors';
import ActivityListItem from './ListCells/ActivityListItem';
import ImagePath from '../../assests/ImagePath';
import HomeHeaderComponent from '../../widgets/HomeHeaderComponent';
import nexHeader from '../../widgets/HomeHeaderComponent'
import _ from 'lodash';
import constants from '../../utils/helpers/constants';
import { connect } from 'react-redux'
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { reactionOnPostRequest, userFollowUnfollowRequest } from '../../action/UserAction';
import isInternetConnected from '../../utils/helpers/NetInfo';
import toast from '../../utils/helpers/ShowErrorAlert';

const react = ["🔥", "😍", "💃", "🕺", "🤤", "👍"];


function HomeItemReaction(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalReact, setModalReact] = useState("");
    const [search, setSearch] = useState("")
    const [postId, setPostId] = useState(props.route.params.post_id)
    const [reactionList, setReactionList] = useState(editArray(props.route.params.reactions))

    let userId = props.userProfileResp._id;

    function editArray(array) {

        var editedList = []

        array.map((item, index) => {
            let reactionObject = {}

            reactionObject['header'] = item.text;
            reactionObject.data = _.filter(array, { text: item.text });

            editedList.push(reactionObject);

            editedList = Array.from(new Set(editedList.map(JSON.stringify))).map(JSON.parse);
        })

        return editedList

    }

    function getFilteredData(keyword) {

        let filterdData = _.filter(props.route.params.reactions, function (item) {
            return item.username.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        })

        setReactionList(editArray(filterdData))

    }

    function addOrChangeReaction(reaction) {
        let reactions = props.route.params.reactions;

        console.log("REACTIONS: " + JSON.stringify(reactions))

        let index = _.findIndex(reactions, function (item) { return item.user_id == userId && item.text == reaction; })

        if (index != -1) {
            reactions.splice(index, 1);
            setReactionList(editArray(reactions))
        } else {
            reactions.push({
                "user_id": userId,
                "text": reaction,
                "profile_image": props.userProfileResp.profile_image,
                "username": props.userProfileResp.username
            })
            setReactionList(editArray(reactions))
        }

    };

    const reactionOnPost = (reaction, id) => {

        const myReaction = reaction == react[0] ? "A" : reaction == react[1] ? "B" : reaction == react[2] ? "C" :
            reaction == react[3] ? "D" : reaction == react[4] ? 'E' : "F";

        let reactionObject = {
            post_id: id,
            text: reaction,
            text_match: myReaction
        };
        isInternetConnected()
            .then(() => {
                props.reactionOnPostRequest(reactionObject)
            })
            .catch(() => {
                toast('Error', 'Please Connect To Internet')
            })
    }


    function hitreact(x) {

        if (!_.isEmpty(reactionList)) {
            console.log('here' + JSON.stringify(reactionList));

            const present = reactionList.some(obj =>  obj.header.includes(x) && obj.data.some(obj1 => obj1.user_id === userId))

            if (present) {
                console.log('nooo');
                addOrChangeReaction(x)
                reactionOnPost(x, postId)
            }
            else {
                addOrChangeReaction(x)
                reactionOnPost(x, postId)
                setModalVisible(true)
                setModalReact(x)
                setTimeout(() => {
                    setModalVisible(false)
                }, 2000);
            }

        }
        else {
            addOrChangeReaction(x)
            reactionOnPost(x, postId)
            setModalVisible(true)
            setModalReact(x)
            setTimeout(() => {
                setModalVisible(false)
            }, 2000);
        }
    }

    function hitreact1() {

        if (modal1Visible == true) {
            setModal1Visible(false)
        }
        else {
            setModal1Visible(true)
        }


        //  setModalReact(x)

    }

    function renderItem(data) {
        console.log(data)
        if (props.userProfileResp._id === data.item.user_id) {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    type={false}
                    image2={"123"}
                    //  bottom={data.index === reaction1.length - 1 ? true : false} 
                    // marginBottom={data.index === reaction1.length - 1 ? normalise(10) : normalise(0)}
                    //onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                    marginBottom={data.index == reactionList.length - 1 ? normalise(40) : 0}
                    onPressImage={() => { props.navigation.navigate("Profile", { fromAct: false }) }}
                    TouchableOpacityDisabled={false}
                />
            )
        } else {
            return (
                <ActivityListItem
                    image={constants.profile_picture_base_url + data.item.profile_image}
                    title={data.item.username}
                    follow={!data.item.isFollowing}
                    //  bottom={data.index === reaction1.length - 1 ? true : false} 
                    // marginBottom={data.index === reaction1.length - 1 ? normalise(10) : normalise(0)}
                    //onPressImage={() => { props.navigation.navigate("OthersProfile") }}
                    marginBottom={data.index == reactionList.length - 1 ? normalise(40) : 0}
                    onPress={() => { props.followReq({ follower_id: data.item.user_id }) }}
                    onPressImage={() => { props.navigation.navigate('OthersProfile', { id: data.item.user_id }) }}
                    TouchableOpacityDisabled={false}
                />
            )
        }
    };

    function renderItemWithHeader(data) {

        return (
            <View style={{ marginBottom: data.index === reactionList.length - 1 ? normalise(120) : normalise(0) }}>
                <View style={{
                    marginTop: normalise(10),
                    width: '100%',
                    height: normalise(42),
                    justifyContent: 'center',
                    backgroundColor: Colors.fadeblack
                }}>

                    <Text style={{
                        color: Colors.white,
                        fontSize: normalise(30), marginLeft: normalise(5),
                        fontWeight: 'bold'
                    }}> {data.item.header}</Text>
                </View>

                <FlatList
                    data={data.item.data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => { index.toString() }}
                    listKey={(item, index) => { item.toString() }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.black }}>

            <StatusBar barStyle={'light-content'} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>

                <SafeAreaView style={{ flex: 1 }}>


                    <HomeHeaderComponent firstitemtext={false}
                        imageone={ImagePath.backicon}
                        //imagesecond={ImagePath.dp}
                        marginTop={Platform.OS === 'android' ? normalise(30) : normalise(0)}
                        title={` ${props.route.params.reactions.length} REACTIONS`}
                        thirditemtext={false}
                        // imagetwo={ImagePath.newmessage} 
                        imagetwoheight={25}
                        imagetwowidth={25}
                        onPressFirstItem={() => { props.navigation.goBack() }} />

                    <View style={{ width: '92%', alignSelf: 'center', }}>

                        <TextInput style={{
                            height: normalise(35), width: '100%', backgroundColor: Colors.fadeblack,
                            borderRadius: normalise(8), marginTop: normalise(20), padding: normalise(10),
                            color: Colors.white, paddingLeft: normalise(30)
                        }}
                            placeholder={"Search"}
                            placeholderTextColor={Colors.grey_text}
                            value={search}
                            onChangeText={(text) => {
                                setSearch(text),
                                    getFilteredData(text)
                            }} />

                        <Image source={ImagePath.searchicongrey}
                            style={{
                                height: normalise(15), width: normalise(15), bottom: normalise(25),
                                paddingLeft: normalise(30)
                            }} resizeMode="contain" />

                        {search === "" ? null :
                            <TouchableOpacity onPress={() => {
                                setSearch(""),
                                    getFilteredData("")
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

                    {reactionList.length > 0 ? <FlatList
                        data={reactionList}
                        renderItem={renderItemWithHeader}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsVerticalScrollIndicator={false}
                    /> : <View style={{ marginTop: normalise(100), marginHorizontal: normalise(50), alignItems: 'center' }} >
                            <Image source={ImagePath.blankreactionbg}
                                style={{ height: normalise(225), width: normalise(225) }}
                                resizeMode='contain' />
                            <Text style={{ fontSize: normalise(12), color: Colors.white }}>
                                No results found, please try again later.
                    </Text>
                            {/* <Text style={{ fontSize: normalise(12), color: Colors.white }}>another name</Text> */}
                        </View>}

                    <View style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: normalise(30),
                        height: normalise(60),
                        width: '92%',
                        justifyContent: 'space-between',
                        borderRadius: normalise(35),
                        backgroundColor: Colors.white,
                        borderWidth: normalise(0.5),
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 5, },
                        shadowOpacity: 0.36,
                        shadowRadius: 6.68, elevation: 11,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: Colors.grey,
                        paddingHorizontal: normalise(10)
                    }}>

                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[0]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[0]}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[1]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[1]}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[2]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[2]}</Text>

                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[3]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[3]}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[4]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[4]}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                hitreact(react[5]);
                            }}
                        >
                            <Text style={{ fontSize: normalise(30), fontWeight: 'bold' }}>{react[5]}</Text>

                        </TouchableOpacity>

                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={styles.centeredView}>

                            <Text style={{ fontSize: Platform.OS === 'android' ? normalise(70) : normalise(100) }}>{modalReact}</Text>


                        </View>

                    </Modal>

                    {modal1Visible == true ?

                        <View style={{
                            position: 'absolute',
                            margin: 20,
                            height: normalise(280),
                            width: "92%",
                            alignSelf: 'center',
                            marginHorizontal: normalise(15),
                            backgroundColor: Colors.white,
                            borderRadius: 20,
                            padding: 35,
                            bottom: 110,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5
                        }}>


                            <EmojiSelector
                                category={Categories.history}
                                showHistory={true}
                                onEmojiSelected={emoji => {
                                    setModalVisible(true), setModalReact(emoji),
                                        setTimeout(() => {
                                            setModalVisible(false)
                                        }, 2000)
                                }}
                            />


                        </View>

                        : null}
                </SafeAreaView>

            </TouchableWithoutFeedback>

        </View>
    )
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.8,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        height: normalise(200),
        width: normalise(280),
        backgroundColor: Colors.fadeblack,
        borderRadius: 20,
        padding: 35,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
    }
});

const mapStateToProps = (state) => {
    return {
        status: state.UserReducer.status,
        userProfileResp: state.UserReducer.userProfileResp
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        reactionOnPostRequest: (payload) => {
            dispatch(reactionOnPostRequest(payload))
        },

        followReq: (payload) => {
            dispatch(userFollowUnfollowRequest(payload))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeItemReaction);
