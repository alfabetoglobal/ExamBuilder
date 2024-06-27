import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/EditMcqQuestion.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditMcqQuestion = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questionId, setQuestionId] = useState('');

    useEffect(() => {
        if (location.state && location.state.question) {
            const questionData = location.state.question;
            setQuestion(questionData.question);
            setAnswers(questionData.answers);
            setCorrectAnswer(questionData.correctAnswer);
            setDescription(questionData.description);
            setQuestionId(questionData.mcqQuestion_id);
        } else {
            const fetchQuestionData = async () => {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Token not found in local storage');
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
                        const questionData = response.data.body;
                        setQuestion(questionData.question);
                        setAnswers(questionData.answers || ['', '', '', '']);
                        setCorrectAnswer(questionData.correctAnswer);
                        setDescription(questionData.description);
                        setQuestionId(questionData.mcqQuestion_id);
                        toast.success('Question details fetched successfully');

                    } else {
                        setError('No question data received from server');
                        toast.warn('No question data received from server');
                    }
                } catch (error) {
                    setError('Failed to fetch question details');
                    toast.error('Failed to fetch question details');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestionData();
        }
    }, [id, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setError('Token not found in local storage');
            return;
        }

        const apiUrl = `https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/userdashbordedit/dashbordquestionEdit`;

        const payload = {
            headers: {
                Authorization: token,
            },
            body: JSON.stringify({
                questionId: questionId,
                updatedQuestion: {
                    question: question,
                    answers: answers,
                    correctAnswer: correctAnswer,
                    description: description
                }
            })
        };

        try {
            console.log('Sending payload:', payload);

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API response:', response.data);
            toast.success('Question updated successfully');
            navigate(`/navigation/quiz/${id}`);
        } catch (error) {
            console.error('Failed to update question:', error);
            setError('Failed to update question');
            toast.error('Failed to update question');
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

    return (
        <div className="containerEditMcqQuestion">
             <ToastContainer />
            <h2>Edit MCQ Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-editMCQ">
                    <label htmlFor="questionInput">Question:</label>
                    <input
                        id="questionInput"
                        className="form-control"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-editMCQ">
                    <label htmlFor="answersInput">Answers:</label>
                    {answers.map((answer, index) => (
                        <input
                            key={index}
                            type="text"
                            className="form-control-mcq"
                            value={answer}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            required
                        />
                    ))}
                </div>
                <div className="form-group-editMCQ">
                    <label htmlFor="correctAnswerInput">Correct Answer:</label>
                    <input
                        id="correctAnswerInput"
                        type="text"
                        className="form-control-mcq"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-editMCQ">
                    <label htmlFor="descriptionInput">Description:</label>
                    <textarea
                        id="descriptionInput"
                        className="form-control-mcq"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="submitbtn">Update Question</button>
            </form>
        </div>
    );
};

export default EditMcqQuestion;
