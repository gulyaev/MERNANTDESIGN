import React from 'react';
import '../fileList.less';
import { Button } from 'antd';
import { FileOutlined, FolderFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";

const File = ({ file }) => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const fileView = useSelector(state => state.files.view)

    function openDirHandler(file) {
        if (file.type === 'dir') {
            dispatch(pushToStack(currentDir))
            dispatch(setCurrentDir(file._id))
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        downloadFile(file)
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        dispatch(deleteFile(file))
    }


    return (
        <div className='grid__file-plate' onClick={() => openDirHandler(file)}>
                <div className="grid__file-plate__image">{file.type === 'dir' ? <FolderFilled style={{ fontSize: '50px', color: '#08c' }} /> : <FileOutlined style={{ fontSize: '50px', color: '#08c' }} />}</div>
                <div className="grid__file-plate__name">{file.name}</div>
                <div className="grid__file-plate__btns">
                    {file.type !== 'dir' &&
                        <Button onClick={(e) => downloadClickHandler(e)} type="text">Скачать</Button>}
                    <Button onClick={(e) => deleteClickHandler(e)} type="text">Удалить</Button>
                </div>
        </div>
    );


};

export default File;