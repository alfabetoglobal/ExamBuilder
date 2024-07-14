// import React, { useState, useEffect, useRef } from 'react';
// import './QuizSearch.css';
// import { Link } from 'react-router-dom';

// const QuizSearch = ({ onSubmit }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [quizzes, setQuizzes] = useState([]);
//     const searchRef = useRef(null);

//     useEffect(() => {
//         const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
//         setQuizzes(storedQuizzes);
//     }, []);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (onSubmit && typeof onSubmit === 'function') {
//             onSubmit(searchTerm);
//         }
//     };

//     const handleInputClick = () => {
//         setShowDropdown(true);
//     };

//     const handleQuizSelection = (quizTitle) => {
//         setSearchTerm(quizTitle);
//         setShowDropdown(false);
//     };

//     const handleOutsideClick = (e) => {
//         if (searchRef.current && !searchRef.current.contains(e.target)) {
//             setShowDropdown(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleOutsideClick);
//         return () => {
//             document.removeEventListener('mousedown', handleOutsideClick);
//         };
//     }, []);

//     const filteredQuizzes = quizzes.filter((quiz) =>
//         quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Determine if Submit button should be disabled
//     const isSubmitDisabled = searchTerm === '';

//     return (
//         <div className="quiz-search-container">
//             <form onSubmit={handleSubmit} className="quiz-search-form">
//                 <div className="search-box" ref={searchRef}>
//                     <input
//                         type="text"
//                         placeholder="Search quizzes..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onClick={handleInputClick}
//                         className="search-input"
//                     />
//                     {showDropdown && (
//                         <div className="dropdown-content">
//                             {filteredQuizzes.map((quiz) => (
//                                 <div
//                                     key={quiz.quizId}
//                                     className="quiz-item"
//                                     onClick={() => handleQuizSelection(quiz.quizTitle)}
//                                 >
//                                     {quiz.quizTitle}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//                 <Link to={isSubmitDisabled ? "#" : "/StudentForm"} className="student-form-link">
//                     <button type="submit" className="search-button" disabled={isSubmitDisabled}>
//                         Submit
//                     </button>
//                 </Link>
//             </form>
//         </div>
//     );
// };

// export default QuizSearch;
import React, { useState, useEffect, useRef } from 'react';
import './QuizSearch.css';
import { Link } from 'react-router-dom';

const QuizSearch = ({ onSubmit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        setQuizzes(storedQuizzes);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit && typeof onSubmit === 'function') {
            onSubmit(searchTerm);
        }
    };

    const handleInputClick = () => {
        setShowDropdown(true);
    };

    const handleQuizSelection = (quiz) => {
        setSearchTerm(quiz.quizTitle);
        localStorage.setItem('selectedQuizId', quiz.quizId); // Save selected quiz ID to localStorage
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

    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Determine if Submit button should be disabled
    const isSubmitDisabled = searchTerm === '';

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
                            {filteredQuizzes.map((quiz) => (
                                <div
                                    key={quiz.quizId}
                                    className="quiz-item"
                                    onClick={() => handleQuizSelection(quiz)}
                                >
                                    {quiz.quizTitle}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Link to={isSubmitDisabled ? "#" : "/StudentForm"} className="student-form-link">
                    <button type="submit" className="search-button" disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </Link>
            </form>
        </div>
    );
};

export default QuizSearch;
