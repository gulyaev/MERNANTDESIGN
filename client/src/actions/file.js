import axios from "axios";
import { setFiles, addFile } from "../reducers/fileReducer";
import { deleteFileAction } from "../reducers/fileReducer";
import { addUploadFile, changeUploadFile, showUploader } from "../reducers/uploadReducer";

export const getFiles = (dirId) => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:5000/api/files${dirId ? '?parent=' + dirId : ''}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(setFiles(response.data.files));
            console.log(response.data);
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}

export const createDir = (dirId, name) => {
    return async dispatch => {
        try {
            const response = await axios.post(`http://localhost:5000/api/files`, {
                name,
                parent: dirId,
                type: 'dir'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(addFile(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}

export const uploadFile = (file, dirId) => {
    return async dispatch => {
        try {
            const formData = new FormData();
            //formData.append('file', JSON.stringify(file));
            formData.append('file', file);
            if (dirId) {
                formData.append('parent', dirId);
                console.log("dirId" + dirId);
            }
            for (let [name, value] of formData) {
                console.log(`fdfs + ${name} = ${value}`); // key1=value1, потом key2=value2
            }
            const uploadFile = {name:file.name, progress:0, id: Date.now()};
            dispatch(showUploader());
            dispatch(addUploadFile(uploadFile));
            const response = await axios.post(`http://localhost:5000/api/files/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json"
                },
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    console.log('total', totalLength);
                    if (totalLength) {
                        uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength);
                        dispatch(changeUploadFile(uploadFile));
                    }
                }
            });
            dispatch(addFile(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}

export const downloadFile = async (file) => {
    const responce = await fetch(`http://localhost:5000/api/files/download?_id=${file._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (responce.status === 200) {
        const blob = await responce.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}

export const deleteFile = (file) => {
    return async dispatch => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/files?id=${file._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(deleteFileAction(file._id));
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}