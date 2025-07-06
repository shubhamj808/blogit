import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { UserRegistrationDto } from '../types/user';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Registration successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your account has been created successfully. Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-indigo-700">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
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
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="input-field rounded-tl-md"
                      placeholder="First Name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="input-field rounded-tr-md"
                      placeholder="Last Name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <label htmlFor="username" className="form-label">Username</label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    className="input-field"
                    placeholder="Username"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input-field"
                    placeholder="Email address"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="input-field"
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="input-field"
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Field
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    I accept the{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-xs mt-1" />
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {loading && (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Create Account
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