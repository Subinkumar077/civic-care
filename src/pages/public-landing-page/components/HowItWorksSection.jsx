import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import { useScrollAnimation, useStaggeredAnimation } from '../../../hooks/useScrollAnimation';
import { useTheme } from '../../../contexts/ThemeContext';

const HowItWorksSection = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const { animations, hoverEffects } = useTheme();
    const { ref: sectionRef, isInView } = useScrollAnimation();
    const { ref: stepsRef, visibleItems } = useStaggeredAnimation(5, 0.15);

    // Auto-advance steps for demonstration
    useEffect(() => {
        if (isInView) {
            const interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isInView]);

    const steps = [
        {
            icon: 'Camera',
            title: 'Report an Issue',
            description: 'Spot a problem in your community? Take a photo and describe the issue with our easy-to-use reporting form.',
            details: 'Our smart form captures location data automatically and guides you through providing all necessary details.',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: 'MapPin',
            title: 'Automatic Location Tracking',
            description: 'Your device automatically captures the precise location, ensuring authorities know exactly where to respond.',
            details: 'GPS coordinates and address details are securely stored to help municipal teams locate and address issues quickly.',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            icon: 'Users',
            title: 'Community Validation',
            description: 'Other community members can view and support your report, building collective voice for important issues.',
            details: 'Upvoting system helps prioritize urgent issues while preventing duplicate reports for the same problem.',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            icon: 'Bell',
            title: 'Real-time Updates',
            description: 'Receive notifications as your report progresses through review, assignment, and resolution stages.',
            details: 'Stay informed with status updates, estimated timelines, and completion notifications via email and in-app alerts.',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            icon: 'CheckCircle',
            title: 'Issue Resolution',
            description: 'Municipal authorities address the issue and mark it as resolved with before/after photos when possible.',
            details: 'Transparent resolution process with photo evidence and completion reports to show community impact.',
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
        }
    ];

    const features = [
        {
            icon: 'Smartphone',
            title: 'Mobile-First Design',
            description: 'Optimized for smartphones with offline capability and quick photo uploads.'
        },
        {
            icon: 'Shield',
            title: 'Privacy Protected',
            description: 'Your personal information is secure with optional anonymous reporting.'
        },
        {
            icon: 'Zap',
            title: 'Lightning Fast',
            description: 'Report issues in under 60 seconds with our streamlined interface.'
        },
        {
            icon: 'BarChart3',
            title: 'Data-Driven Insights',
            description: 'Analytics help authorities prioritize and allocate resources effectively.'
        }
    ];

    return (
        <section id="how-it-works" ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

            <div className="container mx-auto px-6 relative">
                {/* Section Header */}
                <AnimatedSection animation="fadeInUp" className="text-center mb-16">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-slate-800 mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        How It
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
                            Works
                        </span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-slate-600 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Our platform makes civic engagement simple and effective. Here's how you can make a difference in your community in just a few steps.
                    </motion.p>
                </AnimatedSection>

                {/* Interactive Steps */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Steps Navigation */}
                        <div ref={stepsRef} className="space-y-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${activeStep === index
                                        ? `${step.bgColor} ${step.borderColor} shadow-lg`
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={index < visibleItems ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    {...hoverEffects.lift}
                                >
                                    <div className="flex items-start space-x-4">
                                        <motion.div
                                            className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Icon name={step.icon} size={24} className="text-white" />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                                {index + 1}. {step.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                            {activeStep === index && (
                                                <motion.p
                                                    className="text-slate-500 text-xs mt-2 leading-relaxed"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {step.details}
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Visual Demonstration */}
                        <AnimatedSection animation="fadeInRight" delay={0.4}>
                            <motion.div
                                className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-center mb-6">
                                    <motion.div
                                        className={`w-20 h-20 bg-gradient-to-r ${steps[activeStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                        key={activeStep}
                                        initial={{ scale: 0.8, rotate: -10 }}
                                        animate={{ scale: 1.1, rotate: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <Icon name={steps[activeStep].icon} size={40} className="text-white" />
                                    </motion.div>
                                    <motion.h3
                                        className="text-2xl font-bold text-slate-800 mb-2"
                                        key={`title-${activeStep}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {steps[activeStep].title}
                                    </motion.h3>
                                    <motion.p
                                        className="text-slate-600"
                                        key={`desc-${activeStep}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        {steps[activeStep].description}
                                    </motion.p>
                                </div>

                                {/* Progress Indicator */}
                                <div className="flex justify-center space-x-2 mb-6">
                                    {steps.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeStep
                                                ? `bg-gradient-to-r ${steps[activeStep].color}`
                                                : 'bg-slate-300'
                                                }`}
                                            whileHover={{ scale: 1.2 }}
                                            onClick={() => setActiveStep(index)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </div>

                                {/* Call to Action */}
                                <div className="text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => navigate('/issue-reporting-form')}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            Start Reporting
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatedSection>
                    </div>
                </div>

                {/* Key Features Grid */}
                <AnimatedSection animation="fadeInUp" delay={0.6}>
                    <div className="text-center mb-12">
                        <motion.h3
                            className="text-3xl font-bold text-slate-800 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Why Choose CivicCare?
                        </motion.h3>
                        <motion.p
                            className="text-slate-600 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            Built with modern technology and user experience in mind, our platform offers unique advantages for civic engagement.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.8 + index * 0.1,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <motion.div
                                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: 5,
                                        boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon name={feature.icon} size={28} className="text-white" />
                                </motion.div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Bottom CTA Section */}
                <AnimatedSection animation="scaleIn" delay={1.0} className="mt-20 text-center">
                    <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl max-w-4xl mx-auto relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient-shift" />

                        <div className="relative z-10">
                            <motion.h3
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                            >
                                Ready to Make a Difference?
                            </motion.h3>
                            <motion.p
                                className="text-xl mb-8 opacity-90"
                                initial={{ opacity: 0, y: 15 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                transition={{ duration: 0.6, delay: 1.3 }}
                            >
                                Join thousands of citizens who are actively improving their communities through CivicCare.
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => navigate('/issue-reporting-form')}
                                        className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Report Your First Issue
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => navigate('/public-reports-listing')}
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-medium transition-all duration-200"
                                    >
                                        Browse Existing Reports
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default HowItWorksSection;