import React, { useState } from 'react';
import SideBar from './SideBar';
import CreateExam from './CreateExam';
import ExamForm from './ExamForm';
import '../css/Navigation.css';
import Navbar from './NavBar';

const Navigation = () => {
  const [showExamForm, setShowExamForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStartExam = () => {
    setShowExamForm(true);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div className="navigation-container">
        <SideBar isOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          {showExamForm ? <ExamForm /> : <CreateExam onStartExam={handleStartExam} />}
        </div>
      </div>
    </>
  );
};

export default Navigation;
