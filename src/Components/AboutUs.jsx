import React from 'react';
import Header from '../Header';
import './About.css';
import teamPhoto from '../Assets/team.jpg';
import learningExperienceImage from '../Assets/learning.jpg';
import platformScreenshotImage from '../Assets/platform.jpg';

const AboutUs = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="about-us-container">
        <div className="about-us-section">
          <div className="about-us-header">
            <h1>About Us</h1>
            {/* <img src={teamPhoto} alt="Our Team" className="team-photo" /> */}
          </div>
        </div>

        <div className="about-us-section">
          <div className="about-us-content">
            <div className="about-us-text">
              <h2 className="MissionAbout">Our Mission</h2>
              <p>
                We are a team of experienced educators, developers, and designers who are passionate about creating engaging and effective online learning experiences. Our mission is to help educators and learners of all ages and backgrounds succeed in the digital age.
              </p>
            </div>
            <div className="about-us-image">
              <img src={learningExperienceImage} alt="Learning Experience" className="learning-experience" />
            </div>
          </div>
        </div>

        <div className="about-us-section">
          <div className="about-us-content">
            <div className="about-us-text">
              <h2 className="PlatformAbout">Our Platform</h2>
              <p>
                Our platform offers a wide range of features and tools to help educators create and deliver high-quality online courses, assessments, and other learning materials. We also provide learners with a variety of resources and support to help them achieve their learning goals.
              </p>
            </div>
            <div className="about-us-image">
              <img src={platformScreenshotImage} alt="Platform Screenshot" className="platform-screenshot" />
            </div>
          </div>
        </div>

        <div className="about-us-section">
          <div className="about-us-content">
            <div className="about-us-text">
             
              <p>
                Thank you for choosing Online Exam Builder. We are committed to providing you with the best possible learning experience, and we look forward to helping you succeed.
              </p>
            </div>
            <div className="about-us-image">
            <img src={teamPhoto} alt="Our Team" className="team-photo" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
