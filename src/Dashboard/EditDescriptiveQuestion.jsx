import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/EditDescriptiveQuestion.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDescriptiveQuestion = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questionId, setQuestionId] = useState('');

    useEffect(() => {
        if (location.state && location.state.question) {
            const questionData = location.state.question;
            setQuestion(questionData.question);
            setAnswer(questionData.answer);
            setQuestionId(questionData.descriptiveQuestion_id);
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
                        setAnswer(questionData.answer);
                        setQuestionId(questionData.descriptiveQuestion_id);
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
                    answer: answer
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
        <div className="container-EditDescriptiveQuestion">
             <ToastContainer />
            <h2>Edit Subjective Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-editDES">
                    <label>Question:</label>
                    <input
                        className="form-control-Des"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-editDES">
                    <label>Answer:</label>
                    <textarea
                        className="form-control-Des"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submitbtn">Update Question</button>
            </form>
        </div>
    );
};

export default EditDescriptiveQuestion;
