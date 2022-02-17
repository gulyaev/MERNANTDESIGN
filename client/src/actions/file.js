import axios from "axios";
import { hideLoader, showLoader } from "../reducers/appReducer";
import { setFiles, addFile } from "../reducers/fileReducer";
import { deleteFileAction } from "../reducers/fileReducer";
import { addUploadFile, changeUploadFile, showUploader } from "../reducers/uploadReducer";
import { API_URL } from "../config";

export const getFiles = (dirId, sort) => {
    return async dispatch => {
        try {
            dispatch(showLoader());
            let url = `${API_URL}api/files`;
            if (dirId){
                url = `${API_URL}api/files?parent=${dirId}`;
            }
            if (sort){
                url = `${API_URL}api/files?sort=${sort}`;
            }
            if (dirId && sort){
                url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(setFiles(response.data.files));
            console.log(response.data);
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            dispatch(hideLoader());
        }
    }
}

export const createDir = (dirId, name) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/files`, {
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
            const response = await axios.post(`${API_URL}api/files/upload`, formData, {
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
    const responce = await fetch(`${API_URL}api/files/download?_id=${file._id}`, {
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
            const response = await axios.delete(`${API_URL}api/files?id=${file._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(deleteFileAction(file._id));
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}

export const searchFiles = (search) => {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/search?search=${search}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(setFiles(response.data));
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            //dispatch(hideLoader());
        }
    }
}