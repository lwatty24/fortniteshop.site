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

export const setContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.03,
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

export const setItemVariants = {
  hidden: { 
    opacity: 0,
    y: 15,
    scale: 0.95
  },
  show: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 28,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0]
    }
  }
};

export const setDetailsVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0]
      },
      opacity: {
        duration: 0.2
      }
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0]
      },
      opacity: {
        duration: 0.2,
        delay: 0.1
      }
    }
  }
}; 