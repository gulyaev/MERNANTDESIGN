import React, { useEffect, useState } from "react";
import { Upload, message, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import { setCurrentDir } from "../../reducers/fileReducer";
import "./disk.less";
import FileList from "./fileList/FileList";
import Popup from "./Popup";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const dirStack = useSelector(state => state.files.dirStack);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { size } = 'default';
    const [defaultFileList, setDefaultFileList] = useState([]);

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

    const dummyRequest = ({ file, fileList, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const props = {
        name: 'file',
        type: "file",
        multiple: 'true',
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log("info.file " + JSON.stringify(info.file), "info.fileList " + JSON.stringify(info.fileList));
                dispatch(uploadFile(info.file, currentDir));
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);

                const newDatafile = {
                    filename: info.file.name,
                    filesizeBytes: info.file.size
                }
                console.log("Antd onSuccess file " + JSON.stringify(newDatafile));
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        customRequest: dummyRequest
    }

    return (
        <div className="disk">
            <Row>
                <Col lg={10}>
                    <div className="disk__btns">
                        <Button size={size} className="disk__back" onClick={() => backClickHandler()}>Назад</Button>
                        <Button type="dashed" size={size} className="disk__create" onClick={() => showModal()}>Создать папку</Button>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Загрузить файл</Button>
                        </Upload>
                    </div>
                </Col>
            </Row>
            <FileList />
            <Popup isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </div>
    )
}

export default Disk;