import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../actions/file";

const DraggerComponent = ({setDragEnter}) => {
    const { Dragger } = Upload;
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);

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
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                dispatch(uploadFile(info.file, currentDir));
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        customRequest: dummyRequest,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
            setDragEnter(false);
        },
    };

    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Чтобы загрузить файлы - нажмите или перетащите их в эту область</p>
                <p className="ant-upload-hint">
                    Поддержка загрузки отдельных файлов или группы файлов.
                </p>
            </Dragger>
        </>

    );
}

export default DraggerComponent;