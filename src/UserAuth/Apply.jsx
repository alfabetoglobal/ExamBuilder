import React, { useState } from 'react';
import Registration from './Registration'; 
import { Link } from 'react-router-dom';
import '../css/Apply.css';

function Apply() {
  const [role, setRole] = useState('');

  const handleOptionChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className='Apply'>
      <h1>Apply As:</h1>
      <input type="radio" value="Tenants" name="role" onChange={handleOptionChange} /> Tenants
      <input type="radio" value="Teacher" name="role" onChange={handleOptionChange} /> 
      <Link to="/registration">Teacher</Link>
      <p>Your role is: {role}</p>
      {role && <Registration role={role} />}
    </div>
  );
}

export default Apply;

