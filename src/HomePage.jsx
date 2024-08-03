
import React, { useState } from 'react';
import './HomePage.css';
import Navbar from './Navbar';
import AboutUsPage from './AboutUsPage';
import FeaturesPage from './FeaturesPage';
import HelpPage from './HelpPage';
import Footer from './Footer';

// Import your images
import image1 from './student1.jpg';
import image2 from './student2.jpg';
import image3 from './student5.jpg';
import image4 from './student4.jpg';
import image5 from './student8.jpg';
import image6 from './student9.jpg';
import think from './think.jpg';
import temp from './temp.jpeg';

const images = [
    image1, image2, image3, image4, image5, image6
];

const HomePage = () => {
    const [showWhyChooseUs, setShowWhyChooseUs] = useState(false);

    const handleWhyChooseUsClick = () => {
        setShowWhyChooseUs(!showWhyChooseUs);
    };

    return (


        <div>
            <Navbar />
            <section id="home">



                <div className="home-container">
                    <div className="header-content">
                        {/* <h1 className="heading">Welcome to the Student Exam Portal</h1> */}
                        <p className="para">Your gateway to manage and take exams efficiently</p>
                        <div className="login-options">
                            <a href="/student-login" className="btn">Register Here</a>

                        </div>
                    </div>
                </div>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-content">
                        <div className="about-image">
                            <img src={temp} alt="About Us" />
                        </div>
                        <div className="about-text">
                            <h2>About Us</h2>
                            <h3>Best Software For Your Evaluation</h3>
                            <p>
                                Experience the ultimate solution in online examination systems!
                                Our innovative online exam builder empowers you to effortlessly
                                create engaging exams tailored to any difficulty level. Say goodbye
                                to outdated methods and hello to a seamless, intuitive process.
                            </p>
                            <p>
                                With our platform, you can design comprehensive online exams and tests
                                with unmatched ease, ensuring your users receive constructive feedback
                                that enriches their learning journey. Elevate your assessment capabilities
                                and provide an exceptional educational experience that inspires and motivates.
                            </p>
                            <p>
                                This is the last online exam system you'll ever need!
                            </p>
                            <a href="#why-choose-us" className="btn-about" onClick={handleWhyChooseUsClick}>Why Choose Us ?</a>
                            {/* <div className="think">
                        <img src={think} />
                    </div> */}

                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                {showWhyChooseUs && (
                    <section id="why-choose-us" className="why-choose-us">
                        <div className="why-choose-us-content">
                            <blockquote className="highlighted-text">
                                Are you searching for robust testing software for your students? <br />
                                Need a streamlined way to distribute certificates?
                            </blockquote>
                            <p className="chooseus">
                                Whether you’re looking to effortlessly set up exam software and invite participants or integrate your testing system with your existing software, our Online Exam Builder has you covered.
                            </p>
                            <p className="chooseus">
                                Start using our Online Exam Builder and unlock a world of possibilities. Explore our comprehensive features and solutions designed to meet all your examination needs. With our tool, everything is within reach, making your testing process efficient, effective, and user-friendly.
                            </p>
                            <div className="cards-container">
                                <div className="card">
                                    <div className="card-content">
                                        <h3>Effortless to Use our service</h3>
                                        <p>
                                            Our exam builder is designed with simplicity in mind, making it incredibly easy to use for both students and administrators.
                                            Starting with our online exam builder is a breeze, adding a touch of fun to the process.
                                        </p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-content">
                                        <h3>Stunning on All Devices</h3>
                                        <p>
                                            Whether you're on a phone, tablet, or PC, your online exams will look fantastic. Our examination system is fully responsive,
                                            ensuring a seamless and visually appealing experience across all platforms.
                                        </p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-content">
                                        <h3>Exceptional Support</h3>
                                        <p>
                                            Got questions about our online examination software? Our dedicated support team, fondly known as our support owls, is always ready
                                            to assist you. Expect the best possible support to help you every step of the way!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="chooseus">
                                Discover how our tool can be the perfect solution for you. Our demo will provide you with all the insights you need. Don't wait—it's completely free! Visit our demo page now.
                            </p>
                            <a href="/demo" className="btn-about">Visit Demo Page</a>
                        </div>
                    </section>
                )}
                <AboutUsPage />
                <FeaturesPage />
                <HelpPage />

                <section className="gallery-section">
                    <p className="gallery-heading">ExamBuilder Gallery</p>
                    <div className="gallery-container">
                        {images.map((image, index) => (
                            <div key={index} className="gallery-item">
                                <img src={image} alt={`Gallery Item ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </section>

            </section>
            <Footer />
        </div>
    );
};

export default HomePage;
