import React from "react";
import { Table, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import "./fileList.less";
import { FileOutlined, FolderFilled } from '@ant-design/icons';
import { setCurrentDir } from "../../../reducers/fileReducer";
import { pushToStack } from "../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../actions/file";
import sizeFormat from "../../../utils/sizeFormat";
import File from './file/File';

const FileList = () => {
    const files = useSelector(state => state.files.files);
    const currentDir = useSelector(state => state.files.currentDir);
    const fileView = useSelector(state => state.files.view);
    const dispatch = useDispatch();

    const filesStateFormated = files.map(file => {
        const downloadClickHandler = (e) => {
            e.stopPropagation();
            downloadFile(file);
        }

        const deleteClickHandler = (e) => {
            e.stopPropagation();
            dispatch(deleteFile(file));
        }

        const container = {};

        container.key = file._id;
        if (file.type === 'dir') {
            container.img = <FolderFilled style={{ fontSize: '35px', color: '#08c' }} />;
        } else {
            container.img = <FileOutlined style={{ fontSize: '35px', color: '#08c' }} />;
        }
        container.name = file.name;
        container.date = file.date.slice(0, 10);
        container.size = sizeFormat(file.size);
        container.id = file._id;
        container.type = file.type;
        container.download = <Button onClick={(e) => downloadClickHandler(e)} type="text">Скачать</Button>;
        container.delete = <Button onClick={(e) => deleteClickHandler(e)} type="text">Удалить</Button>;


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
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type'
        },
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

    if (files.length == 0) {
        return (
            <div className="loader">Файлы не найдены</div>
        )
    }

    if (fileView === 'plate') {
        return (
            <div className="grid">
                {files.map(file => 
                <File key={file._id} file={file}/>)}
            </div>
        )
    }

    if (fileView === 'list') {
        return (
            <Table onRow={(record, rowIndex) => {
                return {
                    onClick: event => { openDirHandler(record, rowIndex) }, // click row
                };
            }}
                dataSource={filesStateFormated} columns={columns} className="table" />
        )
    }
}

export default FileList;