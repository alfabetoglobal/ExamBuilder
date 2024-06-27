import React from 'react';
import './DataTableBody.css';

const DataTableBody = ({ data, searchQuery, showEntries }) => {
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedData = filteredData.slice(0, showEntries);

  return (
    <tbody>
      {displayedData.map((item, index) => (
        <tr key={index}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          {/* <td>{item.grade}</td> */}
          <td>{item.subject}</td>
          <td>{item.status}</td>
          <td>{item.action}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default DataTableBody;
