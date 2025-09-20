import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const DataSecuritySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using AES-256 encryption standards',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and secure login protocols',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: 'Eye',
      title: 'Privacy Protection',
      description: 'Your personal information is never shared without consent',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: 'FileCheck',
      title: 'Compliance Ready',
      description: 'GDPR compliant and follows government data protection laws',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border border-white rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
            <Icon name="Shield" size={40} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Data is
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 ml-3">
              Safe & Secure
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We take data security seriously. Your information is protected with enterprise-grade 
            security measures and strict privacy controls.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-700 transition-all duration-300 transform hover:-translate-y-2 border border-slate-700 text-center h-full">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature.icon} size={32} className={feature.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className={`transition-all duration-1000 delay-600 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Trusted & Certified
              </h3>
              <p className="text-slate-300">
                Our platform meets the highest security and compliance standards
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Shield" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-white mb-2">ISO 27001</h4>
                <p className="text-slate-400 text-sm">Information Security Management</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="FileCheck" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-white mb-2">GDPR Compliant</h4>
                <p className="text-slate-400 text-sm">Data Protection Regulation</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Award" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-white mb-2">Government Approved</h4>
                <p className="text-slate-400 text-sm">Certified by Digital India</p>
              </div>
            </div>

            {/* Trust Statement */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30">
                <Icon name="CheckCircle" size={24} className="text-green-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  100% Transparency Guarantee
                </p>
                <p className="text-slate-300 text-sm">
                  We believe in complete transparency. You have full control over your data 
                  and can request deletion at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataSecuritySection;