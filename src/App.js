import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Apply from './Apply';
import Registration from './Registration'; 
import Login from './Components/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Apply />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/Login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
