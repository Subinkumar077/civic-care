import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const ModernTestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Local Resident',
      location: 'Mumbai, Maharashtra',
      avatar: '👩‍💼',
      rating: 5,
      text: "CivicCare has transformed how I engage with my local government. I reported a broken streetlight and received updates every step of the way. It was fixed within 3 days!",
      category: 'Infrastructure'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Community Leader',
      location: 'Delhi, NCR',
      avatar: '👨‍💼',
      rating: 5,
      text: "The transparency and real-time tracking feature is incredible. Our community has reported over 50 issues, and 80% have been resolved. This platform really works!",
      category: 'Community Impact'
    },
    {
      id: 3,
      name: 'Dr. Anita Patel',
      role: 'Healthcare Professional',
      location: 'Ahmedabad, Gujarat',
      avatar: '👩‍⚕️',
      rating: 5,
      text: "As a healthcare worker, I appreciate how easy it is to report sanitation issues. The photo evidence feature and GPS tracking make the process so efficient.",
      category: 'Public Health'
    }
  ];

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            What Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 ml-3">
              Community Says
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real stories from citizens who are making a difference in their communities 
            through CivicCare platform.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Icon name="Quote" size={32} className="text-white" />
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed text-center mb-8 font-medium">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-slate-800">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-slate-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-slate-500 text-sm flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{testimonials[currentTestimonial].location}</span>
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mt-6 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-100 to-red-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                    {testimonials[currentTestimonial].category}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-slate-600 hover:text-blue-600"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-slate-600 hover:text-blue-600"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? 'bg-blue-600 w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonialsSection;