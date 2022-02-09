import React from 'react';
import "./uploader.less";
import UploadFile from './UploadFile';
import { useSelector, useDispatch } from 'react-redux';
import { hideUploader } from '../../../reducers/uploadReducer';

const Uploader = () => {
    const files = useSelector(state=>state.upload.files);
    //const files = [{ id: 1, name: "file", progress: 35 }, { id: 1, name: "file", progress: 0 }];
    const isVisible = useSelector(state => state.upload.isVisible); 
    const dispatch = useDispatch();

    return ( isVisible &&
        <div className='uploader'>
            <div className="uploader__title">Загрузки</div>
            <button onClick={()=>dispatch(hideUploader())} className="uploader__close">x</button>
            <div className="uploader__content">
                {files.map(file =>
                    <UploadFile key={file.id} file={file} />
                )}
            </div>
        </div>
    );
};

export default Uploader;
