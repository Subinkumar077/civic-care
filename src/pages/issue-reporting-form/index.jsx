import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import CategorySelector from './components/CategorySelector';
import VoiceInput from './components/VoiceInput';
import ImageUpload from './components/ImageUpload';
import LocationSelector from './components/LocationSelector';
import FormProgress from './components/FormProgress';
import ReportingTips from './components/ReportingTips';
import { useAuth } from '../../contexts/AuthContext';
import { useCivicIssues } from '../../hooks/useCivicIssues';

const IssueReportingForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createIssue } = useCivicIssues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    images: [],
    location: {
      address: '',
      coordinates: null
    },
    priority: 'medium',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Voice input state
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Initialize contact info with current user data
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          name: user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || '',
          email: user?.email || '',
          phone: user?.phone || ''
        }
      }));
    }
  }, [user, isAuthenticated]);

  // Calculate form progress
  const getFormProgress = () => {
    const requiredFields = ['category', 'title', 'description', 'location.address'];
    const completedFields = requiredFields?.filter(field => {
      if (field?.includes('.')) {
        const [parent, child] = field?.split('.');
        return formData?.[parent] && formData?.[parent]?.[child];
      }
      return formData?.[field];
    })?.length;

    return {
      completed: completedFields,
      total: requiredFields?.length,
      percentage: Math.round((completedFields / requiredFields?.length) * 100)
    };
  };

  const progress = getFormProgress();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.category) {
      newErrors.category = 'Please select an issue category';
    }

    if (!formData?.title?.trim()) {
      newErrors.title = 'Issue title is required';
    } else if (formData?.title?.trim()?.length < 10) {
      newErrors.title = 'Title should be at least 10 characters long';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Issue description is required';
    } else if (formData?.description?.trim()?.length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }

    if (!formData?.location?.address?.trim()) {
      newErrors.location = 'Location address is required';
    }

    // Only validate contact info if user is not authenticated
    if (!isAuthenticated) {
      if (!formData?.contactInfo?.name?.trim()) {
        newErrors.contactName = 'Contact name is required';
      }

      if (!formData?.contactInfo?.email?.trim()) {
        newErrors.contactEmail = 'Contact email is required';
      } else if (!/\S+@\S+\.\S+/?.test(formData?.contactInfo?.email)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }

      if (!formData?.contactInfo?.phone?.trim()) {
        newErrors.contactPhone = 'Contact phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { success, data, error } = await createIssue(formData);
      
      if (!success) {
        setSubmitError(error || 'Failed to submit report. Please try again.');
        return;
      }
      
      setShowSuccessMessage(true);
      
      // Redirect after success message
      setTimeout(() => {
        navigate('/public-reports-listing');
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle draft save
  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    
    try {
      // Store draft in localStorage for now
      const draftKey = `civic_issue_draft_${user?.id || 'anonymous'}`;
      localStorage.setItem(draftKey, JSON.stringify({
        ...formData,
        savedAt: new Date()?.toISOString()
      }));
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Draft save error:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript) => {
    if (transcript?.trim()) {
      setFormData(prev => ({
        ...prev,
        description: prev?.description + (prev?.description ? ' ' : '') + transcript
      }));
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev?.contactInfo,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = `contact${field?.charAt(0)?.toUpperCase() + field?.slice(1)}`;
    if (errors?.[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-green-700 mb-2">Report Submitted Successfully!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your issue has been submitted and is being reviewed. You'll receive updates via email and SMS.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Report ID: <span className="font-mono font-medium">RPT-{Date.now()}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to reports list...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg">
              {/* Form Header */}
              <div className="border-b border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Plus" size={20} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">Report an Issue</h1>
                    <p className="text-sm text-muted-foreground">
                      Help improve your community by reporting civic issues
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Authentication Notice */}
                {!isAuthenticated && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">Anonymous Reporting</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          You're reporting anonymously. Consider <button 
                            type="button"
                            onClick={() => navigate('/login')}
                            className="underline hover:no-underline font-medium"
                          >
                            signing in
                          </button> to track your report status and receive updates.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                        <p className="text-sm text-red-700 mt-1">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                <CategorySelector
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors?.category}
                />

                {/* Issue Title */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={18} className="text-primary" />
                    <h3 className="text-sm font-medium text-text-primary">Issue Title</h3>
                    <span className="text-accent">*</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Brief, descriptive title for the issue"
                    value={formData?.title}
                    onChange={(e) => handleInputChange('title', e?.target?.value)}
                    error={errors?.title}
                    required
                    description="Provide a clear, concise title that summarizes the issue"
                  />
                </div>

                {/* Issue Description */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlignLeft" size={18} className="text-primary" />
                    <h3 className="text-sm font-medium text-text-primary">Issue Description</h3>
                    <span className="text-accent">*</span>
                  </div>
                  
                  <div className="space-y-3">
                    <textarea
                      placeholder="Provide detailed description of the issue, including when it started, how it affects you, and any other relevant information..."
                      value={formData?.description}
                      onChange={(e) => handleInputChange('description', e?.target?.value)}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-vertical ${
                        errors?.description ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors?.description && (
                      <p className="text-sm text-destructive">{errors?.description}</p>
                    )}
                    
                    {/* Voice Input */}
                    <VoiceInput
                      onTranscript={handleVoiceTranscript}
                      isActive={isVoiceActive}
                      onToggle={setIsVoiceActive}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <ImageUpload
                  images={formData?.images}
                  onImagesChange={(images) => handleInputChange('images', images)}
                />

                {/* Location Selection */}
                <LocationSelector
                  location={formData?.location}
                  onLocationChange={(location) => handleInputChange('location', location)}
                  error={errors?.location}
                />

                {/* Priority Selection */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={18} className="text-primary" />
                    <h3 className="text-sm font-medium text-text-primary">Priority Level</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700', description: 'Non-urgent issue' },
                      { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', description: 'Moderate concern' },
                      { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200', description: 'Urgent attention needed' }
                    ]?.map((priority) => (
                      <button
                        key={priority?.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority?.value)}
                        className={`p-3 border rounded-md text-center transition-all ${
                          formData?.priority === priority?.value
                            ? `${priority?.color} border-current`
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="text-sm font-medium">{priority?.label}</p>
                        <p className="text-xs opacity-75">{priority?.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Information - Only show if not authenticated */}
                {!isAuthenticated && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={18} className="text-primary" />
                      <h3 className="text-sm font-medium text-text-primary">Contact Information</h3>
                      <span className="text-accent">*</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="Your full name"
                        value={formData?.contactInfo?.name}
                        onChange={(e) => handleContactInfoChange('name', e?.target?.value)}
                        error={errors?.contactName}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData?.contactInfo?.email}
                        onChange={(e) => handleContactInfoChange('email', e?.target?.value)}
                        error={errors?.contactEmail}
                        required
                      />
                    </div>
                    
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData?.contactInfo?.phone}
                      onChange={(e) => handleContactInfoChange('phone', e?.target?.value)}
                      error={errors?.contactPhone}
                      required
                      description="We'll send SMS updates about your report status"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={progress?.percentage < 100}
                    iconName="Send"
                    iconPosition="left"
                    iconSize={16}
                    className="flex-1 sm:flex-none"
                  >
                    {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    loading={isDraftSaving}
                    iconName="Save"
                    iconPosition="left"
                    iconSize={16}
                  >
                    {isDraftSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/public-landing-page')}
                    iconName="X"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <FormProgress
              currentStep={0}
              totalSteps={4}
              completedFields={progress?.completed}
              totalFields={progress?.total}
            />

            {/* Reporting Tips */}
            <ReportingTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueReportingForm;