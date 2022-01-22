import React, { useEffect } from "react";
import { Button, Row, Col } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
import "./disk.less";
import FileList from "./fileList/FileList";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [currentDir]);

    const { size } = 'default';

    return (
        <div className="disk">
            <Row>
                <Col lg={6}>
                    <div className="disk__btns">
                        <Button size={size}>Назад</Button>
                        <Button type="dashed" size={size} className="disk__create">Создать папку</Button>
                    </div>
                </Col>
            </Row>
            <FileList />
        </div>
    )
}

export default Disk;