import React from 'react';
import "./header.less";
import { PageHeader, Button, Typography, Row, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../config";

const { Paragraph } = Typography;


const routes = [
    {
        path: 'index',
        breadcrumbName: 'First-level Menu',
    },
    {
        path: 'first',
        breadcrumbName: 'Second-level Menu',
    },
    {
        path: 'second',
        breadcrumbName: 'Third-level Menu',
    },
];

const IconLink = ({ src, text }) => (
    <a className="example-link">
        <img className="example-link-icon" src={src} alt={text} />
        {text}
    </a>
);

const Header = () => {
    const isAuth = useSelector(state => state.user.isAuth);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);

    if (isAuth === true) {
        return (<>
            <PageHeader
            title="Title"
            subTitle="This is a subtitle"
            extra={[
                <NavLink to='/profile'>
                    {currentUser.avatar ? <Avatar src={`${API_URL + currentUser.avatar}`} size="large" /> : <Avatar icon={<UserOutlined />} size="large" />} 
                </NavLink>,
                <Button key="2">Выйти</Button>
            ]}
            breadcrumb={{ routes }}
            >
        </PageHeader>
        </>
        );
    } else {
    return (
        <PageHeader
            title="Title"
            subTitle="This is a subtitle"
            extra={[
                <Button key="2"><NavLink to="/login">Войти</NavLink></Button>,
                <Button key="1" type="primary"><NavLink to="/registration">Регистрация</NavLink></Button>
            ]}
            breadcrumb={{ routes }}
        >
        </PageHeader>
    );
}
};

export default Header;