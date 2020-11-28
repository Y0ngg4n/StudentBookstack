import React from 'react';
import {ListItem, Container, Button, Left, List, Body, Content, CheckBox, Right, Text} from "native-base";
import * as FileSystem from "expo-file-system";
import {bookstackDir, defaultColors} from "../../config"
import i18n from 'i18n-js';
import {Ionicons, FontAwesome5} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeableFlatList from 'react-native-swipeable-list';
import {ScrollView, View, Pressable, StyleSheet} from "react-native";
import styles from '../../styles/FileTree'
import CreateModal from "./Modals/CreateModal";
import EditModal from "./Modals/EditModal";

export default class FileTree extends React.Component {

    constructor(props, context) {
        super(props, context);
        const fileDir = FileSystem.documentDirectory + "/" + bookstackDir
        this.state = {
            edit: false,
            defaultColors: [],
            fileDir: fileDir,
            notebookSelectedIndex: -1,
            categorySelectedIndex: -1,
            chapterSelectedIndex: -1,
            pageSelectedIndex: -1,
            notebookCheckedList: [],
            notebookContent: [],
            notebookConfig: [],
            categoryContent: [],
            categoryConfig: [],
            chapterContent: [],
            pageContent: [],
            checkedNotebooks: [],
            checkedCategories: []
        }
        this.createModal = React.createRef()
        this.editModal = React.createRef()
        this.maxSwipeDistance = 200;
    }

    async componentDidMount() {
        await FileSystem.deleteAsync(this.state.fileDir, {idempotent: true})
        await FileSystem.makeDirectoryAsync(this.state.fileDir, {intermediates: true})
        await this.refreshContentLocal()
        let dc = await AsyncStorage.getItem('defaultColors')

        if (!dc)
            await AsyncStorage.setItem('defaultColors', JSON.stringify(defaultColors))
        else dc = JSON.parse(dc);

        this.setState((prevState) => ({
            ...prevState,
            defaultColors: dc,
        }))
    }

