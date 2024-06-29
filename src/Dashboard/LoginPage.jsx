import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());

  function generateCaptcha() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    alert('Login submitted');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1> Entrance Examination  – 2024</h1>
        <h2>Only Registered Candidate Login Here</h2>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="applicationFor">Application For</label>
          <select id="applicationFor" defaultValue="Entrance Examination – 2024: Session 2">
            <option value="">Entrance Examination – 2024: Session 2</option>
          </select>
        </div>
       
        <div className="form-group">
          <label htmlFor="applicationNumber">Application Number</label>
          <input
            type="text"
            id="applicationNumber"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Enter Application Number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Date of Birth (DD/MM/YYYY)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="securityPin">Security PIN as Shown Below</label>
          <input
            type="text"
            id="securityPin"
            value={securityPin}
            onChange={(e) => setSecurityPin(e.target.value)}
            placeholder="Enter Security PIN as Shown Below"
            required
          />
        </div>
        <div className="captcha-group">
          <span className="captcha">{captcha}</span>
          <button type="button" className="refresh-captcha" onClick={() => setCaptcha(generateCaptcha())}>
            &#x21bb;
          </button>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="forgot-section">
        <p>If you forgot your password or application number, click on the below link:</p>
        <button className="forgot-button">Forgot your password?</button>
        <button className="forgot-button">Forgot Application Number?</button>
      </div>
    </div>
  );
}

export default LoginPage;
