import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import ModernHeader from '../ui/ModernHeader';
import ModernFooter from '../ui/ModernFooter';
import { cn } from '../../utils/cn';

const PageLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = '',
  containerClassName = '',
  backgroundPattern = false,
  ...props 
}) => {
  const { animations, reducedMotion } = useTheme();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: reducedMotion ? 0.1 : 0.6, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: reducedMotion ? 0.1 : 0.3 
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
        backgroundPattern && "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50",
        className
      )}
      {...props}
    >
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
      )}

      {showHeader && <ModernHeader />}
      
      <main className={cn(
        "relative z-10",
        showHeader && "pt-20", // Account for fixed header
        containerClassName
      )}>
        {children}
      </main>
      
      {showFooter && <ModernFooter />}
    </motion.div>
  );
};

export default PageLayout;