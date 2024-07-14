import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SetExamTime.css';

const SetExamTime = () => {
    const [examTime, setExamTime] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
    const location = useLocation();
    const { quizId } = location.state || {}; // Destructure quizId from location.state
    console.log('Quiz ID:', quizId);

    const handleInputChange = (e) => {
        const { value } = e.target;
        // Validate input to allow only integers
        if (/^\d*$/.test(value)) {
            setExamTime(value);
        }
    };

    const handleSubmit = async () => {
        const timeInMinutes = parseInt(examTime, 10);
        if (!isNaN(timeInMinutes) && timeInMinutes > 0 && quizId) {
            // API call to update the quiz duration
            const apiUrl = 'https://r9qkgroo29.execute-api.us-east-1.amazonaws.com/v1/duration';

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    quizId: quizId,
                    quizDuration: timeInMinutes
                })
            };

            try {
                const response = await fetch(apiUrl, requestOptions);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Quiz duration updated:', data);
                    setShowAlert(true); // Show alert after successful update
                } else {
                    const errorData = await response.json();
                    console.error('Error updating quiz duration:', errorData);
                    alert(`Error updating quiz duration: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error updating quiz duration:', error);
                alert('An error occurred while updating the quiz duration.');
            }
        } else {
            alert('Please enter a valid exam time and ensure you navigated from the correct page.');
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false); // Hide alert when OK is clicked
    };

    return (
        <div className="dialog-box">
            <h2>Set Exam Time</h2>
            <div className="input-group">
                <label>Enter exam time (minutes):</label>
                <input
                    type="text"
                    value={examTime}
                    onChange={handleInputChange}
                    placeholder="Enter time in minutes"
                />
            </div>
            <div className="submit-button">
                <button onClick={handleSubmit}>Submit</button>
            </div>

            {/* Alert shown conditionally */}
            {showAlert && (
                <div className="alert">
                    <p>{`Quiz duration updated successfully: ${examTime} minutes`}</p>
                    <button    onClick={handleAlertClose}>OK</button>
                </div>
            )}
        </div>
    );
};

export default SetExamTime;
