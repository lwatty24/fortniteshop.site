import { motion } from 'framer-motion';

interface RarityPulseProps {
  color: string;
}

export function RarityPulse({ color }: RarityPulseProps) {
  return (
    <div className="absolute -inset-[2px] z-0 overflow-hidden rounded-xl">
      {/* Primary pulse */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}25 0%, transparent 70%)`
        }}
      />

      {/* Secondary pulse */}
      <motion.div
        initial={{ opacity: 0.1, scale: 1 }}
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
        className="absolute inset-y-0 w-1/2 -skew-x-12 rotate-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}08, transparent)`
        }}
      />
    </div>
  );
} 