import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrashAlt, faSearch, faFilter, faAngleLeft, faAngleRight, faGear } from '@fortawesome/free-solid-svg-icons';
import '../css/ExamCreation.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';

const CreateExam = ({ onStartExam }) => {
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [examDetails, setExamDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const fetchExamDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('email');

        if (!token || !userEmail) {
            console.error('Token or user email not found in local storage');
            setLoading(false);
            return;
        }

        const apiUrl = 'https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/userdetails/userDashboard';

        try {
            const requestBody = {
                userEmail: userEmail,
                page: currentPage,
                limit: itemsPerPage,
                isCompleted: filter === 'complete' ? 'Completed' : filter === 'incomplete' ? 'Incompleted' : undefined,
                status: filter === 'active' ? 'Active' : filter === 'inactive' ? 'Inactive' : undefined
            };

            console.log('Sending data:', JSON.stringify(requestBody));

            const response = await axios.post(
                apiUrl,
                JSON.stringify({
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
            );

            console.log('API Response:', response.data);

            const responseBody = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            console.log('API Response Body:', responseBody.body);

            if (responseBody.body && responseBody.body.quizzes) {
                setExamDetails(responseBody.body.quizzes);
                const totalCount = responseBody.body.pagination.totalQuizzes;
                const pages = responseBody.body.pagination.totalPages;
                setTotalPages(pages);

            } else {
                console.warn('No exams found in API response');
                setExamDetails([]);
                toast.warn('No exams found');
            }
        } catch (error) {
            console.error('Failed to fetch exam details:', error.response?.data || error.message);
            toast.error('Failed to fetch exam details');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchExamDetails();
    }, [filter, currentPage]);


    const handlePageChange = (page) => setCurrentPage(page);
    const handleStart = () => {
        onStartExam();
        setShowTitleModal(false);
    };

    const handleTitleSubmit = async (title) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token || !email) {
            console.error('Token or email not found in local storage');
            setLoading(false);
            return;
        }

        const apiUrl = 'https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/info/quizzIdentity';
        const payload = {
            headers: {
                'Authorization': token
            },
            body: JSON.stringify({
                quizTitle: title,
                creatorEmail: email
            })
        };

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = JSON.parse(response.data.body);
            const quizTitleFromResponse = responseData.quizTitle;
       
            console.log('API Response:', response);
            handleStart();
            navigate('/navigation/exam-form', { state: { quizTitle: quizTitleFromResponse } });
            toast.success('Exam created successfully');
        } catch (error) {
            console.error('Failed to create exam:', error);
            toast.error('Failed to create exam');
        } finally {
            setLoading(false);
        }
    };


    const handleView = (exam) => {
        navigate(`/navigation/quiz-detail/${exam.quizzId}`);
    };
    const handleEdit = (exam) => {
        navigate(`/navigation/edit-exam/${exam.quizzId}`, { state: { quiz: exam } });
    };
    // const handleSetting = (exam) => {
    //     navigate(`/navigation/exam-time/${exam.quizzId}`);
    // };
    const handleSetting = (exam) => {
        navigate(`/navigation/exam-time/${exam.quizzId}`, { state: { quizId: exam.quizzId }  });
        // console.log(exam.quizzId);
    };
    
      
    const handleDelete = async (exam) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            setLoading(false);
            return;
        }

        const apiUrl = 'https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/dashbord/dashDEL';
        const payload = {
            _id: exam.quizzId
        };

        try {
            const response = await axios.post(apiUrl, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseBody = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            if (response.status === 200 && responseBody.message === 'Quiz status updated to false successfully') {
                fetchExamDetails();
                toast.success('Quiz deleted successfully');
            } else {
                console.warn('Failed to delete quiz:', responseBody);
                toast.error('Failed to delete quiz');
            }
        } catch (error) {
            console.error('Failed to delete quiz:', error);
            toast.error('Failed to delete quiz');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="overview-container">
            <ToastContainer />
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <h2 className="overview">All Quizzes</h2>

            <div className="controls">
                <div className="filter-dropdown">
                    <button onClick={() => setFilter(filter === '' ? 'complete' : '')}>
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: '5px' }} />
                        Filters
                    </button>
                    <div className={`dropdown-content ${filter !== '' ? 'show' : ''}`}>
                        <div onClick={() => setFilter('complete')}>Complete</div>
                        <div onClick={() => setFilter('incomplete')}>Incomplete</div>
                        <div onClick={() => setFilter('active')}>Active</div>
                        <div onClick={() => setFilter('inactive')}>Inactive</div>
                        <div onClick={() => setFilter('')}>Clear Filters</div>
                    </div>
                </div>
                <button className="create-exam-button" onClick={() => setShowTitleModal(true)}>
                    Create new exam
                </button>
            </div>
            <div className="search-container">
                <div className="search-field">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ExamDetailsTable examDetails={examDetails} onView={handleView} onEdit={handleEdit} onDelete={handleDelete}  onSetting={handleSetting}/>
            {showTitleModal && (
                <ExamTitleModal
                    handleTitleSubmit={handleTitleSubmit}
                    setShowTitleModal={setShowTitleModal}
                />
            )}
            <div className="pagination-container">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <span>{totalPages > 0 ? `${currentPage} / ${totalPages}` : "1 / 1"}</span>
                <button disabled={currentPage === totalPages || totalPages === 1} onClick={() => handlePageChange(currentPage + 1)}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>
        </div>
    );
};

