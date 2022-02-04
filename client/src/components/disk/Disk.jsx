import React, { useEffect, useState } from "react";
import { Button, Row, Col, Input } from 'antd';
import { Upload, message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import { setCurrentDir } from "../../reducers/fileReducer";
import "./disk.less";
import FileList from "./fileList/FileList";
import Popup from "./Popup";
import DraggerComponent from "./DraggerComponent";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const dirStack = useSelector(state => state.files.dirStack);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dragEnter, setDragEnter] = useState(false);
    const { size } = 'default';

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [currentDir]);

    const showModal = () => {
        setIsModalVisible(true);
    }

    const backClickHandler = () => {
        const backDirId = dirStack.pop();
        dispatch(setCurrentDir(backDirId));
    }

    const dragEnterHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    }

    const dragLeaveHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    }

    const fileUploadHandler = event => {
        const files = [...event.target.files];
        files.forEach(file => dispatch(uploadFile(file, currentDir)));
    }

    return (!dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <Row>
                <Col lg={9}>
                    <div className="disk__btns">
                        <Button size={size} className="disk__back" onClick={() => backClickHandler()}>Назад</Button>
                        <Button type="dashed" size={size} className="disk__create" onClick={() => showModal()}>Создать папку</Button>
                        <Input onChange={(event) => fileUploadHandler(event)} multiple="true" type="file" id="disk__upload-input" placeholder="Basic usage" hidden={true} />
                        <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label> 
                    </div>
                </Col>
            </Row>
            <FileList />
            <Popup isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </div>
        :
        <div className="drop-area" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <DraggerComponent setDragEnter={setDragEnter} />
        </div>
    )
}

export default Disk;