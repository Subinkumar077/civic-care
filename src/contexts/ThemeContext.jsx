import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    setTheme,
    reducedMotion,
    // Animation variants for consistent motion
    animations: {
      fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: reducedMotion ? 0.1 : 0.6, ease: "easeOut" }
      },
      fadeInUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
        transition: { duration: reducedMotion ? 0.1 : 0.8, ease: "easeOut" }
      },
      fadeInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
        transition: { duration: reducedMotion ? 0.1 : 0.6, ease: "easeOut" }
      },
      fadeInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
        transition: { duration: reducedMotion ? 0.1 : 0.6, ease: "easeOut" }
      },
      fadeInDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: reducedMotion ? 0.1 : 0.6, ease: "easeOut" }
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: reducedMotion ? 0.1 : 0.5, ease: "easeOut" }
      },
      slideUp: {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 100 },
        transition: { duration: reducedMotion ? 0.1 : 0.6, ease: "easeOut" }
      },
      stagger: {
        animate: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.1,
            delayChildren: reducedMotion ? 0 : 0.2
          }
        }
      }
    },
    // Common hover effects
    hoverEffects: {
      lift: reducedMotion ? {} : {
        whileHover: { y: -5, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 }
      },
      scale: reducedMotion ? {} : {
        whileHover: { scale: 1.05, transition: { duration: 0.2 } },
        whileTap: { scale: 0.95 }
      },
      glow: reducedMotion ? {} : {
        whileHover: { 
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
          transition: { duration: 0.2 }
        }
      }
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};