const ExamDetailsTable = ({ examDetails, onView, onEdit, onDelete , onSetting, onDuration}) => {
    return (
        <div className="table-container">
            <table className="exam-table">
                <thead>
                    <tr>
                        <th>Quiz Title</th>
                        <th>Creator Name</th>
                        <th>Status</th>
                        <th>Total Questions</th>
                        <th>Is Completed</th>
                        <th>Created At</th>
                        <th>Actions</th>
                        <th>Settings</th>
                        {/* <th>Duration</th> */}
                    </tr>
                </thead>
                <tbody>
                    {examDetails.length > 0 ? (
                        examDetails.map((exam, index) => (
                            <tr key={index}>
                                <td>{exam.quizTitle}</td>
                                <td>{exam.creatorName}</td>
                                <td>
                                    <span className={`status-badge ${exam.status.toLowerCase()}`}>{exam.status}</span>
                                </td>
                                <td>{exam.totalQuestions}</td>
                                <td>{exam.isCompleted}</td>
                                <td>{exam.createdAt ? format(new Date(exam.createdAt), 'PPp') : 'N/A'}</td>
                                <td>
                                    <button className="action-button" onClick={() => onView(exam)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    {exam.status !== 'Inactive' && (
                                        <>
                                            <button className="action-button" onClick={() => onEdit(exam)}>
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </button>
                                            <button className="action-button" onClick={() => onDelete(exam)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td>
                        
                                <button  className="setting-button" onClick={() => onSetting(exam)}>
                                        <FontAwesomeIcon icon={faGear} />
                                    </button>
                                  
                             
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No exams available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const ExamTitleModal = ({ handleTitleSubmit, setShowTitleModal }) => {
    const [title, setTitle] = useState('');
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setTitle(capitalizeFirstLetter(newValue));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTitleSubmit(title);
        setShowTitleModal(false);
    };

    return (
        <div className="modall" tabIndex="-1" >
            <div className="modall-dialog">
                <div className="modall-content">
                    <div className="modall-header">
                        <h5 className="modall-title">Enter Exam Title</h5>
                        <button type="button" className="close-button" onClick={() => setShowTitleModal(false)}>×</button>
                    </div>
                    <div className="modall-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="examTitle"
                                    value={title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button className="submit-button" type="submit">
                                Get Started
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;