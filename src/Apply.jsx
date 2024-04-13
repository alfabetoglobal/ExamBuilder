import React, { useState } from 'react';
import RegisterForm from './RegisterForm'; // Adjust the path based on your project structure

function Apply() {
  const [role, setRole] = useState('');

  const handleOptionChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div>
      <h1>Choose your role:</h1>
      <input type="radio" value="student" name="role" onChange={handleOptionChange} /> Student
      <input type="radio" value="teacher" name="role" onChange={handleOptionChange} /> Teacher
      <p>Your role is: {role}</p>
      {role && <RegisterForm role={role} />}
    </div>
  );
}

export default Apply;
