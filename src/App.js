import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import HomePage from './HomePage';
import Login from './Login';
import AboutUs from './Components/AboutUs';
import Register from './UserAuth/Register';
import Navigation from './Navigation'; 
import NavigationBar from './Dashboard/NavigationBar'; 



const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          {/* <Route path="/about" element={<AboutUs />} /> */}
          <Route path="/navigation/*" element={<Navigation />} />
          <Route path="/NavigationBar" element={<NavigationBar />} />  
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;
