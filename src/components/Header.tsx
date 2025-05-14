import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getDashboardLink = () => {
    if (user?.role === 'student') return '/student-dashboard';
    if (user?.role === 'alumni') return '/alumni-dashboard';
    if (user?.role === 'department') return '/department-dashboard';
    return '/';
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center">
              <GraduationCap className="h-8 w-8 text-amber-400" />
              <span className="ml-2 text-xl font-bold">LloydAlumni</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                >
                  Dashboard
                </Link>
                
                {user.role !== 'department' && (
                  <Link 
                    to="/profile"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                  >
                    Profile
                  </Link>
                )}
                
                <div className="flex items-center ml-4">
                  <span className="text-sm font-medium mr-2">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition duration-150 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {user.role !== 'department' && (
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-1" />
                    Profile
                  </Link>
                )}
                
                <div className="border-t border-blue-700 pt-2 mt-2">
                  <span className="block px-3 py-1 text-sm opacity-75">{user.name}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 transition duration-150 mt-1"
                  >
                    <LogOut className="h-4 w-4 inline mr-1" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;