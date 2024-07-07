import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaEllipsisV } from 'react-icons/fa';
import '../css/Navigation.css';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/navigation/profile');
  };

  return (
    <nav className={`custom-navbar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="container-fluid">
        <div className="toggle-sidebar-btn" onClick={toggleSidebar}>
          <FaBars />
        </div>
        <div className="dropdown ms-auto">
          <button
            className="dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            onClick={toggleDropdown}
          >
            <FaEllipsisV />
          </button>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
            <button className="dropdown-item" type="button" onClick={handleProfileClick}>Profile</button>
            <button className="dropdown-item" type="button" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
