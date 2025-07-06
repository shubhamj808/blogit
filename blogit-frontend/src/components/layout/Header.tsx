import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import './navbar-header.css';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Blogit</Link>
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <Link to="/feed" className="navbar-link">Feed</Link>
        {isAuthenticated && (
          <>
            <Link to="/create" className="navbar-link">Create Post</Link>
            <Link to="/profile" className="navbar-link">Profile</Link>
            <span className="navbar-link">{user?.username}</span>
            <button onClick={handleLogout} className="btn btn-login">Logout</button>
          </>
        )}
        <Link to="/" className="navbar-link">Home</Link>
      </div>
    </nav>
  );
};

export default Header;