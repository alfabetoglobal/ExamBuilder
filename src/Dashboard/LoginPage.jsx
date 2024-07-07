import React, { useState } from 'react';
// import '../LoginPage.css';

function Login() {
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [applicationNo, setApplicationNo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add login logic here
    console.log('Login submitted:', username, dob, applicationNo);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
        />
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          className="form-control"
          value={dob}
          onChange={(event) => setDob(event.target.value)}
          placeholder="Enter your date of birth"
        />
        <label htmlFor="application-no">Application No:</label>
        <input
          type="text"
          id="application-no"
          className="form-control"
          value={applicationNo}
          onChange={(event) => setApplicationNo(event.target.value)}
          placeholder="Enter your application number"
        />
        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;