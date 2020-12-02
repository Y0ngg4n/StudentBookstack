import React, {useRef, useState} from 'react';
import {Dimensions, PanResponder, View, StyleSheet, Animated} from 'react-native';
import GestureRecorder from "./OldGestures/Gestures/GestureRecorder";
import {ListItem, Text} from "native-base";
import DrawView from "./Gestures/DrawView";
import {PanGestureHandler, Directions, State, FlatList, ScrollView} from "react-native-gesture-handler";
import Svg, {Polyline} from "react-native-svg";

export default class PageView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            pages: [],
            verticalScrollPosition: 0,
            horizontalScrollPosition: 0,
            svgHeight: 500,
            svgWidth: 500,
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
        this.flatList = React.createRef()
        this.scrollView = React.createRef()
    }

    onPan({nativeEvent}) {

        // Vertical Scroll
        const verticalScrollPosition = this.state.verticalScrollPosition -
            (nativeEvent.velocityY * 0.1)
        if (verticalScrollPosition >= 0 && verticalScrollPosition <= this.state.svgHeight * this.state.colors.length) {
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
        if (horizontalScrollPosition >= 0 && horizontalScrollPosition <= this.state.svgWidth * this.state.colors[0].length) {
            console.log(horizontalScrollPosition)
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

    renderItem(itemData) {
        return (
            <View style={{flexDirection: 'row'}}>
                {itemData.map((value, index) => {
                    return (
                        <Svg key={index.toString() + Math.random().toString()} height={this.state.svgHeight}
                             width={this.state.svgWidth}
                             style={{backgroundColor: itemData[index].color}}>
                        </Svg>)
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <PanGestureHandler
                    ref={this.panGestureHandler}
                    waitFor={this.flatList}
                    minPointers={2}
                    onGestureEvent={(event) => this.onPan(event)}
                    shouldCancelWhenOutside
                >
                    <Animated.View style={{flex: 1, backgroundColor: "green"}}>
                        <ScrollView
                            ref={this.scrollView}
                            horizontal={true}
                            scrollEnabled={false}
                            persistentScrollbar={true}
                            waitFor={this.panGestureHandler}
                        >
                            <FlatList
                                ref={this.flatList}
                                scrollEnabled={false}
                                persistentScrollbar={true}
                                waitFor={this.panGestureHandler}
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
                </PanGestureHandler>
            </View>
        );
    }
}

