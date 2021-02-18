import React from "react"
import { Platform } from "react-native"

import messaging from '@react-native-firebase/messaging';


import AsyncStorage from '@react-native-community/async-storage';

const DUMMY_TOKEN = ""
var deviceToken = "deviceToken"

// export const getToken = () => {
//     return new Promise((resolve, reject) => {
//         AsyncStorage.getItem(deviceToken)
//             .then((value) => {
//                 if (value)
//                     resolve(value)
//                 else
//                     resolve(DUMMY_TOKEN)
//             }).catch((error) => {
//                 alert(error)
//                 reject("Token could not be generated")
//             })
//     })
// }

export const getDeviceToken = () => {
    return new Promise((resolve, reject) => {

        if (Platform.OS === 'ios') {

            messaging().requestPermission().then(() =>{
                console.log("TOKEN TOKEN")
                messaging().getAPNSToken()
                .then((value) => {
                    console.log("TOKEN: ",value)
                    if (value) {
                        //alert("Token:\n"+value)
                        AsyncStorage.setItem(deviceToken, value)
                        resolve(value)
                    } else {
                        AsyncStorage.getItem(deviceToken)
                            .then((value) => {
                                if (value)
                                    resolve(value)
                                else
                                    resolve(DUMMY_TOKEN)
                            }).catch((error) => {
                                //alert(error)
                                reject("Token could not be generated")
                            })
                    }
                }).catch(() => {
                    AsyncStorage.getItem(deviceToken)
                        .then((value) => {
                            if (value)
                                resolve(value)
                            else
                                resolve(DUMMY_TOKEN)
                        }).catch((error2) => {
                            //alert(error2)
                            reject("Token could not be generated")
                        })

                })
            }).catch((error) =>{
                alert(error)
                reject(error)
            })
            
        } else {

            let fcmToken = messaging().getToken()
                .then((value) => {
                    if (value) {
                        //console.log(value)
                        AsyncStorage.setItem(deviceToken, value)
                        resolve(value)
                    } else {
                        AsyncStorage.getItem(deviceToken)
                            .then((value) => {
                                if (value){
                                //console.log(value)
                                    resolve(value)
                                }
                                else
                                    resolve(DUMMY_TOKEN)
                            }).catch((error) => {
                                //console.log(error)
                                reject("Token could not be generated")
                            })
                    }
                })
                .catch((error) => {
                    //console.log(error)
                    AsyncStorage.getItem(deviceToken)
                        .then((value) => {
                            if (value)
                                resolve(value)
                            else
                                resolve(DUMMY_TOKEN)
                        }).catch((error) => {
                            //console.log(error)
                            reject("Token could not be generated")
                        })
                })
         }
    })
}