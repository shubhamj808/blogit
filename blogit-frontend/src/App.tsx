import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { getCurrentUser } from './redux/slices/authSlice';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Feed from './pages/Feed';

// Protected route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If user has a token, try to get current user data
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/feed" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <div>Create Post Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={<Profile />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<div>Post Detail Page (Coming Soon)</div>} />
          <Route
            path="/post/edit/:id"
            element={
              <ProtectedRoute>
                <div>Edit Post Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;