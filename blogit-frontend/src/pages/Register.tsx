import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { UserRegistrationDto } from '../types/user';
import { FiUser, FiMail, FiLock, FiUserPlus, FiCheck } from 'react-icons/fi';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: UserRegistrationDto, { resetForm }: any) => {
    try {
      // Extract confirmPassword from values to avoid sending it to the API
      const { confirmPassword, ...registrationData } = values;
      await dispatch(register(registrationData as UserRegistrationDto)).unwrap();
      resetForm();
      setRegistrationSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Registration successful</h3>
            <p className="text-sm text-green-700">
              Your account has been created successfully. Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-sky-100 mb-4">
            <FiUserPlus className="h-6 w-6 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-500 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            acceptTerms: false,
            fullName: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            React.useEffect(() => {
              setFieldValue('fullName', `${values.firstName} ${values.lastName}`.trim());
            }, [values.firstName, values.lastName, setFieldValue]);

            return (
              <Form className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="input-field"
                      placeholder="First Name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="input-field"
                      placeholder="Last Name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-slate-400" />
                    </div>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className="input-field pl-10"
                      placeholder="Choose a username"
                    />
                  </div>
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="input-field pl-10"
                        placeholder="Create password"
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="input-field pl-10"
                        placeholder="Confirm password"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Field
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded mt-1"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-slate-700">
                    I accept the{' '}
                    <a href="#" className="font-semibold text-sky-600 hover:text-sky-500 transition-colors">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm mt-1" />
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="btn-primary w-full flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner w-5 h-5"></div>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="h-5 w-5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Register;