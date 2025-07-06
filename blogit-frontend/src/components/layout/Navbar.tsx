import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { to: '/feed', label: 'Feed', auth: true },
  { to: '/create', label: 'Create Post', auth: true },
  { to: '/profile', label: 'Profile', auth: true },
];

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">Blogit</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${location.pathname === '/'
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {navLinks.map(link => {
                if (link.auth && !isAuthenticated) return null;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${location.pathname === link.to
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center space-x-4 ml-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 font-medium">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">Login</Link>
                  <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">Register</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            >
              {isOpen ? <FiX size={24} color="#4B5563" /> : <FiMenu size={24} color="#4B5563" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {navLinks.map(link => {
                if (link.auth && !isAuthenticated) return null;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === link.to
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-700">{user?.username}</div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 mt-1 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
