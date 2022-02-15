import React, { useEffect, useState } from "react";
import { Button, Row, Col, Input, Select, Spin, Space } from 'antd';
import { LoadingOutlined, UnorderedListOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getFiles, searchFiles, uploadFile } from "../../actions/file";
import { setCurrentDir, setFileView } from "../../reducers/fileReducer";
import "./disk.less";
import FileList from "./fileList/FileList";
import Popup from "./Popup";
import DraggerComponent from "./DraggerComponent";
import Uploader from "./uploader/Uploader";
import { showLoader } from "../../reducers/appReducer";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const dirStack = useSelector(state => state.files.dirStack);
    const loader = useSelector(state => state.app.loader);
    const isAuth = useSelector(state => state.user.isAuth);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dragEnter, setDragEnter] = useState(false);
    const [sort, setSort] = useState('type');
    const [searchName, setSearchName] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(false);
    const { size } = 'default';
    const { Search } = Input;
    const antIcon = <LoadingOutlined style={{ fontSize: 75 }} spin />;

    useEffect(() => {
        dispatch(getFiles(currentDir, sort));
    }, [currentDir, sort]);

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

    //for select:
    const { Option } = Select;

    function handleChange(value) {
        console.log(`selected ${value}`);
        setSort(value);
    }

    const onSearch = (e) => {
        setSearchName(e.target.value);
        if (searchTimeout != false) {
            clearTimeout(searchTimeout)
        }
        //dispatch(showLoader());
        if (e.target.value != '') {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFiles(value));
            }, 500, e.target.value));
        } else {
            dispatch(getFiles(currentDir))
        }
    }

    if (loader == true) {
        return (
            <div className="loader">
                <Space size="large">
                    <Spin indicator={antIcon} />
                </Space>
            </div>
        )
    }

    return (!dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <Row>
                <Col lg={24}>
                    <div className="disk__btns">
                        <Button size={size} className="disk__back" onClick={() => backClickHandler()}>Назад</Button>
                        <Button type="dashed" size={size} className="disk__create" onClick={() => showModal()}>Создать папку</Button>
                        <Input onChange={(event) => fileUploadHandler(event)} multiple="true" type="file" id="disk__upload-input" placeholder="Basic usage" hidden={true} />
                        <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>

                        {isAuth && <Search
                            className="search"
                            value={searchName}
                            placeholder="Поиск по названию"
                            onChange={(e) => onSearch(e)}
                            style={{ width: 200 }}/>}
                        
                        <Select className="sort" defaultValue={sort} style={{ width: 120 }} onChange={handleChange}>
                            <Option value="name">По имени</Option>
                            <Option value="type">По типу</Option>
                            <Option value="date">По дате</Option>
                        </Select>

                        <UnorderedListOutlined onClick={()=>{dispatch(setFileView('list'))}} style={{ fontSize: '28px' }} className="list"/>
                        <InsertRowAboveOutlined onClick={()=>{dispatch(setFileView('plate'))}} style={{ fontSize: '28px' }}/>
                    </div>
                </Col>
            </Row>
            <FileList />
            <Popup isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
            <Uploader />
        </div>
        :
        <div className="drop-area" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <DraggerComponent setDragEnter={setDragEnter} />
        </div>
    )
}

export default Disk;