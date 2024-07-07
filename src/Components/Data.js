import React, { useState } from 'react';
import DataTable from './Components/DataTable';
import './App.css';

const App = () => {
  const [showEntries, setShowEntries] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const data = [
    { id: 1, name: 'test1', grade: 'Grade A', subject: 'Maths', status: 'action', action: 'gn' },
    { id: 2, name: 'test3', grade: 'B', subject: 'Physics', status: 'Ph  ', action: 'gj' },
    { id: 3, name: 'MS', grade: 'C', subject: 'English', status: 'n', action: 'gj' },
    { id: 4, name: 'test7', grade: 'A', subject: 'G.K', stauts: 'English', action: 'bm' },
    { id: 5, name: 'Nm', grade: 'C', subject: 'Computer', stauts: 'G', action: 'fhn'},
    { id: 1, name: 'EXam', grade: 'F', subject: 'Science', status: 'action', action: 'gn' },
    { id: 2, name: 'Test2', grade: 'A', subject: 'Eco', status: 'Ca', action: 'gj' },
    { id: 3, name: 'Final Exam', grade: 'B', subject: 'n', status: 'n', action: 'gj' },
    { id: 4, name: 'Lcb', grade: 'C', subject: 'b', stauts: 'hik', action: 'bm' },
    { id: 5, name: 'PA', grade: 'D', subject: 'm', stauts: 'G', action: 'fhn'},
    { id: 1, name: 'JM', grade: 'E', subject: 'nn', status: 'action', action: 'gn' },
    { id: 2, name: 'Jv', grade: 'E', subject: 'b', status: 'Ca', action: 'gj' },
    { id: 3, name: 'SG', grade: 'D', subject: 'n', status: 'n', action: 'gj' },
    { id: 4, name: 'Exam', grade: 'A', subject: 'b', stauts: 'hik', action: 'bm' },
    { id: 5, name: 'Form', grade: 'A', subject: 'm', stauts: 'G', action: 'fhn'},
    // Add more data as needed
    // Add more data as needed
    // Add more data as needed
  ];

  const handleShowEntriesChange = (event) => {
    setShowEntries(parseInt(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="App">
      <h1>Data Table</h1>
      <div className="controls">
        <label>
          
          <select value={showEntries} onChange={handleShowEntriesChange}>
            <option value="Active">Active</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        
        </label>
        <button onClick={() => alert('Filter clicked')}>Filters</button>
        <button onClick={() => alert('Add')}>Add</button>
        {/* You can add additional buttons or controls here */}
      </div>
      <DataTable
        data={data}
        showEntries={showEntries}
        searchQuery={searchQuery}
        onShowEntriesChange={handleShowEntriesChange}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default data;
