import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { deleteAvatar, uploadAvatar } from "../../actions/user";
import { API_URL } from "../../config";

const Profile = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const [user, setUser] = useState();

    const avatarUploadHandler = (event) => {
        const file = event.target.files[0];
        dispatch(uploadAvatar(file));
    }

    return (
        <>
            {currentUser.avatar ? <Avatar src={`${API_URL + currentUser.avatar}`} style={{ verticalAlign: 'middle' }} shape="square" size={128} /> : <Avatar icon={<UserOutlined />} style={{ verticalAlign: 'middle' }} shape="square" size={128} />} 
            <Button
                size="small"
                style={{ margin: '0 16px', verticalAlign: 'middle' }}
                onClick={()=>dispatch(deleteAvatar())}
            >
                Удалить аватар
            </Button>
            <Input 
            accept="image/*"
            onChange={(event) => avatarUploadHandler(event)} 
            type="file" 
            id="profile__upload-input" 
            placeholder="Загрузить аватар" 
            hidden={true} />
            <label htmlFor="profile__upload-input" className="profile__upload-label">Загрузить аватар</label>
        </>
    )
}

export default Profile