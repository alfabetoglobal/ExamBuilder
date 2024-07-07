import React, { useState } from 'react';
import NewPasswordForm from './NewPasswordForm';
import axios from 'axios';
import './OTPForm.css';

const OTPForm = ({ userEmail }) => {
  const [otp, setOTP] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
    setError('');
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const OTP_API_URL = 'https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/users/userforgetpassword';
      const requestBody = {
        body: JSON.stringify({ email: userEmail, action: 'validate', otp })
      };

      console.log('Sending request to OTP validation API with data:', requestBody);

      const response = await axios.post(OTP_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('OTP validation response:', response.data);

      const responseData = JSON.parse(response.data.body);

      if (responseData.statusCode === 200) {
        setShowNewPasswordForm(true);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP validation failed:', error);
      setError('Invalid OTP. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {!showNewPasswordForm ? (
        <form onSubmit={handleSubmitOTP} className="otp-form">
          <h2 className="otpo-title">Enter OTP</h2>
          <div className="otpo-input">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOTPChange}
          />
          </div>
          <button type="submit" disabled={!otp || isSubmitting} className="otpo-submit otpo-submit-button">
            {isSubmitting ? <div className="loader"></div> : 'Verify OTP'}
          </button>
          {error && <p className="error-message-otpo">{error}</p>}
        </form>
      ) : (
        <NewPasswordForm userEmail={userEmail} />
      )}
    </div>
  );
};

export default OTPForm;
