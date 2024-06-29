import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/Quiz.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import questionImagePlaceholder from '../Assets/board.jpg'; // Placeholder image

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
                    quizData.mcqQuizz.forEach(question => {
                        question.correctAnswer = question.correctAnswer.split(':')[0];
                        question.answers = question.answers.map(answer => answer.split(' ')[0]);
                    });
                    quizData.subjectiveQuizz = quizData.subjectiveQuizz || [];
                    setQuizDetails(quizData);
                    console.log(quizData);
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
        console.log(question);
    };

    const handleEditDescriptiveQuestion = (question) => {
        navigate(`/navigation/descriptive/${question.descriptiveQuestion_id}`, { state: { question } });
        console.log(question);
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

        console.log('Sending payload:', JSON.stringify(payload));

        try {
            const response = await axios.post(apiUrl, JSON.stringify(payload), {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API response:', response);

            if (response.status === 200) {
                // Update state to remove the deleted question
                setQuizDetails(prevDetails => {
                    const updatedMcqQuizz = prevDetails.mcqQuizz.filter(q => q.mcqQuestion_id !== questionId);
                    const updatedDescriptiveQuizz = prevDetails.descriptiveQuizz.filter(q => q.descriptiveQuestion_id !== questionId);
                    return {
                        ...prevDetails,
                        mcqQuizz: updatedMcqQuizz,
                        descriptiveQuizz: updatedDescriptiveQuizz
                    };
                });
                alert('Question deleted successfully');
                toast.success('Question deleted successfully');
            } else if (response.status === 404) {
                alert('Question not found');
                toast.warn('Question not found');
            } else if (response.status === 401) {
                alert('Authorization failed');
                toast.error('Authorization failed');
            } else if (response.status === 400) {
                alert('Bad request');
                toast.error('Bad request');
            } else {
                alert('An unexpected error occurred');
                toast.error('An unexpected error occurred');
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
            alert('An error occurred while deleting the question');
            toast.error('An error occurred while deleting the question');
        }
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
    
    const isImageURL = (url) => {
        return /\.(jpeg|jpg|gif|png)$/.test(url);
    };
    
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
                    <p>Completed: {quizDetails.isCompleted ? 'Yes' : 'No'}</p>
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
                                            <h5 className="question-mcq"></h5>
                                            <p>
                                                <strong>Question {index + 1}:</strong> {question.question}
                                            </p>
                                            {question.image ? (
                                                <img src={question.image} alt={`Question ${index + 1}`} className="question-image" />
                                            ) : (
                                                <img src={questionImagePlaceholder} alt="Placeholder" className="question-image" />
                                            )}
                                            <p>
                                                <strong>Options:</strong>
                                                {question.answers.map((answer, i) => (
                                                    <div key={i}>
                                                        <strong>Option {i + 1}:</strong> {isImageURL(answer) ? (
                                                            <img src={answer} alt={`Option ${i + 1}`} className="option-image" />
                                                        ) : (
                                                            answer
                                                        )}
                                                    </div>
                                                ))}
                                            </p>
                                            <p>
                                                <strong>Description:</strong> {question.description}
                                            </p>
                                            <p>
                                                <strong>Correct Answer:</strong> {question.correctAnswer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {quizDetails.descriptiveQuizz && quizDetails.descriptiveQuizz.length > 0 && (
                            <div>
                                <h3 className="QuizDes">Subjective Questions</h3>
                                {quizDetails.descriptiveQuizz.map((question, index) => (
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
                                            <h5 className="question-des"></h5>
                                            <p>
                                                <strong>Question {index + 1}:</strong> {question.question}
                                            </p>
                                            {question.image ? (
                                                <img src={question.image} alt={`Question ${index + 1}`} className="question-image" />
                                            ) : (
                                                <img src={questionImagePlaceholder} alt="Placeholder" className="question-image" />
                                            )}
                                            <p>
                                                <strong>Answer:</strong> {question.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
