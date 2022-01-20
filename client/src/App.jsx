import React, { useEffect } from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "../src/components/registration/Registration";
import Grid from "../src/components/Grid";
import { Row, Col } from 'antd';
import "./app.less";
import Login from './components/registration/Login';
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./actions/user";

function App() {
  const isAuth = useSelector(state => state.user.isAuth);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(auth())
  }, [])

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Row>
          <Col span={18} offset={3}>
            <Header />
            {!isAuth &&
              <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            }
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

export default App;
