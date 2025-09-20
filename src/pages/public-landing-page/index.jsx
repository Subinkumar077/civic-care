import React from 'react';
import { Helmet } from 'react-helmet';
import ModernHeader from '../../components/ui/ModernHeader';
import ModernFooter from '../../components/ui/ModernFooter';
import Chatbot from '../../components/ui/Chatbot';
import ModernHeroSection from './components/ModernHeroSection';
import ModernFeaturesSection from './components/ModernFeaturesSection';
import RecentReportsSection from './components/RecentReportsSection';
import ModernStatsSection from './components/ModernStatsSection';
import ModernTestimonialsSection from './components/ModernTestimonialsSection';
import DataSecuritySection from './components/DataSecuritySection';
import TrustSignalsSection from './components/TrustSignalsSection';

const PublicLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
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
      
      <ModernHeader />
      
      <main className="w-full">
        <ModernHeroSection />
        <ModernFeaturesSection />
        <RecentReportsSection />
        <ModernStatsSection />
        <ModernTestimonialsSection />
        <DataSecuritySection />
        <TrustSignalsSection />
      </main>
      
      <ModernFooter />
      
      {/* Chatbot Support */}
      <Chatbot />
    </div>
  );
};

export default PublicLandingPage;