import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Row, Col } from 'antd';
import "./registration.less";
import {  login } from "../../actions/user";
import {useDispatch} from "react-redux";

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    return (
        <div className="registration">
            <Row className='regrow'>
                <Col className='regcol' span={12} offset={3}  justify="space-around" align="middle">
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[{ required: true, message: 'Введите email!' }]}
                        >
                            <Input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Введите пароль' }]}
                        >
                            <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit" onClick={()=> dispatch(login(email, password))}>
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row >
        </div>
    )
};

export default Login;
