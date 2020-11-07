import React from "react";
import {Modal} from "react-native";
import {Input, Button, Container, Text, Radio, Form, Item} from "native-base";
import i18n from 'i18n-js';
import * as FileSystem from "expo-file-system";
import {ColorPicker, TriangleColorPicker} from 'react-native-color-picker'

export default class CreateNotebookModal extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.state = {
            fileDir: "",
            directoryName: "",
            saveDisabled: true,
            visible: false,
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
        await FileSystem.makeDirectoryAsync(this.state.fileDir + "/" + this.state.directoryName + "/",
            {intermediates: true})
        this.setState((prevState) => ({
            ...prevState,
            visible: false
        }))
        console.log(this.props.context.state)
        await this.props.onCreated(this.state.fileDir, this.state.notebookDir, this.state.categoryDir, this.state.chapterDir, this.props.context)
    }

    render() {
        return (
            <Modal visible={this.state.visible}>
                <Container>
                    <Form>
                        <Item>
                        <Input value={this.state.directoryName}
                               placeholder={i18n.t('FileTree.CreateNotebookModal.NamePlaceholder')}
                               onChangeText={text => this.onDirectoryChange(text)}/>
                        </Item>
                        <Item>
                            <Radio style={{backgroundColor: "#Fa12Fa"}}><Text>Color</Text></Radio>
                        </Item>
                        <Item>
                        <Button disabled={this.state.saveDisabled}
                                onPress={async (e) => await this.onSaveFolder()}>
                            <Text>{i18n.t('FileTree.CreateNotebookModal.SaveFolder')}</Text>
                        </Button>
                        </Item>
                    </Form>
                </Container>
            </Modal>
        )
    }
}