    createNewNotebook() {
        this.createModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            contextState: this.state,
            directoryName: "",
            baseDir: this.state.fileDir,
        }))
    }

    async createNewCategory() {
        this.createModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            contextState: this.state,
            directoryName: "",
            baseDir: this.concatenateNotebookDir(),
        }))
    }

    async createNewChapter() {
        this.createModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            contextState: this.state,
            directoryName: "",
            baseDir: this.concatenateCategoryDir(),
        }))
    }

    async selectedNotebook(index) {
        await this.setState((prevState) => ({
            ...prevState,
            notebookSelectedIndex: index
        }))
        await this.refreshContentLocal()
    }

    selectedCategory(index) {
        this.setState((prevState) => ({
            ...prevState,
            categorySelectedIndex: index
        }))
    }

    concatenateNotebookDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex].dirName)
    }

    concatenateCategoryDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex].dirName)
            + "/" + encodeURIComponent(this.state.categoryContent[this.state.categorySelectedIndex].dirName)
    }

    concatenateChapterDir() {
        return this.state.fileDir + "/"
            + encodeURIComponent(this.state.notebookContent[this.state.notebookSelectedIndex].dirName)
            + "/" + encodeURIComponent(this.state.categoryContent[this.state.categorySelectedIndex].dirName)
    }


    selectedPage(key) {
        this.setState((prevState) => ({
            ...prevState,
            categoryDir: this.state.fileDir + "/" + this.state.notebookDir + "/" +
                this.state.categoryDir + "/" + this.state.chapterDir + "/" + encodeURIComponent(name)
        }))
    }

    async onDelete(itemData) {
        switch (itemData.type) {
            case 0:
                if (this.state.notebookSelectedIndex === itemData.index) {
                    await this.setState((prevState) => ({
                        ...prevState,
                        notebookSelectedIndex: -1
                    }))
                }
                break;
            case 1:
                if (this.state.categorySelectedIndex === itemData.index) {
                    await this.setState((prevState) => ({
                        ...prevState,
                        categorySelectedIndex: -1
                    }))
                }
                break;
            case 3:
                if (this.state.chapterSelectedIndex === itemData.index) {
                    await this.setState((prevState) => ({
                        ...prevState,
                        chapterSelectedIndex: -1
                    }))
                }
                break;
            case 4:
                if (this.state.pageSelectedIndex === itemData.index) {
                    await this.setState((prevState) => ({
                        ...prevState,
                        pageSelectedIndex: -1
                    }))
                }
                break;
        }
        await FileSystem.deleteAsync(itemData.baseDir + "/" + encodeURIComponent(itemData.dirName))
        await this.refreshContentLocal()
    }

    async onEdit(itemData) {
        const colorIndex = this.state.defaultColors.includes(itemData.config.color)
            ? this.state.defaultColors.indexOf(itemData.config.color) : 0
        this.editModal.current.setState((prevState) => ({
            ...prevState,
            visible: true,
            contextState: this.state,
            directoryName: itemData.dirName,
            choosedColor: itemData.config.color,
            selectedColor: colorIndex,
            itemData: itemData,
            defaultColors: this.state.defaultColors
        }))
    }

    renderListItem(itemData) {
        //TODO: Maybe add Subject and Description to Folder
        let selected = false;
        console.log(itemData)
        switch (itemData.type) {
            case 0:
                selected = this.state.notebookSelectedIndex === itemData.index
                break;
            case 1:
                selected = this.state.categorySelectedIndex === itemData.index
                break;
            case 2:
                selected = this.state.chapterSelectedIndex === itemData.index
                break;
        }
        return (
            <View style={styles.item}>
                {/*<View style={styles.avatar}/>*/}
                <ListItem selected={selected}
                          onPress={async () => {
                              switch (itemData.type) {
                                  case 0:
                                      await this.selectedNotebook(itemData.index);
                                      break;
                                  case 1:
                                      await this.selectedCategory(itemData.index);
                                      break;
                              }
                          }}>
                    <Left>
                        <Ionicons name="ios-book" color={itemData.config.color} size={25}></Ionicons>
                    </Left>
                    <Body>
                        <Text numberOfLines={1}>
                            {itemData.dirName}
                        </Text>
                    </Body>

                    {/*<Text style={styles.subject} numberOfLines={1}>*/}
                    {/*    {itemData.subject}*/}
                    {/*</Text>*/}
                    {/*<Text style={styles.text} numberOfLines={2}>*/}
                    {/*    {itemData.description}*/}
                    {/*</Text>*/}
                </ListItem>
            </View>
        )
    }

    renderItemSeparator() {
        return <View style={styles.itemSeparator}/>;
    }

    renderQuickActions(index, item) {
        return (
            <View style={styles.qaContainer}>
                <View style={[styles.button]}>
                    <Pressable onPress={async () => await this.onEdit(item)}>
                        <Text style={[styles.buttonText, styles.button2Text]}>
                            {i18n.t('FileTree.Buttons.Rename')}
                        </Text>
                    </Pressable>
                </View>
                <View style={[styles.button]}>
                    <Pressable onPress={async () => await this.onDelete(item)}>
                        <Text style={[styles.buttonText, styles.button3Text]}>
                            {i18n.t('FileTree.Buttons.Delete')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    render() {
        let notebookSwipeableList = (
            <View style={{flexGrow: 1}}>
                <Button
                    onPress={() => this.createNewNotebook()}><Text>{i18n.t('FileTree.Buttons.AddNotebook')}</Text></Button>
                <SwipeableFlatList
                    data={this.state.notebookContent}
                    renderItem={({item}) => this.renderListItem(item)}
                    keyExtractor={item => item.dirName}
                    shouldBounceOnMount={true}
                    maxSwipeDistance={this.maxSwipeDistance}
                    contentContainerStyle={styles.contentContainerStyle}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    renderQuickActions={({index, item}) => this.renderQuickActions(index, item)}
                />
            </View>
        )

        let categorySwipeableList = (
            <View style={{flexGrow: 1}}>
                <Button
                    onPress={() => this.createNewCategory()}><Text>{i18n.t('FileTree.Buttons.AddCategory')}</Text></Button>
                <SwipeableFlatList
                    data={this.state.categoryContent}
                    renderItem={({item}) => this.renderListItem(item)}
                    keyExtractor={item => item.dirName}
                    shouldBounceOnMount={true}
                    maxSwipeDistance={this.maxSwipeDistance}
                    contentContainerStyle={styles.contentContainerStyle}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    renderQuickActions={({index, item}) => this.renderQuickActions(index, item)}
                />
            </View>
        )

        let chapterSwipeableList = (
            <View style={{flexGrow: 1}}>
                <Button
                    onPress={() => this.createNewChapter()}><Text>{i18n.t('FileTree.Buttons.AddChapter')}</Text></Button>
                <SwipeableFlatList
                    data={this.state.chapterContent}
                    renderItem={({item}) => this.renderListItem(item)}
                    keyExtractor={item => item.dirName}
                    shouldBounceOnMount={true}
                    maxSwipeDistance={this.maxSwipeDistance}
                    contentContainerStyle={styles.contentContainerStyle}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    renderQuickActions={({index, item}) => this.renderQuickActions(index, item)}
                />
            </View>
        )

        let listContainers = (
            <Container>
                {/*{notebookList}*/}
                {notebookSwipeableList}
            </Container>
        )

        if (this.state.notebookSelectedIndex !== -1
            && this.state.categorySelectedIndex === -1
            && this.state.chapterSelectedIndex === -1) {
            listContainers = (<Container style={{flexDirection: 'row'}}>
                {notebookSwipeableList}
                {categorySwipeableList}
            </Container>)
        } else if (
            this.state.notebookSelectedIndex !== -1
            && this.state.categorySelectedIndex !== -1
            && this.state.chapterSelectedIndex === -1
        ) {
            listContainers = (<Container style={{flexDirection: 'row'}}>
                {notebookSwipeableList}
                {categorySwipeableList}
                {chapterSwipeableList}
            </Container>)
        }

        return (
            <Container>
                {listContainers}
                <CreateModal ref={this.createModal} onCreated={this.refreshContent}
                             context={this}/>
                <EditModal ref={this.editModal} onCreated={this.refreshContent}
                           context={this}/>
            </Container>
        )
    }

    async refreshContentLocal() {
        await this.refreshContent(this.state.fileDir, this.state.notebookSelectedIndex,
            this.state.categorySelectedIndex, this.state.chapterSelectedIndex,
            this.state.pageSelectedIndex, this)
    }

    async refreshContent(fileDir, notebookSelectedIndex, categorySelectedIndex, chapterSelectedIndex, pageSelectedIndex, context) {
        console.log("Refresh started!")
        // console.log("################")
        // console.log(fileDir)
        // console.log(notebookSelectedIndex)
        // console.log(categorySelectedIndex)
        // console.log(chapterSelectedIndex)
        // console.log("################")

        // Files
        const notebookContent = await FileSystem.readDirectoryAsync(fileDir)

        let categoryContent = []
        let notebookDir = ""
        if (context.state.notebookSelectedIndex !== -1) {
            notebookDir = fileDir + "/" + encodeURIComponent(notebookContent[notebookSelectedIndex]);
            categoryContent = await FileSystem.readDirectoryAsync(notebookDir)
        }

        let chapterContent = []
        let categoryDir = ""
        if (context.state.categorySelectedIndex !== -1) {
            categoryDir = notebookDir + "/" + encodeURIComponent(categoryContent[categorySelectedIndex]);
            chapterContent = await FileSystem.readDirectoryAsync(categoryDir)
        }

        // Configs
        const notebookContentMap = []
        for (let i = 0; i < notebookContent.length; i++) {
            notebookContentMap.push(
                {
                    index: i,
                    dirName: notebookContent[i],
                    baseDir: fileDir,
                    config: JSON.parse(await AsyncStorage.getItem(fileDir + "/" + encodeURIComponent(notebookContent[i]))),
                    type: 0
                }
            )
        }

        const categoryContentMap = []
        for (let i = 0; i < categoryContent.length; i++) {
            console.log("###Category")
            categoryContentMap.push(
                {
                    index: i,
                    dirName: categoryContent[i],
                    baseDir: notebookDir,
                    config: JSON.parse(await AsyncStorage.getItem(notebookDir + "/" + encodeURIComponent(categoryContent[i]))),
                    type: 1
                }
            )
        }

        const chapterContentMap = []
        for (let i = 0; i < chapterContent.length; i++) {
            console.log("###Category")
            chapterContentMap.push(
                {
                    index: i,
                    dirName: chapterContent[i],
                    baseDir: categoryDir,
                    config: JSON.parse(await AsyncStorage.getItem(categoryDir + "/" + encodeURIComponent(chapterContent[i]))),
                    type: 2
                }
            )
        }

        context.setState((prevState) => ({
            ...prevState,
            notebookContent: notebookContentMap,
            categoryContent: categoryContentMap,
            chapterContent: chapterContentMap
        }))
    }
}