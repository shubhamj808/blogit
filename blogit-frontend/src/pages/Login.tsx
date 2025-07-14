import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { UserLoginDto } from '../types/user';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: UserLoginDto) => {
    setFormSubmitted(true);
    await dispatch(login(values));
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-sky-100 mb-4">
            <FiUser className="h-6 w-6 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-500 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        <Formik
          initialValues={{ usernameOrEmail: '', password: '', rememberMe: false }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="usernameOrEmail" className="form-label">
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Field
                      id="usernameOrEmail"
                      name="usernameOrEmail"
                      type="text"
                      autoComplete="username"
                      className="input-field pl-10"
                      placeholder="Enter your username or email"
                    />
                  </div>
                  <ErrorMessage name="usernameOrEmail" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="input-field pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-sky-600 hover:text-sky-500 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {error && formSubmitted && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-600 text-sm text-center">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn-primary w-full flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner w-5 h-5"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="h-5 w-5" />
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;