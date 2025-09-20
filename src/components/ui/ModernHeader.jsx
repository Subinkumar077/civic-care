import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import Icon from '../AppIcon';

const ModernHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location?.pathname === path;

  const navigationLinks = [
    { path: '/public-landing-page', label: 'Home', icon: 'Home' },
    { path: '/public-reports-listing', label: 'Reports', icon: 'FileText' },
    { path: '/how-it-works', label: 'How It Works', icon: 'HelpCircle' },
    { path: '/impact', label: 'Impact', icon: 'TrendingUp' },
    { path: '/analytics-dashboard', label: 'Analytics', icon: 'BarChart3' },
    { path: '/support', label: 'Support', icon: 'MessageCircle' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/public-landing-page');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/public-landing-page" 
            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-200 ${
                isScrolled ? 'text-slate-800' : 'text-slate-800'
              }`}>
                Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">Care</span>
              </h1>
              <p className={`text-xs transition-colors duration-200 ${
                isScrolled ? 'text-slate-500' : 'text-slate-600'
              }`}>
                Community First
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : `${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-slate-700 hover:text-blue-600'} hover:bg-blue-50`
                }`}
              >
                <Icon name={link.icon} size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Menu */}
                <div className="flex items-center space-x-3 bg-slate-100 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={16} className="text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">{userProfile?.full_name || user.email?.split('@')[0]}</p>
                    <p className="text-slate-500 text-xs">Welcome back!</p>
                  </div>
                </div>

                {/* Dashboard Button */}
                <Button
                  onClick={() => navigate(userProfile?.role === 'admin' ? '/admin-dashboard' : '/public-reports-listing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </Button>

                {/* Sign Out */}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:border-red-300 hover:text-red-600 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-600 px-6 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
              isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              {/* Navigation Links */}
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon name={link.icon} size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-slate-100 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Icon name="User" size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{userProfile?.full_name || user.email?.split('@')[0]}</p>
                        <p className="text-slate-500 text-sm">Welcome back!</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        navigate(userProfile?.role === 'admin' ? '/admin-dashboard' : '/public-reports-listing');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:border-red-300 hover:text-red-600 py-3 rounded-xl font-medium"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-600 py-3 rounded-xl font-medium"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;