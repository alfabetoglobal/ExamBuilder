import React, { useState } from 'react';
import Registration from './Registration';
import '../css/Apply.css';

function Apply() {
  const [role, setRole] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleOptionChange = (e) => {
    setRole(e.target.value);
    setShowRegistration(true);
  };

  return (
    <div className="Apply">
      <h1 className={showRegistration ? 'hide-heading' : ''}>Apply as</h1>
      <div className={`apply-options ${showRegistration ? 'hide' : ''}`}>
        <select
          className={`apply-select ${showRegistration ? 'hide' : ''}`}
          value={role}
          onChange={handleOptionChange}>
          <option value="">Select Role</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>
      </div>
      {showRegistration && <Registration selectedRole={role} />}
    </div>
  );
}

export default Apply;
