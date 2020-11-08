import React from 'react';
import {ListItem, Container, Button, Left, List, Body, Text, Content, CheckBox, Right} from "native-base";
import * as FileSystem from "expo-file-system";
import {bookstackDir} from "../../config"
import i18n from 'i18n-js';
import {Ionicons, FontAwesome5} from '@expo/vector-icons';
import CreateNotebookModal from "./Modals/CreateNotebookModal";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FileTree extends React.Component {

    constructor(props, context) {
        super(props, context);
        const fileDir = FileSystem.documentDirectory + "/" + bookstackDir
        this.state = {
            edit: false,
            fileDir: fileDir,
            notebookSelectedIndex: -1,
            categorySelectedIndex: -1,
            notebookCheckedList: [],
            notebookContent: [],
            notebookConfig: [],
            categoryContent: [],
            chapterContent: [],
            pageContent: [],
            checkedNotebooks: []
        }
        this.createNoteBookModal = React.createRef()
        this.createCategoryModal = React.createRef()
        this.createChapterModal = React.createRef()
        this.createPageModal = React.createRef()
    }

    async componentDidMount() {
        // await FileSystem.deleteAsync(this.state.fileDir, {idempotent: true})
        await FileSystem.makeDirectoryAsync(this.state.fileDir, {intermediates: true})
        await this.refreshContent(this.state.fileDir, this.state.notebookDir,
            this.state.categoryDir, this.state.chapterDir, this)
    }

    createNewNotebook() {
        this.createNoteBookModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            fileDir: this.state.fileDir,
            notebookDir: this.concatenateNotebookDir(),
            categoryDir: this.concatenateCategoryDir(),
            chapterDir: this.concatenateChapterDir()
        }))
        console.log(this.createNoteBookModal.current.state)
        this.setState((prevState) => ({
            ...prevState,
            createDirectoryModalVisible: true
        }))
    }

    async createNewCategory(event) {
        this.createCategoryModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            notebookDir: this.state.notebookDir,
        }))
        console.log(this.createCategoryModal.current.state)
        this.setState((prevState) => ({
            ...prevState,
            createDirectoryModalVisible: true
        }))
    }

    async createNewChapter(event) {
        this.createChapterModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            categoryDir: this.state.categoryDir,
        }))
        console.log(this.createChapterModal.current.state)
        this.setState((prevState) => ({
            ...prevState,
            createDirectoryModalVisible: true
        }))
    }

    async createNewPage(event) {
        this.createChapterModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            chapterDir: this.state.chapterDir,
        }))
        console.log(this.createChapterModal.current.state)
        this.setState((prevState) => ({
            ...prevState,
            createDirectoryModalVisible: true
        }))
    }

    selectedNotebook(index) {
        this.setState((prevState) => ({
            ...prevState,
            notebookSelectedIndex: index
        }))
    }

    selectedCategory(index) {
        this.setState((prevState) => ({
            ...prevState,
            categorySelectedIndex: index
        }))
    }

    selectedChapter(key) {
        this.setState((prevState) => ({
            ...prevState,
            categoryDir: this.state.fileDir + "/" + this.state.notebookDir + "/" +
                this.state.categoryDir + "/" + encodeURIComponent(name)
        }))
    }

    concatenateNotebookDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex])
    }

    concatenateCategoryDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex])
            + "/" + encodeURIComponent(this.state.categoryContent[this.state.categorySelectedIndex])
    }

    concatenateChapterDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex])
            + "/" + encodeURIComponent(this.state.categoryContent[this.state.categorySelectedIndex])
    }


    selectedPage(key) {
        this.setState((prevState) => ({
            ...prevState,
            categoryDir: this.state.fileDir + "/" + this.state.notebookDir + "/" +
                this.state.categoryDir + "/" + this.state.chapterDir + "/" + encodeURIComponent(name)
        }))
    }

    onEditButtonPressed() {
        this.setState((prevState) => ({
            ...prevState,
            edit: !prevState.edit,
            checkedNotebooks: []
        }))
    }

    onNotebookChecked(name) {
        if (this.state.checkedNotebooks.includes(name)) {
            let newCheckedNotebooks = this.state.checkedNotebooks
            newCheckedNotebooks.splice(newCheckedNotebooks.indexOf(name), 1)
            this.setState((prevState) => ({
                ...prevState,
                checkedNotebooks: newCheckedNotebooks
            }))
        } else {
            let newCheckedNotebooks = this.state.checkedNotebooks
            newCheckedNotebooks.push(name)
            this.setState((prevState) => ({
                ...prevState,
                checkedNotebooks: newCheckedNotebooks
            }))
        }
    }

    async onDelete() {
        for (let i = 0; i < this.state.checkedNotebooks.length; i++) {
            await FileSystem.deleteAsync(this.state.fileDir + "/" + this.state.checkedNotebooks[i])
        }
        this.setState((prevState) => ({
            ...prevState,
            checkedNotebooks: []
        }))
        await this.refreshContent()
    }

    render() {
        return (
            <Container style={{flexDirection: 'row'}}>
                <Button
                    onPress={() => this.onEditButtonPressed()}><Text>{i18n.t('FileTree.Buttons.Edit')}</Text></Button>
                <Button disabled={!this.state.edit} onPress={async () => await this.onDelete()}>
                    <Text>{i18n.t('FileTree.Buttons.Delete')}</Text>
                </Button>
                <Container style={{flexDirection: 'column'}}>
                    <Button
                        onPress={() => this.createNewNotebook()}><Text>{i18n.t('FileTree.Buttons.AddNotebook')}</Text></Button>
                    <Content>
                        <List>
                            {this.state.notebookContent.map((value, index) => {
                                const config = this.state.notebookConfig[index]
                                if (this.state.edit) {
                                    const notebookChecked = this.state.checkedNotebooks.includes(value);
                                    return (
                                        <ListItem
                                            style={{backgroundColor: config.color}}
                                            key={index} selected={this.state.notebookSelectedIndex === index}
                                            onPress={() => this.selectedNotebook(index)}>
                                            <Left>
                                                <Ionicons name={"ios-book"}/></Left>
                                            <Body><Text>{value}</Text></Body>
                                            <Right><CheckBox onPress={() => this.onNotebookChecked(value)}
                                                             checked={notebookChecked}/></Right>
                                        </ListItem>);
                                } else {
                                    return (<ListItem
                                        style={{backgroundColor: config.color}}
                                        key={index} selected={this.state.notebookSelectedIndex === index}
                                        onPress={() => this.selectedNotebook(index)}>
                                        <Left><Ionicons name={"ios-book"}/></Left>
                                        <Body><Text>{value}</Text></Body>
                                    </ListItem>);
                                }
                            })}
                            <CreateNotebookModal ref={this.createNoteBookModal} onCreated={this.refreshContent}
                                                 context={this}/>
                        </List>
                    </Content>
                </Container>
            </Container>
        )
    }

    async refreshContent(fileDir, notebookDir, categoryDir, chapterDir, context) {
        const notebookContent = await FileSystem.readDirectoryAsync(fileDir)
        const categoryContent = context.state.notebookSelectedIndex !== -1 ? await FileSystem.readDirectoryAsync(notebookDir) : []
        const chapterContent = context.state.categoryDir ? await FileSystem.readDirectoryAsync(categoryDir) : []
        const pageContent = context.state.chapterDir ? await FileSystem.readDirectoryAsync(chapterDir) : []

        const notebookConfig = []
        for (let i = 0; i < notebookContent.length; i++) {
            notebookConfig.push(JSON.parse(await AsyncStorage.getItem(fileDir + "/" + notebookContent[i])))
        }

        context.setState((prevState) => ({
            ...prevState,
            notebookContent: notebookContent,
            notebookConfig: notebookConfig,
            categoryContent: categoryContent,
            chapterContent: chapterContent,
            pagesContent: pageContent,
        }))
    }

}