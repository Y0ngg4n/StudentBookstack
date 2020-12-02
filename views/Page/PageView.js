import React, {useRef, useState} from 'react';
import {Dimensions, PanResponder, View, StyleSheet, Animated, useWindowDimensions} from 'react-native';
import GestureRecorder from "./OldGestures/Gestures/GestureRecorder";
import {ListItem, Text} from "native-base";
import DrawView from "./Gestures/DrawView";
import {
    PanGestureHandler,
    PinchGestureHandler,
    Directions,
    State,
    FlatList,
    ScrollView
} from "react-native-gesture-handler";
import Svg, {Polyline} from "react-native-svg";

export default class PageView extends React.Component {

    constructor(props, context) {
        super(props, context);
        const window = Dimensions.get('window')
        this.windowHeight = window.height
        this.windowWidth = window.width


        this.state = {
            pages: [],
            maxBitmapPixelSize: 1000,
            verticalScrollPosition: 0,
            horizontalScrollPosition: 0,
            svgHeight: 50,
            svgWidth: 50,
            svgScale: 1,
            colors: [
                [
                    {
                        id: "1",
                        color: "cyan"
                    },
                    {
                        id: "2",
                        color: "green"
                    },
                    {
                        id: "3",
                        color: "yellow"
                    },
                    {
                        id: "4",
                        color: "blue"
                    },
                ], [
                    {
                        id: "1",
                        color: "blue"
                    },
                    {
                        id: "2",
                        color: "yellow"
                    },
                    {
                        id: "3",
                        color: "green"
                    },
                    {
                        id: "4",
                        color: "cyan"
                    },
                ],
            ]
        }


        this.panGestureHandler = React.createRef()
        this.pinchGestureHandler = React.createRef()
        this.flatList = React.createRef()
        this.scrollView = React.createRef()
    }

    componentDidMount() {
        const rows = []
        for (let i = 0; i < 500; i++) {
            const columns = []
            for (let j = 0; j < this.windowWidth / this.state.svgWidth + 1; j++) {
                columns.push({
                    id: i.toString() + "-" + j.toString(),
                    color: this.getRandomColor()
                })
            }
            rows.push(columns)
        }

        this.setState((prevState) => ({
            ...prevState,
            colors: rows
        }))
    }

    onPan({nativeEvent}) {

        // Vertical Scroll
        const verticalScrollPosition = this.state.verticalScrollPosition -
            (nativeEvent.velocityY * 0.1)
        if (verticalScrollPosition >= 0 && verticalScrollPosition <= this.state.svgHeight * this.state.svgScale * this.state.colors.length) {
            this.flatList.current.scrollToOffset({
                offset: verticalScrollPosition,
                animated: true
            })
            this.setState((prevState) => ({
                ...prevState,
                verticalScrollPosition: verticalScrollPosition
            }))
        }

        // Horizontal Scroll
        const horizontalScrollPosition = this.state.horizontalScrollPosition -
            (nativeEvent.velocityX * 0.05)
        if (horizontalScrollPosition >= 0 && horizontalScrollPosition <= this.state.svgWidth * this.state.svgScale * this.state.colors[0].length) {
            this.scrollView.current.scrollTo({
                x: horizontalScrollPosition,
                animated: true
            })
            this.setState((prevState) => ({
                ...prevState,
                horizontalScrollPosition: horizontalScrollPosition
            }))
        }
    }

    onPinch({nativeEvent}) {
        const scale = nativeEvent.velocity * 100;
        console.log(scale)
        if (this.state.svgHeight * this.state.svgScale < this.state.maxBitmapPixelSize
            && this.state.svgWidth * this.state.svgScale < this.state.maxBitmapPixelSize
        ) {
            this.setState((prevState) => ({
                ...prevState,
                svgScale: prevState.svgScale + scale
            }))
            console.log(this.state.svgHeight * this.state.svgScale)
            // if (scale < 1) {
            //     this.setState((prevState) => ({
            //         ...prevState,
            //         svgScale: prevState.svgScale - (1 - scale)
            //     }))
            // } else {
            //     this.setState((prevState) => ({
            //         ...prevState,
            //         svgScale: prevState.svgScale + (scale - 1)
            //     }))
            // }
        } else {
            console.log("Zoom End Reached!!!")
        }
    }

    renderItem(itemData) {
        return (
            <View style={{flexDirection: 'row'}}>
                {itemData.map((value, index) => {
                    return (
                        <View key={"0" + Math.random().toString()}
                              height={this.state.svgHeight * this.state.svgScale}
                              width={this.state.svgWidth * this.state.svgScale}
                              style={{backgroundColor: itemData[0].color}}>
                        </View>
                    )
                })}

            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <PanGestureHandler
                    simultaneousHandlers={[this.pinchGestureHandler]}
                    ref={this.panGestureHandler}
                    waitFor={[this.flatList, this.scrollView]}
                    minPointers={2}
                    onGestureEvent={(event) => this.onPan(event)}
                    shouldCancelWhenOutside
                >
                    <PinchGestureHandler
                        simultaneousHandlers={[this.panGestureHandler]}
                        ref={this.pinchGestureHandler}
                        waitFor={[this.flatList, this.scrollView]}
                        minPointers={2}
                        onGestureEvent={(event) => this.onPinch(event)}
                        shouldCancelWhenOutside
                    >
                        <Animated.View style={{flex: 1, backgroundColor: "green"}}>
                            <ScrollView
                                ref={this.scrollView}
                                horizontal={true}
                                scrollEnabled={false}
                                persistentScrollbar={true}
                                waitFor={[this.panGestureHandler]}
                            >
                                <FlatList
                                    ref={this.flatList}
                                    scrollEnabled={false}
                                    persistentScrollbar={true}
                                    waitFor={[this.panGestureHandler]}
                                    style={{backgroundColor: "red"}}
                                    data={this.state.colors}
                                    renderItem={({item}) => this.renderItem(item)}
                                    keyExtractor={item => item.id + Math.random().toString()}
                                >
                                </FlatList>
                            </ScrollView>
                            {/*<ScrollView*/}
                            {/*    ref={this.scrollView}*/}
                            {/*    snapToInterval={10}*/}
                            {/*    scrollEnabled={true}*/}
                            {/*    showsHorizontalScrollIndicator={true}*/}
                            {/*    waitFor={this.panGestureHandler}*/}
                            {/*    style={{backgroundColor: "red"}}*/}
                            {/*    horizontal={true}*/}
                            {/*>*/}
                            {/*    {this.state.colors.map((row, rowIndex) => {*/}
                            {/*        return (*/}
                            {/*            <View style={{flexDirection: 'row'}}>*/}
                            {/*                {row.map((item, columnIndex) => {*/}
                            {/*                    return this.renderItem(item, rowIndex, columnIndex)*/}
                            {/*                })}*/}
                            {/*            </View>*/}
                            {/*        )*/}
                            {/*    })}*/}
                            {/*</ScrollView>*/}
                        </Animated.View>
                    </PinchGestureHandler>
                </PanGestureHandler>
            </View>
        );
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}

