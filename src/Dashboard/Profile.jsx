import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    instituteName:'',
    createdAt: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      setError('Token or email not found in local storage');
      setLoading(false);
      return;
    }

    const apiUrl = 'https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/profile/P_details';

    try {
      const payload = {
        headers: {
          Authorization: token,
        },
        body: JSON.stringify({
          email: email,
        }),
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.body) {
        const { fullname, email: responseEmail, InstituteName, createdAt } = response.data.body;
  
        if (!fullname || !responseEmail || !InstituteName || !createdAt) {
          setError('Incomplete user profile data received');
          setLoading(false);
          return;
        }
  
        setUser({
          name: fullname,
          email: responseEmail,
          instituteName: InstituteName,
          createdAt: new Date(createdAt).toLocaleString(),
        });
      } else {
        setError('Unexpected response structure');
      }
    } catch (error) {
      if (error.response) {
        setError(`Failed to fetch user profile: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        setError('No response received from server');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('Loading State:', loading);
  console.log('Error State:', error);
  console.log('User State:', user);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

 return (
  <div className="profile-container">
      <div className="profile-image-card">
        <div className="profile-header-card">
          <img src={user.profileImage} alt="Profile" className="profile-image" />
          <span className="profile-card-value">{user.name}</span>
          <button className="editt-button">Edit</button>
        </div>
      </div>
      <div className="contact-details-card">
        <div className="profile-card">
          <h2 className="profile-card-title">Contact Person Details</h2>
          <div className="profile-card-details">
            <div className="profile-card-row"> 
              <span className="profile-card-label">Fullname</span>
              <span className="profile-card-value">{user.name}</span>
            </div>
            <div className="profile-card-row">
              <span className="profile-card-label">Email ID</span>
              <span className="profile-card-value">{user.email}</span>
            </div>
            <div className="profile-card-row">
              <span className="profile-card-label">InstitueName</span>
              <span className="profile-card-value">{user.instituteName}</span>
            </div>
            <div className="profile-card-row">
              <span className="profile-card-label">Created At</span>
              <span className="profile-card-value">{user.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



