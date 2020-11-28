import React from "react";
import Modal from "react-native-modal";
import {Input, Button, Container, Text, Radio, Form, Item} from "native-base";
import i18n from 'i18n-js';
import * as FileSystem from "expo-file-system";
import {TriangleColorPicker} from "react-native-color-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreateModal extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.state = {
            directoryName: "",
            saveDisabled: true,
            visible: false,
            selectedColor: 0,
            colorChooser: false,
            choosedColor: "#03071E",
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
        const dir = this.state.baseDir + "/" + encodeURIComponent(this.state.directoryName)
        console.log(dir)
        await FileSystem.makeDirectoryAsync(dir, {intermediates: true})
        this.setState((prevState) => ({
            ...prevState,
            visible: false
        }))
        const config = {
            color: this.state.choosedColor
        }
        try {
            await AsyncStorage.setItem(dir, JSON.stringify(config))
        } catch (e) {
            console.log(e)
        }
        await this.props.onCreated(
            this.state.contextState.fileDir,
            this.state.contextState.notebookSelectedIndex,
            this.state.contextState.categorySelectedIndex,
            this.state.contextState.chapterSelectedIndex,
            this.state.contextState.pageSelectedIndex,
            this.props.context)
    }

    onCancel() {
        this.setState((prevState) => ({
            ...prevState,
            visible: false,
        }))
    }

    setColor(index) {
        this.setState((prevState) => ({
            ...prevState,
            selectedColor: index,
            choosedColor: this.state.contextState.defaultColors[index]
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
            colorChooser: false
        }))
    }

    render() {
        if (!this.state.contextState) {
            return (<Modal visible={this.state.visible}><Text>Invisible</Text></Modal>)
        }

        const form = (
            <Container>
                <Form>
                    <Item>
                        <Input value={this.state.directoryName}
                               placeholder={i18n.t('FileTree.CreateModal.NamePlaceholder')}
                               onChangeText={text => this.onDirectoryChange(text)}/>
                    </Item>
                    <Item>
                        {this.state.contextState.defaultColors.map((value, index) => {
                            return (<Radio key={index} onPress={() => this.setColor(index)}
                                           selected={this.state.selectedColor === index ? true : false}
                                           color={value}
                                           style={{backgroundColor: value, flex: 1, fontScale: 50}}/>)
                        })}
                    </Item>
                    <Item>
                        <Button onPress={() => this.onChooseColor()}>
                            <Text>{i18n.t('FileTree.CreateModal.ChooseColor')}</Text>
                        </Button>
                    </Item>
                    <Item>
                        <Button disabled={this.state.saveDisabled}
                                onPress={async (e) => await this.onSaveFolder()}>
                            <Text>{i18n.t('FileTree.CreateModal.SaveFolder')}</Text>
                        </Button>
                    </Item>
                    <Item>
                        <Button
                            onPress={() => this.onCancel()}>
                            <Text>{i18n.t('FileTree.CreateModal.Cancel')}</Text>
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
            <Modal visible={this.state.visible}
                   onBackButtonPress={() => this.onCancel()}
                   onBackdropPress={() => this.onCancel()}>
                {this.state.colorChooser ? colorChoose : form}
            </Modal>
        )
    }
}