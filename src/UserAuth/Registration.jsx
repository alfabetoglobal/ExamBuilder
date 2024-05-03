import React, { useState } from 'react';
import '../css/RegisterForm.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import md5 from 'md5';

function RegisterForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Verify Email');

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    InstituteName: Yup.string().required('Institute Name is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&])[a-zA-Z\d!@#$%^&*]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    otp: otpSent ? Yup.string().required('OTP is required') 
        
    : Yup.string().notRequired()
  });

  const handleEmailVerification = async (values, setSubmitting) => {
    try {
      setLoading(true);
      const requestBody = {
        body: JSON.stringify({ email: values.email, action: 'generate' })
      };
      console.log('Sending OTP:', requestBody);
      await axios.post('https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/email/verification', requestBody);
      setOtpSent(true);
      setLoading(false);
      setButtonText('Verify OTP');
    } catch (error) {
      console.error('OTP sending failed:', error);
      setLoading(false);
    }
  };

  const handleOTPVerification = async (values, setSubmitting) => {
    try {
      setLoading(true);
      const requestBody = {
        body: JSON.stringify({ email: values.email, action: 'validate', otp: values.otp })
      };
      console.log('Verifying OTP:', requestBody);
      const response = await axios.post('https://ejy88n4hr6.execute-api.us-east-1.amazonaws.com/email/verification', requestBody);
      console.log('OTP verification response:', response.data);

      // Check for successful verification in response data
      if (response.status === 200) {
        const responseData = JSON.parse(response.data.body); // Parse the JSON string in 'body'
        if (responseData.success !== undefined && responseData.success === true) {
          setSuccess(true);
          setOtpVerified(true);
          setButtonText('Register');
        } else {
          console.error('OTP verification failed:', responseData.message);
        }
      } else {
        console.error('OTP verification failed with status code:', response.status);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      // Proceed with registration only if OTP verification was successful
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
        setSubmitting(false);
      } else {
        console.error('OTP verification failed. User not allowed to register.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
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
        onSubmit={(values, { setSubmitting }) => {
          if (!otpSent) {
            handleEmailVerification(values, setSubmitting);
          } else if (!otpVerified){
            handleOTPVerification(values, setSubmitting);
          }
          else {
            handleSubmit(values,setSubmitting);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            {!success ? (
              <>
                <div className="form-field">
                  <Field type="text" name="firstname" placeholder="First Name *" disabled={otpSent} />
                  <ErrorMessage name="firstname" component="div" className="error-message" />
                </div>
                <div className="form-field">
                  <Field type="text" name="lastname" placeholder="Last Name *" disabled={otpSent} />
                  <ErrorMessage name="lastname" component="div" className="error-message" />
                </div>
                <div className="form-field">
                  <Field type="text" name="InstituteName" placeholder="Institute Name *" disabled={otpSent} />
                  <ErrorMessage name="InstituteName" component="div" className="error-message" />
                </div>
                <div className="form-field">
                  <Field type="password" name="password" placeholder="Create Password *" disabled={otpSent} />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
                <div className="form-field">
                  <Field type="password" name="confirmPassword" placeholder="Confirm Password *" disabled={otpSent} />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>
                <div className="form-field-email">
                  <Field type="email" name="email" placeholder="Email *" disabled={otpSent} />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                {otpSent && (
                  <div className="form-field">
                     <Field type="text" name="otp" placeholder="Enter OTP" />
                    <ErrorMessage name="otp" component="div" className="error-message" />
                  </div>
                )}
                <button type="submit" className="register-button" >
                  {loading ? 'Loading...' : buttonText}
                </button>
              </>
            ) : (
              <div className="success-message">
                Congratulations! You have successfully registered.
              </div>
            )}
            <div className="login-link">
              <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterForm;