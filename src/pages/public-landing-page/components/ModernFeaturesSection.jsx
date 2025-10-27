import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Icon from '../../../components/AppIcon';

const ModernFeaturesSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
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


      </div>
    </section>
  );
};

export default ModernFeaturesSection;