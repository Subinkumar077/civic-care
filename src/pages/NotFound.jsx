import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import Icon from '../components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();
  const { animations, hoverEffects } = useTheme();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageLayout showFooter={false} backgroundPattern>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 -mt-20">
        <AnimatedSection animation="scaleIn" className="text-center max-w-lg">
          <div className="flex justify-center mb-8">
            <motion.div 
              className="relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent opacity-30"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                404
              </motion.h1>
              
              {/* Floating elements around 404 */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-60"
                animate={{ 
                  y: [-10, 10, -10],
                  x: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-500 rounded-full opacity-60"
                animate={{ 
                  y: [10, -10, 10],
                  x: [5, -5, 5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              The page you're looking for seems to have wandered off. 
              Don't worry, let's get you back on track!
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div {...hoverEffects.lift}>
              <Button
                variant="secondary"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => window.history?.back()}
                className="min-w-[140px]"
              >
                Go Back
              </Button>
            </motion.div>

            <motion.div {...hoverEffects.lift}>
              <Button
                variant="default"
                iconName="Home"
                iconPosition="left"
                onClick={handleGoHome}
                className="min-w-[140px]"
              >
                Back to Home
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional helpful links */}
          <motion.div
            className="mt-12 pt-8 border-t border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-sm text-slate-500 mb-4">
              Looking for something specific? Try these popular pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: 'Report Issue', path: '/issue-reporting-form', icon: 'FileText' },
                { label: 'Browse Reports', path: '/public-reports-listing', icon: 'Search' },
                { label: 'Analytics', path: '/analytics-dashboard', icon: 'BarChart3' }
              ].map((link, index) => (
                <motion.button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                >
                  <Icon name={link.icon} size={12} />
                  <span>{link.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </PageLayout>
  );
};

export default NotFound;
