import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/Quiz.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchQuizDetails = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                setLoading(false);
                return;
            }

            const apiUrl = 'https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/singleview/dashbordQuizzinfo';
            const payload = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: id
                })
            };

            try {
                const response = await axios.post(apiUrl, payload);

                if (response.data && response.data.body) {
                    const quizData = response.data.body;

                    // Ensure descriptiveQuizz is initialized as an empty array if undefined or null
                    quizData.descriptiveQuizz = quizData.descriptiveQuizz || [];

                    setQuizDetails(quizData);
                    toast.success('Quiz details fetched successfully');
                } else {
                    console.warn('No data received:', response);
                    toast.warn('No data received');
                }
            } catch (error) {
                console.error('Failed to fetch quiz details:', error);
                setError(error.message);
                toast.error('Failed to fetch quiz details');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetails();
    }, [id]);

    const handleEditMcqQuestion = (question) => {
     
        navigate(`/navigation/mcq/${question.mcqQuestion_id}`, { state: { question } });
    };

    const handleEditDescriptiveQuestion = (question) => {
        navigate(`/navigation/descriptive/${question.descriptiveQuestion_id}`, { state: { question } });
    };

    const handleDeleteQuestion = async (questionId) => {
        const token = localStorage.getItem('token');
        const apiUrl = 'https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/dashdel/dashquestiondel';
        const payload = {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questionId })
        };

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Update state to remove the deleted question
                setQuizDetails(prevDetails => ({
                    ...prevDetails,
                    mcqQuizz: prevDetails.mcqQuizz.filter(q => q.mcqQuestion_id !== questionId),
                    descriptiveQuizz: prevDetails.descriptiveQuizz.filter(q => q.descriptiveQuestion_id !== questionId)
                }));
                toast.success('Question deleted successfully');
            } else {
                handleApiErrors(response.status);
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
            handleApiErrors(error.response.status);
        }
    };

    const handleApiErrors = (status) => {
        let message;
        switch (status) {
            case 404:
                message = 'Question not found';
                break;
            case 401:
                message = 'Authorization failed';
                break;
            case 400:
                message = 'Bad request';
                break;
            default:
                message = 'An unexpected error occurred';
        }
        toast.error(message);
    };

    if (loading) {
        return (
            <div className="loader-overlay">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!quizDetails) {
        return <div>No quiz details available</div>;
    }

    

    return (
        <div className="container-quiz">
            <ToastContainer />
            <div className="card mt-3">
                <div className="card-header">
                    <button className="back-button" onClick={() => window.history.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>
                <div className="card-body">
                    <h2 className="quizdetailheading">{quizDetails.quizTitle}</h2>
                    <p>Created by: {quizDetails.creatorName}</p>
                    <p className={`statusheading ${quizDetails.status ? 'active' : 'inactive'}`}>
                        Status: {quizDetails.status ? 'Active' : 'Inactive'}
                    </p>
                    <p>Completed: {quizDetails.isCompleted === 'Incomplete' ? 'No' : 'Yes'}</p>
                    <div className="QuizDis" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {quizDetails.mcqQuizz && quizDetails.mcqQuizz.length > 0 && (
                            <div>
                                <h3 className="QuizMcq">MCQ Questions</h3>
                                {quizDetails.mcqQuizz.map((question, index) => (
                                    <div key={question.mcqQuestion_id} className="card mb-3">
                                        <div className="card-header Quizicon">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditMcqQuestion(question)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteQuestion(question.mcqQuestion_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="question-mcq">Question {index + 1}</h5>
                                            <p><strong>Question:</strong> {question.question}</p>
                                            {/* {question.questionImageLink && (
                                                <div className="image-container">
                                                    <img src={question.questionImageLink} alt={`Question ${index + 1}`} className="question-image" />
                                                </div>
                                            )} */}
                                            <div className="options-container">
                                                <h5>Options:</h5>
                                                <ol>
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={option._id} className="option-row">
                                                            <span>
                                                                {option.answer}
                                           {/* {option.answerImageLink && (
                                               <div className="image-container">
                                                <img src={option.answerImageLink} alt={`Option ${optionIndex + 1}`} className="option-image" />
                                              </div>
                                            )} */}
                                                    </span>
                                                    </li>
                                                    ))}
                                                </ol>
                                            </div>

                                            {/* <p><strong>Description:</strong> {question.description}</p> */}

                                            <p><strong>Description:</strong> {question.answerDescription}</p>
                                            <p>
                                                <strong>Correct Answer:</strong>{' '}
                                                {question.options.find(option => option._id === question.correctAnswer)?.answer}
                                                {/* {question.options.find(option => option._id === question.correctAnswer)?.answerImageLink && (
                                                    <div className="image-container">
                                                        <img src={question.options.find(option => option._id === question.correctAnswer)?.answerImageLink} alt="Correct Answer" className="correct-answer-image" />
                                                    </div>
                                                )} */}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div>
                            <h3 className="QuizDes">Subjective Questions</h3>
                            {quizDetails.descriptiveQuizz && quizDetails.descriptiveQuizz.length > 0 ? (
                                quizDetails.descriptiveQuizz.map((question, index) => (
                                    <div key={question.descriptiveQuestion_id} className="card mb-3">
                                        <div className="card-header Quizicon">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditDescriptiveQuestion(question)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteQuestion(question.descriptiveQuestion_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="question-des">Question {index + 1}</h5>

                                            <p><strong>Question:</strong> {question.question}</p>
                                            {/* {question.questionImageLink && (
                                                <img src={question.questionImageLink} alt={`Question ${index + 1}`} className="question-image" />
                                            )} */}

                                            <p><strong>Description:</strong> {question.answer}</p>
                                            {question.marks && <p><strong>Marks:</strong> {question.marks}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No subjective questions available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
