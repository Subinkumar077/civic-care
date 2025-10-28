import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import Chatbot from '../../components/ui/Chatbot';
import ModernHeroSection from './components/ModernHeroSection';
import ModernFeaturesSection from './components/ModernFeaturesSection';
import RecentReportsSection from './components/RecentReportsSection';
import HowItWorksSection from './components/HowItWorksSection';
import ModernStatsSection from './components/ModernStatsSection';
import ModernTestimonialsSection from './components/ModernTestimonialsSection';
import DataSecuritySection from './components/DataSecuritySection';
import TrustSignalsSection from './components/TrustSignalsSection';

const PublicLandingPage = () => {
  return (
    <PageLayout backgroundPattern className="bg-white">
      <Helmet>
        <title>CivicCare - Your Voice for a Better Community | Modern Civic Reporting Platform</title>
        <meta name="description" content="Report civic issues instantly with photo evidence and GPS tracking. Track progress in real-time and help build safer neighborhoods through modern civic engagement." />
        <meta name="keywords" content="civic reporting, community issues, pothole reporting, streetlight repair, garbage collection, municipal services, citizen engagement, modern civic platform" />
        <meta property="og:title" content="CivicCare - Your Voice for a Better Community" />
        <meta property="og:description" content="Modern civic reporting platform with photo evidence, GPS tracking, and real-time updates. Build safer neighborhoods together." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CivicCare - Modern Civic Reporting Platform" />
        <meta name="twitter:description" content="Report civic issues instantly with photo evidence and GPS tracking. Track progress in real-time." />
      </Helmet>
      
      <motion.main 
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ModernHeroSection />
        <ModernFeaturesSection />
        <RecentReportsSection />
        <HowItWorksSection />
        <ModernStatsSection />
        <ModernTestimonialsSection />
        <DataSecuritySection />
        <TrustSignalsSection />
      </motion.main>
      
      {/* Chatbot Support */}
      <Chatbot />
    </PageLayout>
  );
};

export default PublicLandingPage;