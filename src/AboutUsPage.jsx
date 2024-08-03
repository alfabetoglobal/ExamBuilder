// AboutUsPage.jsx
import React from 'react';
import './AboutUsPage.css'; // Ensure this path is correct

const AboutUsPage = () => {
    return (
        <section id="about" className="about-us-page">
            <div className="about-us-content">
                <h2>About ExamBuilder</h2>
                <div className="floating-sections">
                    <div className="section">
                        <h3>What We Do</h3>
                        <p>
                            Building the World's Most Effective LMS. Our goal is simple: to create the most effective Learning Management System (LMS) in the world. We empower organizations to effortlessly create, manage, and distribute training materials, enabling employees to learn independently and with focus. To achieve this, we are committed to one thing above all: delivering quality. And that is exactly what we do, every single time.
                        </p>
                        <a href="#" className="btn-about">Know More</a>
                    </div>

                    <div className="section">
                        <h3>Who We Are</h3>
                        <p>
                            A Bunch of Smart Web Owls. We are an international team of tech and service professionals dedicated to helping others upskill and grow. Most of us are Dutch, bringing a down-to-earth approach without the clogs. Our team also includes members from Brazil, adding a touch of groove; the USA, bringing confidence; Germany, offering punctuality; and England, instilling discipline. What unites us all is a shared passion for learning and innovation.
                        </p>
                        <a href="#" className="btn-about">Meet Our Team</a>
                    </div>

                    <div className="section">
                        <h3>How We Work</h3>
                        <p>
                            Partnering with Small and Medium-Sized Businesses. Our approach is customer-centered, designed to meet the specific needs of small and medium-sized businesses. Your feedback is invaluable to us, guiding the enhancement of existing features and the creation of extraordinary new ones. We prioritize our tasks and continuously innovate our processes to deliver the best possible service. And of course, we make time for fun, because we believe that work should be enjoyable too.
                        </p>
                        <a href="#" className="btn-about">More About How We Work</a>
                    </div>

                    <div className="section">
                        <h3>Office</h3>
                        <p>
                            The Nest from Which We Operate. Nestled in the NCT of India, our office is designed to foster a healthy, inspiring, and sustainable work environment. We take pride in our green initiatives and have created a space where we can focus, engage in meaningful discussions, and celebrate our successes. We also embrace hybrid working, supporting both in-office and remote work to ensure flexibility and balance for our team.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsPage;
