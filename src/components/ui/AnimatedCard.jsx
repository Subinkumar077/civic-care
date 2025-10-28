import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hoverEffect = 'lift',
  delay = 0,
  ...props 
}) => {
  const { hoverEffects, animations, reducedMotion } = useTheme();

  const baseClasses = cn(
    "bg-white rounded-xl border border-slate-200 shadow-sm",
    "transition-all duration-300 ease-out",
    className
  );

  if (reducedMotion) {
    return (
      <div className={baseClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={animations.fadeIn.initial}
      animate={animations.fadeIn.animate}
      transition={{ 
        ...animations.fadeIn.transition, 
        delay: delay 
      }}
      {...hoverEffects[hoverEffect]}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;