import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './Test';
import './App.css';
import Login from './Login';
import QuizSearch from './QuizSearch';
import StudentForm from './StudentForm';
import InstructionsPage from './InstructionsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/quizsearch" element={<QuizSearch />} />
          <Route path="/StudentForm" element={<StudentForm />} />
          <Route path="/InStructionsPage" element={<InstructionsPage />} />
          <Route path="/Test" element={<Test />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
