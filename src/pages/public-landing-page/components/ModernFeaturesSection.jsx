import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Icon from '../../../components/AppIcon';

const ModernFeaturesSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: 'Camera',
      title: t('features.photoEvidence.title'),
      description: t('features.photoEvidence.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      delay: '0ms'
    },
    {
      icon: 'MapPin',
      title: t('features.gpsLocation.title'),
      description: t('features.gpsLocation.description'),
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      delay: '200ms'
    },
    {
      icon: 'Clock',
      title: t('features.realTimeUpdates.title'),
      description: t('features.realTimeUpdates.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      delay: '400ms'
    }
  ];

  // Professional click handlers with analytics and loading states
  const handleWatchDemo = async () => {
    setIsVideoLoading(true);
    
    // Analytics tracking (industry standard)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'watch_demo_click', {
        event_category: 'engagement',
        event_label: 'features_section'
      });
    }
    
    try {
      // Open video with proper error handling
      const videoWindow = window.open('https://youtu.be/W7RUg8MU9kw', '_blank', 'noopener,noreferrer');
      if (!videoWindow) {
        // Fallback for popup blockers
        window.location.href = 'https://youtu.be/W7RUg8MU9kw';
      }
    } catch (error) {
      console.error('Error opening video:', error);
      // Fallback navigation
      window.location.href = 'https://youtu.be/W7RUg8MU9kw';
    } finally {
      // Reset loading state after a brief delay
      setTimeout(() => setIsVideoLoading(false), 1000);
    }
  };

  const handleLearnMore = async () => {
    setIsDocsLoading(true);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'learn_more_click', {
        event_category: 'engagement',
        event_label: 'features_section'
      });
    }
    
    try {
      const docsWindow = window.open(
        'https://docs.google.com/document/d/147MQGz50JO2LCoIcUvrlS-DT53I7GXTEa7Ie-Z1ycpA/edit?usp=drivesdkadd', 
        '_blank', 
        'noopener,noreferrer'
      );
      if (!docsWindow) {
        window.location.href = 'https://docs.google.com/document/d/147MQGz50JO2LCoIcUvrlS-DT53I7GXTEa7Ie-Z1ycpA/edit?usp=drivesdkadd';
      }
    } catch (error) {
      console.error('Error opening documentation:', error);
      window.location.href = 'https://docs.google.com/document/d/147MQGz50JO2LCoIcUvrlS-DT53I7GXTEa7Ie-Z1ycpA/edit?usp=drivesdkadd';
    } finally {
      setTimeout(() => setIsDocsLoading(false), 1000);
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white" role="region" aria-labelledby="features-heading">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {t('features.title')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 ml-3">
              {t('features.titleAccent')}
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: feature.delay }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature.icon} size={32} className={feature.color} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`w-0 h-1 ${feature.color.replace('text-', 'bg-')} mt-6 group-hover:w-full transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-600 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              {t('features.ctaTitle')}
            </h3>
            <p className="text-slate-600 mb-6">
              {t('features.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Call to action buttons">
              {/* Professional Watch Demo Button */}
              <button 
                onClick={handleWatchDemo}
                disabled={isVideoLoading}
                className={`
                  group relative overflow-hidden
                  bg-gradient-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800
                  disabled:from-blue-400 disabled:to-blue-500
                  text-white px-8 py-4 rounded-xl font-semibold 
                  transition-all duration-300 ease-out
                  transform hover:scale-105 hover:shadow-xl
                  disabled:transform-none disabled:cursor-not-allowed
                  flex items-center justify-center space-x-3
                  min-w-[180px] h-[56px]
                  focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                  active:scale-95
                `}
                aria-label={`${t('features.watchDemo')} - Opens in new tab`}
                type="button"
              >
                {/* Loading spinner overlay */}
                {isVideoLoading && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Button content */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Icon 
                      name="Play" 
                      size={18} 
                      className={`transition-transform duration-300 ${isVideoLoading ? 'scale-0' : 'group-hover:scale-110'}`} 
                    />
                  </div>
                  <span className="font-medium tracking-wide">
                    {isVideoLoading ? 'Opening...' : t('features.watchDemo')}
                  </span>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                {/* External link indicator */}
                <Icon name="ExternalLink" size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Professional Learn More Button */}
              <button 
                onClick={handleLearnMore}
                disabled={isDocsLoading}
                className={`
                  group relative overflow-hidden
                  bg-white border-2 border-slate-300 
                  hover:border-slate-400 hover:bg-slate-50
                  disabled:border-slate-200 disabled:bg-slate-100
                  text-slate-700 hover:text-slate-900
                  disabled:text-slate-400 disabled:cursor-not-allowed
                  px-8 py-4 rounded-xl font-semibold 
                  transition-all duration-300 ease-out
                  transform hover:scale-105 hover:shadow-lg
                  disabled:transform-none
                  flex items-center justify-center space-x-3
                  min-w-[180px] h-[56px]
                  focus:outline-none focus:ring-4 focus:ring-slate-300 focus:ring-opacity-50
                  active:scale-95
                `}
                aria-label={`${t('features.learnMore')} - Opens documentation in new tab`}
                type="button"
              >
                {/* Loading spinner overlay */}
                {isDocsLoading && (
                  <div className="absolute inset-0 bg-slate-100 bg-opacity-80 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Button content */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Icon 
                      name="BookOpen" 
                      size={18} 
                      className={`transition-transform duration-300 ${isDocsLoading ? 'scale-0' : 'group-hover:scale-110'}`} 
                    />
                  </div>
                  <span className="font-medium tracking-wide">
                    {isDocsLoading ? 'Opening...' : t('features.learnMore')}
                  </span>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                
                {/* External link indicator */}
                <Icon name="ExternalLink" size={14} className="opacity-50 group-hover:opacity-70 transition-opacity" />
              </button>
            </div>
            
            {/* Professional trust indicators */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-blue-500" />
                <span>3 min demo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-purple-500" />
                <span>Complete documentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;