import React from 'react';
import { useDispatch } from 'react-redux';
import "./uploader.less";
import { removeUploadFile } from "../../../reducers/uploadReducer";

const UploadFile = ({ file }) => {
    const dispatch = useDispatch();
    return (
        <>
            <div className='upload-file'>
                <div className="upload-file__name">{file.name}</div>

                <button onClick={()=>{dispatch(removeUploadFile(file.id))}} className="upload-file__remove">x</button>

                <div className="upload-file__progress-bar">
                    <div className="upload-file__upload-bar" style={{width:file.progress + "%"}}/>
                    <div className="upload-file__percent">{file.progress}%</div>
                </div>
            </div>
        </>
    );
};

export default UploadFile;
