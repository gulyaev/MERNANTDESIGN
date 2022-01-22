import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Input, Button } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import { createDir } from "../../actions/file";

const Popup = (props) => {
    const [dirName, setDirName] = useState("");
    const [loading, setLoading] = useState(false);
    const currentDir = useSelector(state => state.files.currentDir);
    const dispatch = useDispatch();

    const handleOk = () => {
        props.setIsModalVisible(false);
    };

    const handleCancel = () => {
        props.setIsModalVisible(false);
    };

    const createHandler = () => {
        setLoading(true);
        dispatch(createDir(currentDir, dirName));
        setTimeout(() => {
            setLoading(false);
            props.setIsModalVisible(false);
        }, 500);
        setDirName(null);
    };

    return (
        <Modal
            title="Создать новую папку"
            visible={props.isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="submit" type="primary" loading={loading} onClick={() => createHandler()}>
                    Создать
                </Button>
            ]}
        >
            <Input type="text" placeholder="Введите название папки..." onChange={(e) => setDirName(e.target.value)} value={dirName} prefix={<FolderAddOutlined />} style={{ fontSize: '24px', color: '#08c' }} />
        </Modal>
    )
}

export default Popup;