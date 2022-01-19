import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "../src/components/registration/Registration";
import Grid from "../src/components/Grid";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Header />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/grid" element={<Grid />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
