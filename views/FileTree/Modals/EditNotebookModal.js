import React from "react";
import {Modal} from "react-native";
import {Input, Button, Container, Text, Radio, Form, Item} from "native-base";
import i18n from 'i18n-js';
import * as FileSystem from "expo-file-system";
import {TriangleColorPicker} from "react-native-color-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreateNotebookModal extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.state = {
            fileDir: "",
            directoryName: "",
            saveDisabled: true,
            visible: false,
            selectedColor: 0,
            colorChooser: false,
            choosedColor: "#03071E",
            defaultColors: []
        }
    }

    onDirectoryChange(text) {
        if (text) {
            this.setState((prevState) => ({
                ...prevState,
                directoryName: text,
                saveDisabled: false
            }))
        } else {
            this.setState((prevState) => ({
                ...prevState,
                directoryName: text,
                saveDisabled: true
            }))
        }
    }

    async onSaveFolder(event) {
        const oldDir = this.state.fileDir + "/" + encodeURIComponent(this.state.oldDirectoryName)
        const dir = this.state.fileDir + "/" + encodeURIComponent(this.state.directoryName)
        if (oldDir !== dir) {
            await FileSystem.moveAsync({
                from: oldDir,
                to: dir
            })
        }
        this.setState((prevState) => ({
            ...prevState,
            visible: false
        }))
        const config = {
            color: this.state.choosedColor
        }
        try {
            await AsyncStorage.removeItem(oldDir)
            await AsyncStorage.setItem(dir, JSON.stringify(config))
        } catch (e) {
            console.log(e)
        }
        await this.props.onCreated(this.state.fileDir, dir, this.state.categoryDir, this.state.chapterDir, this.props.context)
    }

    setColor(index) {
        this.setState((prevState) => ({
            ...prevState,
            selectedColor: index,
            saveDisabled: false,
            choosedColor: this.state.defaultColors[index]
        }))
    }

    onChooseColor() {
        this.setState((prevState) => ({
            ...prevState,
            colorChooser: true
        }))
    }

    onColorSelected(color) {
        this.setState((prevState) => ({
            ...prevState,
            choosedColor: color,
            saveDisabled: false,
            colorChooser: false
        }))
    }

    componentDidMount(prevProps, prevState, snapshot) {
        if (this.state.defaultColors.includes(this.state.choosedColor)) {
            this.setState((prevState) => ({
                ...prevState,
                selectedColor: this.state.defaultColors.indexOf(this.state.choosedColor)
            }))
        }
    }

    render() {
        const form = (
            <Container>
                <Form>
                    <Item>
                        <Input value={this.state.directoryName}
                               placeholder={i18n.t('FileTree.CreateNotebookModal.NamePlaceholder')}
                               onChangeText={text => this.onDirectoryChange(text)}/>
                    </Item>
                    <Item>
                        {this.state.defaultColors.map((value, index) => {
                            return (<Radio key={index} onPress={() => this.setColor(index)}
                                           selected={this.state.selectedColor === index ? true : false}
                                           color={value}
                                           style={{backgroundColor: value, flex: 1, fontScale: 50}}/>)
                        })}
                    </Item>
                    <Item>
                        <Button onPress={() => this.onChooseColor()}>
                            <Text>{i18n.t('FileTree.CreateNotebookModal.ChooseColor')}</Text>
                        </Button>
                    </Item>
                    <Item>
                        <Button disabled={this.state.saveDisabled}
                                onPress={async (e) => await this.onSaveFolder()}>
                            <Text>{i18n.t('FileTree.CreateNotebookModal.SaveFolder')}</Text>
                        </Button>
                    </Item>
                </Form>
            </Container>
        )

        const colorChoose = (
            <Container>
                <TriangleColorPicker
                    onColorSelected={color => this.onColorSelected(color)}
                    style={{flex: 1}}/>
            </Container>
        )

        return (
            <Modal visible={this.state.visible}>
                {this.state.colorChooser ? colorChoose : form}
            </Modal>
        )
    }
}