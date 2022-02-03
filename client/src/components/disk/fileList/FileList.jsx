import React from "react";
import { Table, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import "./fileList.less";
import { FolderOutlined } from '@ant-design/icons';
import { setCurrentDir } from "../../../reducers/fileReducer";
import { pushToStack } from "../../../reducers/fileReducer";
import { downloadFile } from "../../../actions/file";

const FileList = () => {
    const files = useSelector(state => state.files.files);
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);

    const filesStateFormated = files.map(file => {
        const downloadClickHandler = (e) => {
            e.stopPropagation();
            downloadFile(file);
        }

        const container = {};

        container.img = <FolderOutlined style={{ fontSize: '35px', color: '#08c' }} />;
        container.name = file.name;
        container.date = file.date.slice(0, 10);
        container.size = file.size;
        container.id = file._id;
        container.type = file.type;
        container.download = <Button onClick={(e) => downloadClickHandler(e)} type="text">Скачать</Button>;
        container.delete = <Button type="text">Удалить</Button>;


        return container;
    })

    const openDirHandler = (record, rowIndex) => {
        if (record.type === 'dir') {
            dispatch(pushToStack(currentDir));
            dispatch(setCurrentDir(record.id));
        }
    }

    const columns = [
        {
            title: '', //название колонки
            dataIndex: 'img', // это название поля объекта файла
            key: 'img' //просто совпадает с dataIndex
        },
        {
            title: 'Название', //название колонки
            dataIndex: 'name', // это название поля объекта файла
            key: 'name' //просто совпадает с dataIndex
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size'
        }
        ,
        {
            title: '',
            dataIndex: 'download',
            key: 'download'
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete'
        }
    ]

    return (
        <Table onRow={(record, rowIndex) => {
            return {
                onClick: event => { openDirHandler(record, rowIndex) }, // click row
            };
        }}
            dataSource={filesStateFormated} columns={columns} className="table" />
    )
}

export default FileList;