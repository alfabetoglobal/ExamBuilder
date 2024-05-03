import React, { useState } from 'react';
import '../css/RegisterForm.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import md5 from 'md5';
import Notification from '../UserAuth/Notification'; // Import the Notification component

function RegisterForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [notifications, setNotifications] = useState([]); // State for notifications array

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    InstituteName: Yup.string().required('Institute Name is required'),
    password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one special character'
    ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    otp: otpSent ? Yup.string().required('OTP is required') : Yup.string().notRequired()
  });

  const handleEmailVerification = async (values) => {
    try {
      setLoading(true);
      const requestBody = {
        body: JSON.stringify({ email: values.email, action: 'generate' })
      };
      console.log('Requesting OTP:', requestBody);
      const response = await axios.post('https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/email/verification', requestBody);
      console.log('Email verification response:', response.data);
      logResponse(response); // Log the API response
      
      const responseData = JSON.parse(response.data.body);
      if (responseData.success === undefined || responseData.success !== true) {
        setOtpSent(false); // Don't open OTP field if email verification fails
      } else {
        setOtpSent(true);
      }


    } catch (error) {
      console.error('Email verification failed:', error);
      logError('Email verification failed'); // Log the error
    } finally {
      setLoading(false);
      setEmailVerifying(false);
    }
  };

  const handleOTPVerification = async (otp, email) => {
    try {
      setLoading(true);
      setOtpVerifying(true);
      const requestBody = {
        body: JSON.stringify({ email: email, action: 'validate', otp: otp })
      };
      console.log('Verifying OTP:', requestBody);
      const response = await axios.post('https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/email/verification', requestBody);
      console.log('OTP verification response:', response.data);
      logResponse(response); // Log the API response

      if (response.status === 200) {
        const responseData = JSON.parse(response.data.body);
        if (responseData.success !== undefined && responseData.success === true) {
          setOtpVerified(true);
        } else {
          console.error('OTP verification failed:', responseData.message);
          logError('OTP verification failed'); // Log the error
        }
      } else {
        console.error('OTP verification failed with status code:', response.status);
        logError('OTP verification failed'); // Log the error
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      logError('OTP verification failed'); // Log the error
    } finally {
      setLoading(false);
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);

      if (otpVerified) {
        const formData = {
          fullname: `${values.firstname} ${values.lastname}`,
          email: values.email,
          password: md5(values.password),
          InstituteName: values.InstituteName,
        };

        const requestBody = {
          body: JSON.stringify(formData)
        };

        console.log('Registering user:', requestBody);
        const response = await axios.post('https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/Register/newuser', requestBody);
        console.log('Registration response:', response.data);
        logResponse(response); // Log the API response
        setRegistrationSuccess(true);
        setNotifications([...notifications, { message: 'Registration successful', type: 'success' }]); // Add success notification
        setSubmitting(false);
      } else {
        console.error('OTP verification failed. User not allowed to register.');
        logError('OTP verification failed'); // Log the error
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      logError('Registration failed'); // Log the error
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const logResponse = (response) => {
    console.log('API response:', response.data);
    const responseData = JSON.parse(response.data.body);
    setNotifications([...notifications, { message: responseData.message, type: 'info' }]); // Add info notification
  };

  const logError = (errorMessage) => {
    setNotifications([...notifications, { message: errorMessage, type: 'error' }]); // Add error notification
  };

  return (
   <div className="register-form-container">
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotifications(notifications.filter((_, i) => i !== index))}
        />
      ))}
      <h2 className="register-form-title">Register</h2>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          InstituteName: '',
          password: '',
          confirmPassword: '',
          email: '',
          otp: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="register-form">
            {registrationSuccess ? ( // Conditional rendering for success message
              <div className="success-message">
                Congratulations! You have successfully registered.
              </div>
            ) : (
              <>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="text" name="firstname" placeholder="First Name *" disabled={otpSent} />
                  <ErrorMessage name="firstname" component="div" className="error-message" />
                </div>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="text" name="lastname" placeholder="Last Name *" disabled={otpSent} />
                  <ErrorMessage name="lastname" component="div" className="error-message" />
                </div>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="text" name="InstituteName" placeholder="Institute Name *" disabled={otpSent} />
                  <ErrorMessage name="InstituteName" component="div" className="error-message" />
                </div>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="password" name="password" placeholder="Create Password *" disabled={otpSent} />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="password" name="confirmPassword" placeholder="Confirm Password *" disabled={otpSent} />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>
                <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                  <Field type="email" name="email" placeholder="Email *" disabled={otpSent} />
                  <ErrorMessage name="email" component="div" className="error-message-email" />
                </div>
                <div className="form-field-otp">
                  {otpSent ? (
                    <>
                     <Field type="text" name="otp" placeholder="Enter OTP" disabled={otpVerified} />
                      <ErrorMessage name="otp" component="div" className="error-message-otp" />
                       {otpVerified ? (
                         <p></p>
                         ) : (
                        <button
                         type="button"
                          onClick={() => handleOTPVerification(values.otp, values.email)}
                         disabled={loading || otpVerifying}
                             >
                           {otpVerifying ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>
                        )}
                    </>
                  ) : (
                    <button type="button" onClick={() => { handleEmailVerification(values); setEmailVerifying(true); }} disabled={loading || emailVerifying}>
                      {emailVerifying ? 'Verifying Email...' : 'Verify Email'}
                    </button>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="register-button" 
                  disabled={isSubmitting || !otpVerified || loading} 
                  style={{ display: !otpVerified ? 'none' : 'block' }} 
                >
                  {loading ? 'Loading...' : (isSubmitting ? 'Submitting...' : 'Register')}
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
      <div className="login-link">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default RegisterForm;
