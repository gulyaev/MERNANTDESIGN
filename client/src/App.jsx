import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "../src/components/registration/Registration";
import Grid from "../src/components/Grid";
import { Row, Col } from 'antd';
import "./app.less";


function App() {
  return (
    <BrowserRouter>
    <div className="wrapper">
      <Row>
        <Col span={18} offset={3}>
          <Routes>
            <Route exact path="/" element={<Header />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/grid" element={<Grid />} />
          </Routes>
        </Col>
      </Row>
      </div>
    </BrowserRouter>
  );
}

export default App;
