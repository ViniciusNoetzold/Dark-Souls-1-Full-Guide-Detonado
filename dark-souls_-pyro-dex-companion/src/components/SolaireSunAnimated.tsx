import React from 'react';
import { motion } from 'motion/react';

interface SolaireSunAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRaysAnimation?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SolaireSunAnimated: React.FC<SolaireSunAnimatedProps> = ({
  size = 'md',
  showRaysAnimation = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', svg: 'w-9 h-9' },
    md: { container: 'w-14 h-14', svg: 'w-12 h-12' },
    lg: { container: 'w-20 h-20', svg: 'w-16 h-16' },
    xl: { container: 'w-28 h-28', svg: 'w-24 h-24' },
  };

  const { container, svg } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${container} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 1. Incandescent Solar Glow Aura */}
      <motion.div
        animate={{
          scale: [0.9, 1.2, 0.9],
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-tr from-[#e60000] via-[var(--theme-accent)] to-[#ffd700] rounded-full blur-md pointer-events-none"
      />

      {/* 2. Solar Flare Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <motion.div
          animate={{
            y: [-3, -16, -22],
            x: [0, 4, -4],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#fff78a] rounded-full shadow-[0_0_8px_#ffcc00]"
        />
        <motion.div
          animate={{
            y: [-2, -14, -20],
            x: [-3, -7, -2],
            opacity: [0, 0.9, 0],
            scale: [0.4, 1, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.2,
            delay: 1.2,
            ease: 'easeOut',
          }}
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-[var(--theme-accent)] rounded-full shadow-[0_0_6px_#ff0000]"
        />
      </div>

      {/* 3. The Canonical Solaire Holy Symbol of the Sun SVG */}
      <motion.div
        animate={showRaysAnimation ? { rotate: [0, 4, -4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="relative z-10 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 100 100"
          className={`${svg} drop-shadow-[0_2px_8px_rgba(255,50,0,0.6)] overflow-visible`}
        >
          {/* Subtle Outer Drop Shadow */}
          <defs>
            <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#900" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* --- 8 ICONIC RED WAVY RAYS (EXACT MATCH TO SOLAIRE'S CHEST) --- */}
          {/* Group rotated dynamically into 8 directions: 0, 45, 90, 135, 180, 225, 270, 315 deg */}
          <g id="solaire-rays" filter="url(#sunGlow)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <path
                key={idx}
                d="
                  M 45 35
                  C 45 28, 47 22, 49 16
                  C 50 12, 48 8, 50 2
                  C 52 8, 50 12, 51 16
                  C 53 22, 55 28, 55 35
                  Z
                "
                fill="#e31b23"
                stroke="#a60c12"
                strokeWidth="0.6"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </g>

          {/* --- CENTRAL BRIGHT YELLOW FACE CIRCLE --- */}
          <circle
            cx="50"
            cy="50"
            r="19.5"
            fill="#ffeb3b"
            stroke="#d4af37"
            strokeWidth="0.8"
          />

          {/* --- SOLAIRE'S FAMOUS HAND-DRAWN SERENE / QUIRKY FACE --- */}
          <g id="solaire-face-features" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round">
            {/* Left Eyebrow & Eye */}
            <path
              d="M 40 43 C 42 41, 45 42, 46.5 43.5"
              fill="none"
              strokeWidth="0.85"
            />
            {/* Left Eye outline and pupil */}
            <path
              d="M 40.5 45.5 C 42.5 44, 45 44.5, 46.5 46"
              fill="none"
              strokeWidth="0.8"
            />
            <path
              d="M 41 46 C 43 47.5, 45 47, 46 46"
              fill="none"
              strokeWidth="0.6"
            />
            <circle cx="43.5" cy="45.5" r="0.85" fill="#1a1a1a" />

            {/* Right Eyebrow & Eye */}
            <path
              d="M 53.5 43.5 C 55 42, 58 41, 60 43"
              fill="none"
              strokeWidth="0.85"
            />
            {/* Right Eye outline and pupil */}
            <path
              d="M 53.5 46 C 55 44.5, 57.5 44, 59.5 45.5"
              fill="none"
              strokeWidth="0.8"
            />
            <path
              d="M 54 46 C 55 47, 57 47.5, 59 46"
              fill="none"
              strokeWidth="0.6"
            />
            <circle cx="56.5" cy="45.5" r="0.85" fill="#1a1a1a" />

            {/* Nose: Characterized straight bridge with slight hook/nostril */}
            <path
              d="M 50 43.5 L 49.5 50.5 L 47 52.5 L 51 52.5"
              fill="none"
              strokeWidth="0.85"
            />

            {/* Mouth: Serene curved line with signature Solaire smirk/bottom lip shadow */}
            <path
              d="M 44.5 55.5 C 47.5 55, 52.5 55, 55.5 55.5"
              fill="none"
              strokeWidth="0.9"
            />
            {/* Lower Lip shade (characteristic blob mark on the right) */}
            <path
              d="M 48.5 57.5 C 50 58.5, 53 58.5, 53.5 57.5"
              fill="#1a1a1a"
              strokeWidth="0.5"
            />
          </g>

          {/* Tiny Sunlight Shimmer Glint */}
          <circle cx="39" cy="39" r="1.5" fill="#ffffff" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  );
};
