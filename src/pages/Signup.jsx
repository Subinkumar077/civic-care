import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Icon from '../components/AppIcon';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'citizen'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const roleOptions = [
    { value: 'citizen', label: 'Citizen', description: 'Report and track community issues' },
    { value: 'department_manager', label: 'Department Manager', description: 'Manage departmental issues' }
  ];

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

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData?.phone && !/^[\+]?[1-9][\d]{0,15}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError('');
    setSuccessMessage('');

    try {
      console.log('🚀 Starting signup process for:', formData?.email);

      // Step 1: Create the user account
      const { data, error } = await supabase?.auth?.signUp({
        email: formData?.email,
        password: formData?.password,
        options: {
          data: {
            full_name: formData?.fullName,
            role: formData?.role,
            phone: formData?.phone
          }
        }
      });

      console.log('📝 Signup response:', { data, error });

      if (error) {
        console.error('❌ Signup error:', error);
        if (error?.message?.includes('User already registered')) {
          setAuthError('An account with this email already exists. Please sign in instead.');
        } else if (error?.message?.includes('Failed to fetch') ||
          error?.message?.includes('AuthRetryableFetchError')) {
          setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setAuthError(error?.message || 'An error occurred during sign up. Please try again.');
        }
        return;
      }

      if (!data?.user) {
        console.error('❌ No user data returned from signup');
        setAuthError('Account creation failed. Please try again.');
        return;
      }

      console.log('✅ User created successfully:', data.user.id);

      // Step 2: Create user profile manually (in case trigger doesn't work)
      try {
        console.log('👤 Creating user profile...');
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.user.id,
            email: formData?.email,
            full_name: formData?.fullName,
            role: formData?.role,
            phone: formData?.phone || null
          }]);

        if (profileError && !profileError.message.includes('duplicate key')) {
          console.warn('⚠️ Profile creation failed:', profileError);
          // Don't fail the signup for this
        } else {
          console.log('✅ User profile created successfully');
        }
      } catch (profileCreationError) {
        console.warn('⚠️ Profile creation error:', profileCreationError);
        // Don't fail the signup for this
      }

      // Step 3: Show success message and handle redirection
      if (data?.user?.email_confirmed_at) {
        // User is immediately confirmed - try to sign them in
        console.log('🔐 User confirmed, attempting automatic sign in...');

        setSuccessMessage('🎉 Account created successfully! Signing you in...');

        // Wait a moment for the profile to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          const { data: signInData, error: signInError } = await supabase?.auth?.signInWithPassword({
            email: formData?.email,
            password: formData?.password
          });

          if (signInError) {
            console.error('❌ Auto sign-in failed:', signInError);
            setSuccessMessage('🎉 Account created successfully! Please sign in with your credentials.');
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            console.log('✅ Auto sign-in successful, redirecting...');
            setSuccessMessage('🎉 Account created successfully! Redirecting to your dashboard...');
            setTimeout(() => {
              const userRole = formData?.role;
              if (userRole === 'admin' || userRole === 'department_manager') {
                navigate('/admin-dashboard');
              } else {
                navigate('/public-landing-page');
              }
            }, 2000);
          }
        } catch (autoSignInError) {
          console.error('❌ Auto sign-in error:', autoSignInError);
          setSuccessMessage('🎉 Account created successfully! Please sign in with your credentials.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        // User needs to confirm email
        console.log('📧 Email confirmation required');
        setSuccessMessage('🎉 Account created successfully! Please check your email to confirm your account before signing in.');
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      }

    } catch (error) {
      console.error('💥 Unexpected signup error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="UserPlus" size={24} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join CivicHub to report and track community issues.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Auth Error */}
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Sign Up Error</h3>
                      <p className="text-sm text-red-700 mt-1">{authError}</p>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(authError)}
                        className="text-xs text-red-600 underline hover:no-underline mt-2"
                      >
                        Copy error message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData?.fullName}
                onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                error={errors?.fullName}
                required
                autoComplete="name"
              />

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
                placeholder="Create a password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                required
                autoComplete="new-password"
                description="Password must be at least 6 characters long"
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData?.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                error={errors?.confirmPassword}
                required
                autoComplete="new-password"
              />

              {/* Phone (Optional) */}
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                autoComplete="tel"
                description="We'll send SMS updates about your reports"
              />

              {/* Role */}
              <Select
                label="Account Type"
                options={roleOptions}
                value={formData?.role}
                onChange={(value) => handleInputChange('role', value)}
                error={errors?.role}
                required
                description="Choose your account type based on your role in the community"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                iconName="UserPlus"
                iconPosition="left"
                iconSize={16}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;