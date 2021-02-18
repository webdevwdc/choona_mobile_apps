import React, { useState, useEffect } from 'react';
import Sound from 'react-native-sound';



export default function MusicPlayer(trackUri, autoplay) {

    return new Promise((resolve, reject) => {

        Sound.setCategory('Playback', false);
        let track

        track = new Sound(trackUri, "", (err) => {

            if (err) {
                reject(err);
            }
            else {

                global.playerReference = track;

                if (autoplay) {
                    track.play((success) => {
                        if (success) {
                            console.log('PlayBack End')
                        }
                        else {
                            console.log('NOOOOOOOO')
                        }
                    });
                }

                setTimeout(() => {
                    resolve(track)
                }, 200)

            };
        });
    })
};

