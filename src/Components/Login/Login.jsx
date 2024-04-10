import React, { useState } from 'react';
import './Login.css';
import md5 from 'md5';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);// eslint-disable-next-line
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setShowEye(!showEye);
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(!showForgotPassword);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const hashedPassword = md5(password);
    setEmail(localStorage.getItem('username') || '');
    setPassword(localStorage.getItem('password') || '');
    console.log('Email:', email);
    console.log('Password:', hashedPassword);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    localStorage.setItem('username', email);
    setUsername(email);
  }

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (inputEmail === '') {
      setEmail(localStorage.getItem('username') || '');
    }

    if (!EMAIL_REGEX.test(inputEmail)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  }

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);

    if (!PASSWORD_REGEX.test(inputPassword)) {
      setPasswordError("Must be 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character: @$!%*?&@.");
    } else {
      setPasswordError("");
    }
  }

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem('username', email);
      localStorage.setItem('password', md5(password));
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }

  return (
    <div className='wrapper'>
      {showForgotPassword? (
        <ForgotPasswordForm />
      ) : (
        <form onSubmit={handleLogin}>
          <h2>LogIn</h2>
          <input
            type="email"
            id="email"
            placeholder="User Id"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className='error'>{emailError}</p>}
          <br />
          <input
            type={showPassword? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <span className={`show-password-eye ${showEye ? "show" : "hide"}`} onClick={handleShowPasswordToggle}>&#x1f441;</span>
          {passwordError && <p className='error'>{passwordError}</p>}
          <div className='remember-forgot'>
            <label>
              <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
              Remember me
            </label>
            <button onClick={handleForgotPasswordClick}>Forgot password?</button>
          </div>
          <br />
          <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Login"}</button>
        </form>
        
      )}
    </div>
  );
}

const ForgotPasswordForm = () => {
const [email, setEmail] = useState('');

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending password reset email to:', email);
  }

  return (
    <form onSubmit={handleForgotPasswordSubmit}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        id="email"
        placeholder="Email Id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><button type="submit">Reset Password</button>
    </form>
  );
}

export default Login;