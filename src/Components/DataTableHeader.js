import React from 'react';
import './DataTableHeader.css';
const DataTableHeader = ({ showEntries, onShowEntriesChange, onSearchChange }) => {
  return (
    <thead>
      <tr>
        <th colSpan="5">
          <label>
            Show
            <select value={showEntries} onChange={onShowEntriesChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">25</option>
              {/* <option value="5">5</option> */}
              {/* <option value="100">100</option> */}
            </select>
            entries
          </label>
          <label>
          Search
          <input
            type="text"
            placeholder="type...."
            onChange={onSearchChange}
          />
          </label>
        </th>
      </tr>
      <tr>
        <th>Quiz Id</th>
        <th>Quiz Title </th>
        {/* <th>Grade</th> */}
        <th>Creator Name</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );
};

export default DataTableHeader;
