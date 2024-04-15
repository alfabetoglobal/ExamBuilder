import React, { useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './Register.css';
import PhoneInput from 'react-phone-number-input'; 
import 'react-phone-number-input/style.css';


const Registration = () => {
    // eslint-disable-next-line
    const fileRef = useRef(null);
    const [step, setStep] = useState(1);

    const basicDetailsValidationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        DOB: Yup.date().required('Date of Birth is required'),
        gender: Yup.string().required('Gender is required'),
    });

    const contactInfoValidationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone Number is required'),
        address: Yup.string().required('Address is required'),
        pincode: Yup.string().matches(/^[0-9]{6}$/, 'Invalid pincode').required('Pincode is required'),
    });

    const instituteDetailsValidationSchema = Yup.object({
        instituteName: Yup.string().required('Institute Name is required'),
        instituteAddress: Yup.string().required('Institute Address is required'),
        experience: Yup.number().required('Experience is required').min(0, 'Experience cannot be negative'),
        Role: Yup.string().required('Role is required'),
    });

    const identityValidationSchema = Yup.object({
            identityType: Yup.string().required('Identity Type is required'),
            identity: Yup.string().required('Identity is required'),
            identityDocument: Yup.mixed().required('Identity Document is required'),
        });
        

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = {
                PinCode: values.pincode,
                firstName: values.firstName,
                lastName: values.lastName,
                DOB: values.DOB,
                gender: values.gender,
                email: values.email,
                phoneNumber: values.phoneNumber,
                instituteName: values.instituteName,
                instituteAddress: values.instituteAddress,
                Role: values.Role,
                experience: values.experience,
                address: values.address,
                Identity: values.identity,
                Active: false,
            };

            const requestBody = {
                body: JSON.stringify(formData)
            };
             console.log(requestBody);
            const response = await axios.post('https://f3c71ors2e.execute-api.us-east-1.amazonaws.com/user/register', requestBody);
            console.log(response.data); 
            setSubmitting(false);
            
        } catch (error) {
            console.error('Registration failed:', error);
    
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">Register</div>
            </div>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    DOB: '',
                    gender: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    instituteName: '',
                    instituteAddress: '',
                    Role: '',
                    experience: '',
                    identity: '',
                    identityDocument: null,
                    pincode: '',
                    password: '', 
                }}
                validationSchema={(values) => {
                    switch (step) {
                        case 1:
                            return basicDetailsValidationSchema;
                        case 2:
                            return contactInfoValidationSchema;
                        case 3:
                            return instituteDetailsValidationSchema;
                        case 4:
                            return identityValidationSchema;
                        default:
                            return Yup.object({});
                    }
                }}
                onSubmit={handleSubmit}
            >
                {formik => (
                    <Form className="row">
                        {step === 1 ? (
                            <>
                                <h2>Personal Details</h2>
                                <div className="input ">
                                    <Field type="text" name="firstName" placeholder="First Name" />
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                        <div className="error-popup">{formik.errors.firstName}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="text" name="lastName" placeholder="Last Name" />
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                        <div className="error-popup">{formik.errors.lastName}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="date" name="DOB" placeholder="Date of Birth" />
                                    {formik.touched.DOB && formik.errors.DOB ? (
                                        <div className="error-popup">{formik.errors.DOB}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field as="select" name="gender">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Field>
                                    {formik.touched.gender && formik.errors.gender ? (
                                        <div className="error-popup">{formik.errors.gender}</div>
                                    ) : null}
                                </div>
                            </>
                        ) : step === 2 ? (
                            <>
                                <h2>Contact Information</h2>
                                <div className="input">
                                    <Field type="email" autoComplete="off" name="email" placeholder="Email" />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="error-popup">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                                 <div className="input">
                                <PhoneInput
                                 autoComplete="off"
                                 country="IN"
                                  name="phoneNumber"
                                   placeholder="Phone Number"
                                   inputprops={{
                                    required:true,
                                   }}
                                      value={formik.values.phoneNumber}
                                      onChange={value => formik.setFieldValue('phoneNumber', value)}
                                       onBlur={formik.handleBlur('phoneNumber')}
                                      />
                                          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                          <div className="error-popup">{formik.errors.phoneNumber}</div>
                                    )}
                                     </div>
                                <div className="input">
                                    <Field type="text" autoComplete="off" name="address" placeholder="Address" />
                                    {formik.touched.address && formik.errors.address ? (
                                        <div className="error-popup">{formik.errors.address}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="number" autoComplete="off" name="pincode" placeholder="Pincode" />
                                    {formik.touched.pincode && formik.errors.pincode ? (
                                        <div className="error-popup">{formik.errors.pincode}</div>
                                    ) : null}
                                </div>
                            </>
                        ) : step === 3 ? (
                            <>
                                <h2>Institute Details</h2>
                                <div className="input">
                                    <Field type="text" autoComplete="off" name="instituteName" placeholder="Institute Name" />
                                    {formik.touched.instituteName && formik.errors.instituteName ? (
                                        <div className="error-popup">{formik.errors.instituteName}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="text" autoComplete="off" name="instituteAddress" placeholder="Institute Address" />
                                    {formik.touched.instituteAddress && formik.errors.instituteAddress ? (
                                        <div className="error-popup">{formik.errors.instituteAddress}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="number" autoComplete="off" name="experience" placeholder="Experience (in years)" />
                                    {formik.touched.experience && formik.errors.experience ? (
                                        <div className="error-popup">{formik.errors.experience}</div>
                                    ) : null}
                                </div>
                                <div className="input">
                                    <Field type="text" autoComplete="off" name="Role" placeholder="Role" />
                                    {formik.touched.Role && formik.errors.Role ? (
                                        <div className="error-popup">{formik.errors.Role}</div>
                                    ) : null}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>Identity Verification</h2>
                                <div className="input">
                               <Field type="text" autoComplete="off" name="identity" placeholder="Identity" />
                               {formik.touched.identity && formik.errors.identity ? (
                             <div className="error-popup">{formik.errors.identity}</div>
                         ) : null}
                             </div>
                        <div className="input">
                         <Field as="select" autoComplete="off" name="identityType">
                         <option value="" disabled>Select Identity Type</option>
                           <option value="aadhar">Aadhar Card</option>
                             <option value="pan">PAN Card</option>
                              <option value="studentId">Student ID</option>
                            </Field>
                              {formik.touched.identityType && formik.errors.identityType ? (
                        <div className="error-popup">{formik.errors.identityType}</div>
                        ) : null}
                           </div>

                                <div className="input">
                                    <input className="file-input" type="file" onChange={(event) => formik.setFieldValue("identityDocument", event.currentTarget.files[0])} />
                                    {formik.touched.identityDocument && formik.errors.identityDocument ? (
                                        <div className="error-popup">{formik.errors.identityDocument}</div>
                                    ) : null}
                                </div>
                            </>
                        )}
                        <div className="button-group">
                          {step > 1 && (
                          <button type="button" className="btn btn-warning" onClick={handlePrevious}>Previous</button>
                          )}
                        {step < 4 && (
                        <button type="button" className="btn btn-success" onClick={handleNext} disabled={!formik.isValid}>
                        Next
                        </button>
                         )}
                        {step === 4 && (
                       <button type="submit" className="btn btn-success" disabled={!formik.isValid || formik.isSubmitting}>
                        {formik.isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                         )}
                      </div>
                    </Form>
                )}
            </Formik>
            <div className="forget-password">
                Already have an account? <span onClick={() => {}}>Login Here!</span>
            </div>
        </div>
    );
};

export default Registration;
