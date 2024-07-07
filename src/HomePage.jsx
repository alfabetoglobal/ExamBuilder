import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div>
      <Header /> {/* Header is rendered only on the homepage */}
      <main className="home-page">
        <div className="content-wrapper">
        <h2>"Online Exam Generator"</h2>
          <p className="animate-text">
          Create Online exams/Tests/Quizes with our Easy Exam Builder.
        </p>
          {/* Link to register page */}
          <Link to="/register" className="register-button">Sign Up</Link>
        </div>
      </main>
      <Footer /> {/* Footer is rendered only on the homepage */}
    </div>
  );
};

export default HomePage;
