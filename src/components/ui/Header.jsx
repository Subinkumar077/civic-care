import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/public-landing-page');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Demo credentials for easy testing
  const showDemoCredentials = location?.pathname === '/login' || location?.pathname === '/signup';

  const isActive = (path) => location?.pathname === path;

  const navigationItems = [
    { path: '/public-landing-page', label: 'Home', icon: 'Home' },
    { path: '/public-reports-listing', label: 'Reports', icon: 'FileText' },
    { path: '/interactive-issue-map', label: 'Issue Map', icon: 'Map' },
    { path: '/issue-reporting-form', label: 'Report Issue', icon: 'Plus' },
    { path: '/analytics-dashboard', label: 'Analytics', icon: 'BarChart3' },
    ...(user && (userProfile?.role === 'admin' || user?.user_metadata?.role === 'admin')
      ? [{ path: '/admin-dashboard', label: 'Admin', icon: 'Shield' }]
      : [])
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/public-landing-page" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={18} color="white" />
            </div>
            <span className="text-xl font-bold text-text-primary">Civic Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item?.path)
                  ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-text-primary'
                  }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {userProfile?.role || 'Citizen'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  iconName="LogOut"
                  iconSize={16}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-text-primary"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item?.path)
                    ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-text-primary'
                    }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="border-t border-border pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-text-primary">
                        {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {userProfile?.role || 'Citizen'}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-text-primary"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-text-primary"
                    >
                      <Icon name="LogIn" size={16} />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      <Icon name="UserPlus" size={16} />
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      {/* Demo Credentials Banner */}
      {showDemoCredentials && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="container mx-auto">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">Demo Credentials for Testing:</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 text-xs text-blue-600">
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">Admin:</span>
                  <span>admin@civic.gov / admin123</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">Citizen:</span>
                  <span>citizen@example.com / citizen123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;