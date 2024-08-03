import React from 'react';
import './FeaturesPage.css';
import student3 from './student3.jpg';
import student5 from './student5.jpg';
import student9 from './student9.jpg';


const FeaturesPage = () => {
  return (
    <section id="feature" className="features-page">
    <div className="features-container">
        <h1>Features Page</h1>
      <div className="feature-section">
        <div className="feature-content left">
          <h2><span className="heading">Build Engaging Exams and Tests</span></h2>
          <ul className="feature-list">
            <li className="feature-item animate">
              <span className="highlight">Create Stunning Exams with Ease:</span> Craft the most beautiful and engaging exams using our intuitive cloud-based exam builder.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Challenge Your Students:</span> Utilize our exam builder to design engaging online exams that challenge and inspire your students.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Effortless to Use:</span> Create comprehensive tests within minutes with our user-friendly test maker.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Diverse Question Types:</span> Choose from multiple question types, including multiple choice, fill-in-the-blank, free text, video, and audio questions.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Efficient Question Bank:</span> Build a robust question bank to streamline your exam creation process.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Advanced Question Tagging:</span> Tag your questions for detailed analysis and advanced examination of your question bank.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Customize Exam Rules:</span> Set pass/fail criteria, number of attempts, and review options. The possibilities are endless.
            </li>
            <li className="feature-item animate">
              <span className="highlight">White Label LMS & Branding:</span> Embed exams on your own site and customize the styling to reflect your brand.
            </li>
            <li className="feature-item animate">
              <span className="highlight">No Limits:</span> Create unlimited online exams—never stop learning!
            </li>
          </ul>
        </div>
        <img src={student3} alt="Engaging Exams" className="feature-image right" />
      </div>

      <div className="feature-section">
        <img src={student5} alt="Engaging Exams" className="feature-image left" />
        <div className="feature-content right">
          <h2><span className="heading">Learn with Us</span></h2>
          <ul className="feature-list">
            <li className="feature-item animate">
              <span className="highlight">The Ultimate eLearning Experience:</span> Offer a distraction-free eLearning experience with our Exam Builder.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Know Your Users:</span> Gain deeper insights with our advanced user management system.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Invite Users Effortlessly:</span> Automate the invitation process with our cloud-based exam software.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Self-Registration:</span> Allow users to sign up for exams themselves, empowering them to take charge of their learning journey.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Learn Anywhere, Anytime:</span> Our exams are accessible on any device—desktop, tablet, or mobile.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Self-Paced Learning:</span> Encourage students to learn at their own pace for the best results.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Distraction-Free Learning:</span> Provide a distraction-free experience that enhances concentration and retention.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Seamless Integration:</span> Embed exams directly into your website or platform.
            </li>
          </ul>
        </div>
      </div>

      <div className="feature-section">
        <div className="feature-content left">
          <h2><span className="heading">Tracking & Reporting</span></h2>
          <ul className="feature-list">
            <li className="feature-item animate">
              <span className="highlight">Comprehensive Student Tracking:</span> Monitor your students' progress and download detailed results.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Progress Monitoring:</span> Track students' journey through exams and their progress.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Detailed Results:</span> Analyze results to identify areas needing extra support.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Insightful Stats:</span> Review exam statistics to uncover insights for improving learning materials.
            </li>
            <li className="feature-item animate">
              <span className="highlight">Traditional Printing:</span> Print exams the old-fashioned way for flexibility in managing assessments.
            </li>
          </ul>
        </div>
        <img src={student3} alt="Engaging Exams" className="feature-image right" />
      </div>
    </div>
  </section>
  );
};

export default FeaturesPage;
