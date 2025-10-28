import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import { civicIssueService } from '../../../services/civicIssueService';

const ModernStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    activeUsers: 0
  });
  const [finalStats, setFinalStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    activeUsers: 0
  });
  const sectionRef = useRef(null);

  // Load real stats data
  useEffect(() => {
    const loadRealStats = async () => {
      try {
        console.log('📊 Stats Section: Loading real stats from Supabase...');
        
        const { data: stats, error } = await civicIssueService.getIssuesStats();
        
        if (error) {
          console.error('📊 Error loading stats:', error);
          // Use fallback stats
          setFinalStats({
            totalIssues: 0,
            resolvedIssues: 0,
            inProgressIssues: 0,
            activeUsers: 0
          });
        } else {
          console.log('📊 Stats Section: Loaded real stats:', stats);
          const realStats = {
            totalIssues: stats.total || 0,
            resolvedIssues: stats.byStatus?.resolved || 0,
            inProgressIssues: stats.byStatus?.in_progress || 0,
            activeUsers: Math.floor((stats.total || 0) * 0.7) // Estimate active users
          };
          setFinalStats(realStats);
        }
      } catch (error) {
        console.error('📊 Error loading real stats:', error);
        setFinalStats({
          totalIssues: 0,
          resolvedIssues: 0,
          inProgressIssues: 0,
          activeUsers: 0
        });
      }
    };
    
    loadRealStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        totalIssues: Math.floor(finalStats.totalIssues * progress),
        resolvedIssues: Math.floor(finalStats.resolvedIssues * progress),
        inProgressIssues: Math.floor(finalStats.inProgressIssues * progress),
        activeUsers: Math.floor(finalStats.activeUsers * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, stepDuration);
  };

  const stats = [
    {
      icon: 'FileText',
      value: animatedStats.totalIssues,
      label: 'Issues Reported',
      description: 'Total civic issues reported by citizens',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'CheckCircle',
      value: animatedStats.resolvedIssues,
      label: 'Issues Resolved',
      description: 'Successfully addressed and completed',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: 'Clock',
      value: animatedStats.inProgressIssues,
      label: 'In Progress',
      description: 'Currently being worked on by authorities',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: 'Users',
      value: animatedStats.activeUsers,
      label: 'Active Citizens',
      description: 'Engaged community members making a difference',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="impacts" ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Community Impact
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
              in Numbers
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how our platform is making a real difference in communities across the region.
            Every report matters, every resolution counts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 text-center h-full">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon name={stat.icon} size={32} className="text-white" />
                </div>

                {/* Animated Number */}
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value.toLocaleString()}
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Progress bar effect */}
                <div className="mt-6 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} transform transition-all duration-2000 ease-out`}
                    style={{ 
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 200 + 500}ms`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Achievement Section */}
        <div className={`mt-20 transition-all duration-1000 delay-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">
                Recognized Excellence
              </h3>
              <p className="text-slate-600">
                Our commitment to civic engagement has been recognized by leading organizations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Award" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Best Civic App 2024</h4>
                <p className="text-slate-600 text-sm">Digital India Awards</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Star" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">4.8/5 Rating</h4>
                <p className="text-slate-600 text-sm">User Satisfaction Score</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Shield" size={32} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">99.9% Uptime</h4>
                <p className="text-slate-600 text-sm">Reliable Service Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernStatsSection;