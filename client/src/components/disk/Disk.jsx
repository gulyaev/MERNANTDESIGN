import React, { useEffect, useState } from "react";
import { Button, Row, Col } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
import "./disk.less";
import FileList from "./fileList/FileList";
import Popup from "./Popup";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const { size } = 'default';
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [currentDir]);

    const showModal = () => {
        setIsModalVisible(true);
    }

    return (
        <div className="disk">
            <Row>
                <Col lg={6}>
                    <div className="disk__btns">
                        <Button size={size}>Назад</Button>
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