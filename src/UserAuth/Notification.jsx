import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Notification({ message, type }) {
  const notificationRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      notificationRef.current.style.display = 'none';
    }, 5000); // 5 seconds in milliseconds

    return () => clearTimeout(timeoutId);
  }, [message, type]); // Re-run effect on message or type change

  const notificationStyle = {
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '10px',
    backgroundColor: type === 'error' ? '#ffcccc' : '#cceeff',
    color: type === 'error' ? '#990000' : '#006699',
  };

  return (
    <div ref={notificationRef} style={notificationStyle}>
      <span>{message}</span>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Notification;
