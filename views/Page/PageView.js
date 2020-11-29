import React, {useRef, useState} from 'react';
import {Dimensions, PanResponder, View, StyleSheet, Animated} from 'react-native';
import GestureRecorder from "./GestureRecorder";

export default class PageView extends React.Component {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green'}}>
                <GestureRecorder/>
            </View>
        );
    }
}

