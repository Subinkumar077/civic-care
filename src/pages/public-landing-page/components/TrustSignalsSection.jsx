import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignalsSection = () => {
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

  const governmentBadges = [
    {
      id: 1,
      name: 'Digital India Initiative',
      icon: '🇮🇳',
      description: 'Certified under Digital India program'
    },
    {
      id: 2,
      name: 'Smart Cities Mission',
      icon: '🏙️',
      description: 'Part of Smart Cities initiative'
    },
    {
      id: 3,
      name: 'Make in India',
      icon: '🛠️',
      description: 'Supporting local innovation'
    }
  ];

  const achievements = [
    {
      icon: 'Award',
      title: 'Best Civic App 2024',
      description: 'National Digital Governance Award'
    },
    {
      icon: 'Star',
      title: '4.8/5 Rating',
      description: 'Based on 10,000+ user reviews'
    },
    {
      icon: 'Shield',
      title: 'ISO 27001 Certified',
      description: 'Information security management'
    },
    {
      icon: 'CheckCircle',
      title: '99.9% Uptime',
      description: 'Reliable 24/7 service availability'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Government Compliance Badges */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Trusted &
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 ml-3">
              Certified Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            Officially recognized and certified by government authorities for security,
            compliance, and digital governance standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {governmentBadges?.map((badge, index) => (
              <div
                key={badge?.id}
                className={`group transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {badge?.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {badge?.name}
                  </h3>
                  <p className="text-slate-600">{badge?.description}</p>

                  {/* Hover Effect Line */}
                  <div className="w-0 h-1 bg-gradient-to-r from-blue-600 to-red-600 mt-6 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`mb-16 transition-all duration-1000 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements?.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon name={achievement?.icon} size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {achievement?.title}
                </h3>
                <p className="text-slate-600 text-sm">{achievement?.description}</p>
              </div>
            ))}
          </div>
        </div>




      </div>
    </section>
  );
};

export default TrustSignalsSection;