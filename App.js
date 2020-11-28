import React from 'react';
import FileTree from "./views/FileTree/FileTree"
import {StyleSheet} from "react-native";
import * as Localization from 'expo-localization';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Container, Content, Header, Footer, List, ListItem, Text} from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from 'i18n-js';

import de from "./locales/de"
import en from "./locales/en"

import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Ionicons} from "@expo/vector-icons";
import {View} from 'native-base'


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
        };
    }

    async componentDidMount() {
        // Set the key-value pairs for the different languages you want to support.
        i18n.translations = {
            en: en,
            de: de,
        };
        // Set the locale once at the beginning of your app.
        let loc = Localization.locale;
        if (loc.split("-").length > 1) {
            loc = loc.split("-")[0]
        }
        i18n.locale = loc;
        console.log("Locales set!")

        //Fonts
        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        });
        console.log("Fonts loaded!")
        this.setState({isReady: true});
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading/>;
        }
        return (
            <Container>
                {/*<Header><Text>Header</Text></Header>*/}
                <FileTree/>
                {/*<Footer><Text>Footer</Text></Footer>*/}
            </Container>
        );
    }

}