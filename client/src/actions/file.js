import axios from "axios";
import { setFiles, addFile } from "../reducers/fileReducer";

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
            formData.append('file', JSON.stringify(file));
            //formData.append('file', file);
            if (dirId) {
                formData.append('parent', dirId);
            }
            for (let [name, value] of formData) {
                console.log(`${name} = ${value}`); // key1=value1, потом key2=value2
            }
            
            const response = await axios.post(`http://localhost:5000/api/files/upload`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    console.log('total', totalLength)
                    if (totalLength) {
                        let progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        console.log(progress)
                    }
                }
            });
            dispatch(addFile(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    }
}