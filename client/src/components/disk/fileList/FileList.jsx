import React from "react";
import { Table } from 'antd';
import { useSelector } from "react-redux";
import "./filelist.less";
import { FolderOutlined } from '@ant-design/icons';

const FileList = () => {
    const files = useSelector(state => state.files.files);

    const filesStateFormated = files.map(file => {
        const container = {};

        container.img = <FolderOutlined style={{ fontSize: '35px', color: '#08c' }} />;
        container.name = file.name;
        container.date = file.date.slice(0, 10);
        container.size = file.size;

        return container;
    })

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
    ]

    return (
        <Table dataSource={filesStateFormated} columns={columns} className="table"/>
    )
}

export default FileList;