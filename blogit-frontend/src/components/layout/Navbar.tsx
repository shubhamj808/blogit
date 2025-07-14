import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUser, 
  FiPlusCircle, 
  FiLogIn, 
  FiLogOut,
  FiUserPlus
} from 'react-icons/fi';

const navLinks = [
  { to: '/feed', label: 'Feed', auth: true, icon: FiHome },
  { to: '/create', label: 'Create Post', auth: true, icon: FiPlusCircle },
  { to: '/profile', label: 'Profile', auth: true, icon: FiUser },
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-sky-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-sky-200 transition-colors duration-200"
            >
              <span className="text-3xl">📝</span>
              <span>Blogit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Home Link */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/')
                  ? 'bg-sky-800 text-white shadow-md'
                  : 'text-sky-100 hover:bg-sky-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiHome size={18} />
              <span>Home</span>
            </Link>

            {/* Authenticated Links */}
            {isAuthenticated && navLinks.map(link => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-sky-800 text-white shadow-md'
                      : 'text-sky-100 hover:bg-sky-800 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-sky-700">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-sky-100">
                    <FiUser size={16} />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-sky-100 hover:text-white hover:bg-sky-800 rounded-lg transition-all duration-200"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-sky-100 hover:text-white hover:bg-sky-800 rounded-lg transition-all duration-200"
                  >
                    <FiLogIn size={16} />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-sky-900 bg-white hover:bg-sky-50 rounded-lg transition-all duration-200 shadow-md"
                  >
                    <FiUserPlus size={16} />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-sky-100 hover:text-white hover:bg-sky-800 transition-all duration-200"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-sky-800 rounded-lg mt-2 shadow-xl">
            <div className="px-4 py-3 space-y-2">
              {/* Home Link */}
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-sky-700 text-white'
                    : 'text-sky-100 hover:bg-sky-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiHome size={20} />
                <span>Home</span>
              </Link>

              {/* Authenticated Links */}
              {isAuthenticated && navLinks.map(link => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                      isActive(link.to)
                        ? 'bg-sky-700 text-white'
                        : 'text-sky-100 hover:bg-sky-700 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Auth Section */}
              <div className="pt-4 pb-2 border-t border-sky-600">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-3 text-base font-semibold text-sky-100">
                      <FiUser size={20} />
                      <span>{user?.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-3 py-3 text-base font-semibold text-sky-100 hover:bg-sky-700 hover:text-white rounded-lg transition-all duration-200"
                    >
                      <FiLogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-3 py-3 text-base font-semibold text-sky-100 hover:bg-sky-700 hover:text-white rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiLogIn size={20} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-3 py-3 mt-2 text-base font-semibold text-sky-900 bg-white hover:bg-sky-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiUserPlus size={20} />
                      <span>Register</span>
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
