import React, {useRef} from "react";
import {View, PanResponder, StyleSheet, Animated} from "react-native";
import GesturePath from "./GesturePath";

export default class GestureRecorder extends React.Component {

    constructor(props) {
        super(props)
        this.gesturePath = React.createRef()
        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event, gestureState) => {
                console.log("Grant")
                console.log(event)
                const tmpPaths = this.gesturePath.current.state.paths
                tmpPaths.push([])
                this.setGesturePaths(tmpPaths)
            },
            onPanResponderMove: (event, gestureState) => {
                console.log("Move")
                let tmpPaths = this.gesturePath.current.state.paths
                tmpPaths[tmpPaths.length - 1].push({
                    x: event.nativeEvent.locationX,
                    y: event.nativeEvent.locationY
                })
                this.setGesturePaths(tmpPaths)
            },
            onPanResponderRelease: (event, gestureState) => {
                console.log("Release")
                // this.setGesturePaths(event, gestureState)
            }
        })
        this.state = {
            panResponder: panResponder,
        }
    }

    setGesturePaths(paths) {
        this.gesturePath.current.setState((prevState) => ({
            ...prevState,
            paths: paths
        }))
    }

    render() {
        return (
            <Animated.View
                style={{flex: 1, backgroundColor: 'red'}}
                {...this.state.panResponder.panHandlers}>
                <GesturePath ref={this.gesturePath}/>
            </Animated.View>
        )
    }
}