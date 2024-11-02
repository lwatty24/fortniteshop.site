import { motion } from 'framer-motion';

interface RarityPulseProps {
  color: string;
}

export function RarityPulse({ color }: RarityPulseProps) {
  return (
    <div className="absolute -inset-[2px] z-0 overflow-hidden rounded-xl">
      {/* Primary pulse */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.95 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [0.95, 1, 0.95]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`
        }}
      />

      {/* Secondary pulse */}
      <motion.div
        initial={{ opacity: 0.2, scale: 1 }}
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
        className="absolute inset-y-0 w-1/2 -skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}10, transparent)`
        }}
      />
    </div>
  );
} 