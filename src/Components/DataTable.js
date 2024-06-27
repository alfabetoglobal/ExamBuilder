import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DataTableHeader from './DataTableHeader';
import './DataTable.css';

const DataTable = ({ data, showEntries, searchQuery, onShowEntriesChange, onSearchChange }) => {
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const displayedData = filteredData.slice(0, showEntries);

  return (
    <table>
      <DataTableHeader
        showEntries={showEntries}
        onShowEntriesChange={onShowEntriesChange}
        onSearchChange={onSearchChange}
      />
      <tbody>
        {displayedData.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            {/* <td>{row.grade}</td> */}
            <td>{row.subject}</td>
            <td>
              <button onClick={() => alert(`Action for ${row.status || row.stauts}`)}>Active</button>
            </td>
            <td>
              <FontAwesomeIcon icon={faEye} style={{ cursor: 'pointer', marginRight: '10px' }} />
              <FontAwesomeIcon icon={faEdit} style={{ cursor: 'pointer', marginRight: '10px' }} />
              <FontAwesomeIcon icon={faTrashAlt} style={{ cursor: 'pointer' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
