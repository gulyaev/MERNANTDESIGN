import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Row, Col } from 'antd';
import "./app.less";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./actions/user";
import Header from './components/Header';
import Registration from "../src/components/registration/Registration";
import Login from './components/registration/Login';
import Disk from "../src/components/disk/Disk";
import Profile from "../src/components/profile/Profile";

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
            {!isAuth ?
              <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
              :
              <>
              <Header />
              <Routes>
                <Route exact path="/" element={<Disk />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route exact path="/profile" element={<Profile />} />
              </Routes>
              </>
            }
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

export default App;
