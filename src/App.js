import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import React from 'react';
// import StudentLogin from './StudentLogin';
// import AdminLogin from './AdminLogin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
