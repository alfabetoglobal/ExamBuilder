import React, { useState } from 'react';
import axios from 'axios';
import './NewPasswordForm.css';

const NewPasswordForm = ({ userEmail }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Must be 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character: @$!%*?&");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        body: JSON.stringify({
          email: userEmail,
          newPassword: newPassword
        })
      };

      const response = await axios.post(
        'https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/password/reset',
        requestBody
      );

      console.log("Response:", response.data);
      // Do further handling of the response if needed

      setSuccessMessage("Password changed successfully!");
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);

    } catch (error) {
      console.error('Error resetting password:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {successMessage ? (
        <div className="success-message">
          Password changed successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmitNewPassword}>
          <h2 className="new-title">Enter New Password</h2>
          <div className="password-input-new">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <span className="password-toggle-new" onClick={handleTogglePasswordVisibility}>
              {/* Toggle icon if needed */}
            </span>
          </div>
          <br />
          <div className="password-input-new">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <span className="password-toggle-new" onClick={handleTogglePasswordVisibility}>
              {/* Toggle icon if needed */}
            </span>
          </div>
          <br />
          {passwordError && <p className="error-message-new">{passwordError}</p>}
          <button type="submit" disabled={loading} className="change-password-button">
            {loading ? (
              <div className="loader"></div>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewPasswordForm;
