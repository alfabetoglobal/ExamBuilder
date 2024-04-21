import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Apply from './UserAuth/Apply';
import Registration from './UserAuth/Registration'; 
import Login from './UserAuth/Login';

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
