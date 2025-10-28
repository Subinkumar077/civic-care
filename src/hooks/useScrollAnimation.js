import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    ...options
  });

  return { ref, isInView };
};

export const useStaggeredAnimation = (itemCount, delay = 0.1) => {
  const [visibleItems, setVisibleItems] = useState(0);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setVisibleItems(prev => {
          if (prev >= itemCount) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, delay * 1000);

      return () => clearInterval(timer);
    }
  }, [isInView, itemCount, delay]);

  return { ref, visibleItems, isInView };
};

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};