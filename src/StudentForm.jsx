import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import './StudentForm.css';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

function StudentForm() {
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [applicationNumber, setApplicationNumber] = useState('');
    const [dobError, setDobError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dobRegex.test(dob)) {
            setDobError('Date of Birth must be in YYYY-MM-DD format.');
            return;
        }

        setDobError('');
        const selectedQuizId = localStorage.getItem('selectedQuizId'); // Fetch selected quiz ID from localStorage
        const token = localStorage.getItem('token'); // Fetch token from localStorage

        const payload = {
            fullName,
            applicationNumber,
            DOB: dob,
            AllquestionId: selectedQuizId // Include the selected quiz ID in the payload
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token // Replace with actual token
        };

        try {
            const response = await fetch('https://ybkfar4y6i.execute-api.us-east-1.amazonaws.com/forms/studentFormDetails', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                const data = await response.json();
                localStorage.setItem('applicationnumber',  applicationNumber);
                console.log(data.message); // Handle success response


                // Now, call the SuffledQuestionUser API
                const shuffledPayload = {
                    id: selectedQuizId,
                    applicationNumber: applicationNumber
                };

                const shuffledResponse = await fetch('https://ybkfar4y6i.execute-api.us-east-1.amazonaws.com/studentq/SuffledQuestionUser', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(shuffledPayload)
                });

                if (shuffledResponse.status === 200) {
                    const shuffledData = await shuffledResponse.json();
                    // console.log('Shuffled Data:', shuffledData); // Log shuffledData to inspect its structure
                    try {
                        localStorage.setItem('shuffledQuestions', JSON.stringify(shuffledData));
                   
                        localStorage.setItem('quizId', selectedQuizId);
                        console.log('Shuffled Data:', shuffledData);
                        navigate('/InstructionsPage');
                    } catch (error) {
                        console.error('Error storing in localStorage:', error);
                    }
                } else if (shuffledResponse.status === 204) {
                    console.log('Preflight CORS request successful');
                } else if (shuffledResponse.status === 400) {
                    console.log('Bad Request - Missing required fields');
                } else if (shuffledResponse.status === 401) {
                    console.log('Unauthorized request');
                } else if (shuffledResponse.status === 404) {
                    console.log('Not Found');
                } else if (shuffledResponse.status === 500) {
                    console.log('Internal Server Error');
                } else {
                    console.log('Unexpected response:', shuffledResponse.status);
                }

            } else if (response.status === 204) {
                console.log('Preflight CORS request successful');
            } else if (response.status === 401) {
                console.log('Unauthorized request');
            } else if (response.status === 400) {
                console.log('Bad Request - Missing required fields');
            } else if (response.status === 500) {
                console.log('Internal Server Error');
            } else {
                console.log('Unexpected response:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-header">Student Form</h2>

                <div className="form-group">
                    <label htmlFor="fullName"><FaUser className="form-icon" /> Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter Full Name"
                        required
                    />
                </div>

                <div className="form-group" data-tip={dobError ? dobError : ''}>
                    <label htmlFor="dob"><FaCalendarAlt className="form-icon" /> Date of Birth</label>
                    <input
                        type="text"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="Enter Date of Birth (YYYY-MM-DD)"
                        required
                        style={{ borderColor: dobError ? 'red' : '' }}
                    />
                    {dobError && <Tooltip place="right" type="error" effect="solid" />}
                </div>

                <div className="form-group">
                    <label htmlFor="applicationNumber"><FaIdCard className="form-icon" /> Application Number</label>
                    <input
                        type="text"
                        id="applicationNumber"
                        value={applicationNumber}
                        onChange={(e) => setApplicationNumber(e.target.value)}
                        placeholder="Enter Application Number"
                        required
                    />
                </div>

                <button type="submit" className="login-button">Start</button>
            </form>
        </div>
    );
}

export default StudentForm;
