import React, {useRef} from "react";
import {View, PanResponder, StyleSheet} from "react-native";
import GesturePath from "./GesturePath";

export default class GestureRecorder extends React.Component {

    constructor(props) {
        super(props)
        this.gesturePath = React.createRef()
        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log("Grant")
                this.gesturePath.current.setState((prevState) => ({
                    ...prevState,
                    path: []
                }))
            },
            onPanResponderMove: (event, gesture) => {
                const tmpPath = this.gesturePath.current.state.path
                tmpPath.push({
                    x: event.nativeEvent.locationX,
                    y: event.nativeEvent.locationY
                })
                console.log(tmpPath)
                this.gesturePath.current.setState((prevState) => ({
                    ...prevState,
                    path: tmpPath
                }))
                // Uncomment the next line to draw the path as the user is performing the touch. (A new array must be created so setState recognises the change and re-renders the App)
                // onPathChanged([...pathRef.current]);
            },
            onPanResponderRelease: () => {
                // onPathChanged([...pathRef.current])
            }
        })
        this.state = {
            panResponder: panResponder,
        }
    }

    render() {

        return (
            <View
                style={{flex: 1, backgroundColor: 'red'}}
                {...this.state.panResponder.panHandlers}>
                <GesturePath ref={this.gesturePath}/>
            </View>
        )
    }
}