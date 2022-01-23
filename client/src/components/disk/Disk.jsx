import React, { useEffect, useState } from "react";
import { Button, Row, Col } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
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

    return (
        <div className="disk">
            <Row>
                <Col lg={6}>
                    <div className="disk__btns">
                        <Button size={size} onClick={()=>backClickHandler()}>Назад</Button>
                        <Button type="dashed" size={size} className="disk__create" onClick = {() => showModal()}>Создать папку</Button>
                    </div>
                </Col>
            </Row>
            <FileList />
            <Popup isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
        </div>
    )
}

export default Disk;