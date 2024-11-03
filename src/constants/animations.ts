import type { Variants } from 'framer-motion';

export const spring = {
  stiff: 400,
  damping: 30,
  mass: 0.8
};

export const transition = {
  type: "spring",
  ...spring
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      ...transition,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 } 
  }
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      ...transition,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 } 
  }
}; 