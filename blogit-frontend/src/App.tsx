import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Layout from './components/layout/Layout';
import Feed from './pages/Feed';

// Protected route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          {/* Add more routes here as we create the components */}
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
                <div>Profile Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
          <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />
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