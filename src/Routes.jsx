import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import InteractiveIssueMap from './pages/interactive-issue-map';
import IssueReportingForm from './pages/issue-reporting-form';
import PublicReportsListing from './pages/public-reports-listing';
import PublicLandingPage from './pages/public-landing-page';
import IssueDetail from './pages/IssueDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/ui/Toast';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
            <ScrollToTop />
            <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLandingPage />} />
            <Route path="/public-landing-page" element={<PublicLandingPage />} />
            <Route path="/public-reports-listing" element={<PublicReportsListing />} />
            <Route path="/interactive-issue-map" element={<InteractiveIssueMap />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            
            {/* Form Routes */}
            <Route path="/issue-reporting-form" element={<IssueReportingForm />} />
            
            {/* Dashboard Routes - Accessible in preview mode */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;