
import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';

const Navbar = () => {
    const [isHidden, setIsHidden] = useState(false); // State to manage navbar visibility
    let lastScrollTop = 0; // Keeps track of the last scroll position

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop > lastScrollTop) {
                // Scrolling down
                setIsHidden(true);
            } else {
                // Scrolling up
                setIsHidden(false);
            }

            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

  return (
        <nav className={`navbar ${isHidden ? 'hidden' : ''}`}>
            <ul className="navbar-menu">
                <li><Link to="home" smooth={true} duration={500}>Home</Link></li>
                <li><Link to="about" smooth={true} duration={500}>About</Link></li>
                <li><Link to="feature" smooth={true} duration={500}>Features</Link></li>
                <li><Link to="help" smooth={true} duration={500}>Help</Link></li>
            </ul>
            <button className="login-button">Login</button> {/* Added Login Button */}
        </nav>
    );
};

export default Navbar;
