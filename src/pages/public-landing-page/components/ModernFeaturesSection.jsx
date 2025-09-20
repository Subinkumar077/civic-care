import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const ModernFeaturesSection = () => {
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
      title: 'Photo Evidence',
      description: 'Capture clear images of civic issues with automatic GPS tagging for precise location tracking.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      delay: '0ms'
    },
    {
      icon: 'MapPin',
      title: 'GPS Location',
      description: 'Automatic location detection ensures authorities know exactly where the issue is located.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      delay: '200ms'
    },
    {
      icon: 'Clock',
      title: 'Real-Time Updates',
      description: 'Get instant WhatsApp notifications when your reported issues are being addressed or resolved.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      delay: '400ms'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 ml-3">
              Civic Engagement
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with user-friendly design 
            to make civic reporting simple, effective, and transparent.
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
              Ready to Make a Difference?
            </h3>
            <p className="text-slate-600 mb-6">
              Join thousands of citizens who are actively improving their communities through civic engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Icon name="Play" size={16} />
                <span>Watch Demo</span>
              </button>
              <button className="border-2 border-slate-300 text-slate-700 hover:border-slate-400 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Icon name="BookOpen" size={16} />
                <span>Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;