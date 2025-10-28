import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fadeInUp',
  delay = 0,
  duration,
  ...props 
}) => {
  const { animations, reducedMotion } = useTheme();
  const { ref, isInView } = useScrollAnimation();

  const animationVariant = animations[animation] || animations.fadeInUp;
  
  // Override duration if provided
  const customVariant = duration ? {
    ...animationVariant,
    transition: { 
      ...animationVariant.transition, 
      duration: reducedMotion ? 0.1 : duration,
      delay: reducedMotion ? 0 : delay
    }
  } : {
    ...animationVariant,
    transition: { 
      ...animationVariant.transition,
      delay: reducedMotion ? 0 : delay
    }
  };

  if (reducedMotion) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={customVariant.initial}
      animate={isInView ? customVariant.animate : customVariant.initial}
      exit={customVariant.exit}
      transition={customVariant.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;