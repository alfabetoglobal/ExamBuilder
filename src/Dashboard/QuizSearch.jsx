import React, { useState, useEffect, useRef } from 'react';
import '../css/QuizSearch.css';
import quizData from '../quizzes.json'; // Adjust path based on actual location
import { Link } from 'react-router-dom';

const QuizSearch = ({ onSubmit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [quizOptions, setQuizOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        // Simulate fetching quiz names from JSON file
        setQuizOptions(quizData);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(searchTerm); // Ensure onSubmit is a function passed from parent component
    };

    const handleInputClick = () => {
        setShowDropdown(true);
    };

    const handleQuizSelection = (quizTitle) => {
        setSearchTerm(quizTitle);
        setShowDropdown(false);
    };

    const handleOutsideClick = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="quiz-search-container">
            <form onSubmit={handleSubmit} className="quiz-search-form">
                <div className="search-box" ref={searchRef}>
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={handleInputClick}
                        className="search-input"
                    />
                    {showDropdown && (
                        <div className="dropdown-content">
                            {quizOptions.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    onClick={() => handleQuizSelection(quiz.quizTitle)}
                                    className="quiz-item"
                                >
                                    {quiz.quizTitle}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/navigation/LoginPage" style={{ color: 'white', textDecoration: 'none' }}>
                    <button type="submit" className="search-button">
                        Submit
                    </button>
                </Link>
            </form>
        </div>
    );
};

export default QuizSearch;
