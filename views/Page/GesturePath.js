import React from "react";
import Svg, {Polyline} from "react-native-svg";
import {Dimensions} from 'react-native';

export default class GesturePath extends React.Component {

    constructor(props, context) {
        super(props, context);
        const window = Dimensions.get('window')
        this.state = {
            width: window.width,
            height: window.height,
            path: []
        }
    }

    render() {
        const points = this.state.path.map(p => `${p.x},${p.y}`).join(' ');
        return (
            <Svg height="100%" width="100%" viewBox={`0 0 ${this.state.width} ${this.state.height}`}>
                <Polyline
                    points={points}
                    fill="none"
                    stroke={"blue"}
                    strokeWidth="1"
                />
            </Svg>
        );
    }
}