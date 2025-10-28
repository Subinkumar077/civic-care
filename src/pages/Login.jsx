import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AnimatedCard from '../components/ui/AnimatedCard';
import Icon from '../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      // Get user role from metadata or profile and redirect accordingly
      const userRole = user?.user_metadata?.role;
      if (userRole === 'admin' || userRole === 'department_manager') {
        navigate('/admin-dashboard');
      } else {
        navigate('/public-landing-page');
      }
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
      // Check if signIn function exists (authentication is configured)
      if (signIn) {
        const { data, error } = await signIn(formData?.email, formData?.password);
        
        if (error) {
          if (error?.message?.includes('Invalid login credentials') || 
              error?.message?.includes('Email not confirmed') ||
              error?.message?.includes('Invalid email or password')) {
            setAuthError('Invalid email or password. Please check your credentials and try again.');
          } else if (error?.message?.includes('Failed to fetch') || 
                     error?.message?.includes('AuthRetryableFetchError')) {
            setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
          } else {
            setAuthError(error?.message || 'An error occurred during sign in. Please try again.');
          }
        } else if (data?.user) {
          // Redirect based on user role
          const userRole = data?.user?.user_metadata?.role;
          if (userRole === 'admin' || userRole === 'department_manager') {
            navigate('/admin-dashboard');
          } else {
            navigate('/public-landing-page');
          }
        }
      } else {
        // Demo mode - just redirect to landing page
        console.log('Demo login with:', formData.email);
        setTimeout(() => {
          navigate('/public-landing-page');
        }, 1000);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('Authentication service not configured. Redirecting to demo mode...');
      setTimeout(() => {
        navigate('/public-landing-page');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    setAuthError('');
    setErrors({});
  };

  const { animations, hoverEffects, reducedMotion } = useTheme();

  return (
    <PageLayout showFooter={false} backgroundPattern>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={animations.fadeInDown.initial}
            animate={animations.fadeInDown.animate}
            transition={animations.fadeInDown.transition}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              {...hoverEffects.glow}
            >
              <Icon name="LogIn" size={24} color="white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Sign in to continue to your CivicCare dashboard
            </p>
          </motion.div>

          {/* Demo Credentials */}
          <AnimatedCard 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-4 mb-6"
            delay={0.2}
            hoverEffect="scale"
          >
            <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Icon name="Zap" size={16} className="mr-2" />
              Quick Demo Access
            </h3>
            <div className="space-y-2">
              <motion.button
                onClick={() => handleDemoLogin('admin@civic.gov', 'admin123')}
                className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-xl border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                {...hoverEffects.lift}
              >
                <div className="text-sm">
                  <div className="font-medium text-blue-800 flex items-center">
                    <Icon name="Shield" size={14} className="mr-2" />
                    Admin Account
                  </div>
                  <div className="text-blue-600 text-xs mt-1">admin@civic.gov / admin123</div>
                </div>
              </motion.button>
              <motion.button
                onClick={() => handleDemoLogin('citizen@example.com', 'citizen123')}
                className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-xl border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                {...hoverEffects.lift}
              >
                <div className="text-sm">
                  <div className="font-medium text-blue-800 flex items-center">
                    <Icon name="User" size={14} className="mr-2" />
                    Citizen Account
                  </div>
                  <div className="text-blue-600 text-xs mt-1">citizen@example.com / citizen123</div>
                </div>
              </motion.button>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={0.4}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Auth Error */}
              {authError && (
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Sign In Error</h3>
                      <p className="text-sm text-red-700 mt-1">{authError}</p>
                      <motion.button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(authError)}
                        className="text-xs text-red-600 underline hover:no-underline mt-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Copy error message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
                autoComplete="email"
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                required
                autoComplete="current-password"
              />

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  iconName="LogIn"
                  iconPosition="left"
                  iconSize={16}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.div 
              className="text-center mt-6 pt-6 border-t border-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-purple-600 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </AnimatedCard>

          {/* Additional Info */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <p className="text-xs text-slate-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;