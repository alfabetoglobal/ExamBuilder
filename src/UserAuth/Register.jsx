import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import md5 from 'md5';
import { RiLockPasswordLine } from 'react-icons/ri'; 
import { FaEye, FaEyeSlash, FaUser, FaSchool, FaEnvelope } from 'react-icons/fa';
import Notification from '../UserAuth/Notification';
import Header from '../Header';
import '../css/RegisterForm.css';

function RegisterForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z]+$/, 'First Name must contain only alphabets')
      .max(28, 'First Name must be at most 28 characters long'),
    lastname: Yup.string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z]+$/, 'Last Name must contain only alphabets')
      .max(28, 'Last Name must be at most 28 characters long'),
    InstituteName: Yup.string()
      .required('Institute Name is required')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Institute Name must contain only alphanumeric characters'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        'Must be 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character: @$!%*?&'
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
      logResponse(response);

      const responseData = JSON.parse(response.data.body);
      if (responseData.success === undefined || responseData.success !== true) {
        setOtpSent(false);
      } else {
        setOtpSent(true);
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      logError('Email verification failed');
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
      logResponse(response);

      if (response.status === 200) {
        const responseData = JSON.parse(response.data.body);
        if (responseData.success !== undefined && responseData.success === true) {
          setOtpVerified(true);
        } else {
          console.error('OTP verification failed:', responseData.message);
          logError('OTP verification failed');
        }
      } else {
        console.error('OTP verification failed with status code:', response.status);
        logError('OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      logError('OTP verification failed');
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
        const response = await axios.post('https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/check/register', requestBody);
        console.log('Registration response:', response.data);
        logResponse(response);
        setRegistrationSuccess(true);
        setNotifications([...notifications, { message: 'Registration successful', type: 'success' }]);
        setSubmitting(false);
      } else {
        console.error('OTP verification failed. User not allowed to register.');
        logError('OTP verification failed');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      logError('Registration failed');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const logResponse = (response) => {
    console.log('API response:', response.data);
    const responseData = JSON.parse(response.data.body);
    setNotifications([...notifications, { message: responseData.message, type: 'info' }]);
  };

  const logError = (errorMessage) => {
    setNotifications([...notifications, { message: errorMessage, type: 'error' }]);
  };

  return (
    <div>
      <Header />
      <div className="register-form-container">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotifications(notifications.filter((_, i) => i !== index))}
          />
        ))}
        {registrationSuccess ? (
          <div className="success-message">
            Click here to <Link to="/login">Login</Link>.
          </div>
        ) : (
          <>
            <h2 className="register-form-title">Sign Up</h2>
            <Formik
              initialValues={{
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid, values, setFieldValue }) => (
                <Form className="register-form">
                  <div className="form-field-inline">
                    <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                      <FaUser className="inputt-icon" />
                      <Field type="text" name="firstname" placeholder="First Name *" disabled={otpSent} />
                      <ErrorMessage name="firstname" component="div" className="error-message" />
                    </div>
                    <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                      <FaUser className="inputt-icon" />
                      <Field type="text" name="lastname" placeholder="Last Name *" disabled={otpSent} />
                      <ErrorMessage name="lastname" component="div" className="error-message" />
                    </div>
                  </div>
                  <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                    <FaSchool className="inputt-icon" />
                    <Field type="text" name="InstituteName" placeholder="Institute Name *" disabled={otpSent} />
                    <ErrorMessage name="InstituteName" component="div" className="error-message" />
                  </div>
                  <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                    <RiLockPasswordLine className="inputt-icon security-icon" /> 
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create Password *"
                      disabled={otpSent}
                    />
                    {showPassword ? (
                      <FaEyeSlash className="password-toggle" onClick={() => setShowPassword(false)} />
                    ) : (
                      <FaEye className="password-toggle" onClick={() => setShowPassword(true)} />
                    )}
                    <ErrorMessage name="password" component="div" className="error-message" />
                  </div>
                  <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                    <RiLockPasswordLine className="inputt-icon security-icon" /> 
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password *"
                      disabled={otpSent}
                    />
                    {showPassword ? (
                      <FaEyeSlash className="password-toggle" onClick={() => setShowPassword(false)} />
                    ) : (
                      <FaEye className="password-toggle" onClick={() => setShowPassword(true)} />
                    )}
                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                  </div>
                  <div className={`form-field ${otpSent ? 'greyish-color' : ''}`}>
                    <FaEnvelope className="inputt-icon" />
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
                      <button
                        type="button"
                        onClick={() => { handleEmailVerification(values); setEmailVerifying(true); }}
                        disabled={loading || emailVerifying}
                      >
                        {emailVerifying ? 'Verifying Email...' : 'Verify Email'}
                      </button>
                    )}
                  </div>
                  <button
  type="submit"
  className="register-button"
  disabled={isSubmitting || !otpVerified || loading || !isValid}
  style={{ display: !otpVerified ? 'none' : 'block' }}
>
  {loading ? 'Loading...' : (isSubmitting ? 'Submitting...' : 'Sign Up')}
</button>
                </Form>
              )}
            </Formik>
            <div className="login-link">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;

