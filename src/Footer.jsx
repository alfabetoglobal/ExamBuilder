import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

library.add(faFacebookF, faTwitter, faLinkedinIn);

const Footer = ({ hide }) => {
  if (hide) {
    return null; 
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>Address: Delhi,India</p>
          <p>Phone: +91 9900775496</p>
          <p>Email: info@myeducationalsite.com</p>
          <p>Copyright © 2024 My Educational Site|All rights reserved.</p>
        </div>
        <div className="footer-right">
          <nav>
            {/* <ul>
              <li><a href="/">Register Now</a></li>
              <li><a href="/login">LogIn</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul> */}
          </nav>
          <div className="social-links">
            <a href="https://www.facebook.com/your-page" className="social-link">
              <FontAwesomeIcon icon={['fab', 'facebook-f']} />
            </a>
            <a href="https://twitter.com/your-handle" className="social-link">
              <FontAwesomeIcon icon={['fab', 'twitter']} />
            </a>
            <a href="https://www.linkedin.com/in/your-profile" className="social-link">
              <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
