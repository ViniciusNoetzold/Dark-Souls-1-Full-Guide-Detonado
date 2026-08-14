import React from 'react';
import { motion } from 'motion/react';

interface EstusFlaskAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  charges?: number;
  maxCharges?: number;
  showGlow?: boolean;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
}

export const EstusFlaskAnimated: React.FC<EstusFlaskAnimatedProps> = ({
  size = 'md',
  charges = 10,
  maxCharges = 10,
  showGlow = true,
  className = '',
  onClick,
  showBadge = false,
}) => {
  // Dimensions
  const sizeMap = {
    sm: { container: 'w-8 h-8', svg: 'w-7 h-7', text: 'text-[9px]' },
    md: { container: 'w-14 h-14', svg: 'w-12 h-12', text: 'text-[11px]' },
    lg: { container: 'w-18 h-18', svg: 'w-16 h-16', text: 'text-xs' },
    xl: { container: 'w-24 h-24', svg: 'w-20 h-20', text: 'text-sm' },
  };

  const { container, svg, text } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${container} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 1. Pulsing Ambient Heat Glow (Breathing slowly in and out) */}
      {showGlow && (
        <>
          <motion.div
            animate={{
              scale: [0.85, 1.25, 0.85],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-tr from-[#ff3c00] via-[#ff8800] to-[#ffcc00] rounded-full blur-md pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.0,
              delay: 0.5,
              ease: 'easeInOut',
            }}
            className="absolute inset-[-4px] bg-[#ff6a00] rounded-full blur-lg pointer-events-none"
          />
        </>
      )}

      {/* 2. Micro Embers Rising from Flask Neck */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <motion.div
          animate={{
            y: [-2, -16, -24],
            x: [0, 2, -2],
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            delay: 0.2,
            ease: 'easeOut',
          }}
          className="absolute top-1/4 left-1/2 w-1 h-1 bg-[#fff2a8] rounded-full shadow-[0_0_6px_#ff9900]"
        />
        <motion.div
          animate={{
            y: [-1, -12, -18],
            x: [-1, -3, 1],
            opacity: [0, 0.8, 0],
            scale: [0.3, 0.8, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.6,
            delay: 1.1,
            ease: 'easeOut',
          }}
          className="absolute top-1/4 left-2/5 w-0.5 h-0.5 bg-[#ff6600] rounded-full shadow-[0_0_4px_#ff3300]"
        />
      </div>

      {/* 3. The Handcrafted Dark Souls Iconic Estus Flask SVG */}
      <svg
        viewBox="0 0 48 56"
        className={`${svg} relative z-10 drop-shadow-[0_2px_10px_rgba(255,100,0,0.6)]`}
      >
        <defs>
          {/* Outer Glass Rim Gradient */}
          <linearGradient id="glassRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a2e18" />
            <stop offset="50%" stopColor="#2c1a0e" />
            <stop offset="100%" stopColor="#150c07" />
          </linearGradient>

          {/* Liquid Ember Fire Core Gradient */}
          <linearGradient id="estusLiquid" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c73200" />
            <stop offset="35%" stopColor="#ff5500" />
            <stop offset="70%" stopColor="#ffaa00" />
            <stop offset="95%" stopColor="#fff3a1" />
          </linearGradient>

          {/* Molten Core Radial Highlight */}
          <radialGradient id="moltenCore" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffe680" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#ff7700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff3300" stopOpacity="0" />
          </radialGradient>

          {/* Glass Highlights */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Iron Cage / Bands Pattern */}
          <linearGradient id="ironBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="50%" stopColor="#888" />
            <stop offset="100%" stopColor="#333" />
          </linearGradient>
        </defs>

        {/* --- Background Shadow Behind Flask --- */}
        <ellipse cx="24" cy="52" rx="14" ry="3.5" fill="#000" opacity="0.6" />

        {/* --- Outer Glass Bottle Body Silhouette --- */}
        {/* Unique bulbous conical flask with flared base and banded neck */}
        <path
          d="
            M 19 6
            L 29 6
            C 29 6, 30 11, 29 14
            C 28 17, 34 22, 38 29
            C 42 36, 41 46, 36 50
            C 31 53, 17 53, 12 50
            C 7 46, 6 36, 10 29
            C 14 22, 20 17, 19 14
            Z
          "
          fill="url(#glassRim)"
          stroke="#1b110b"
          strokeWidth="1.5"
        />

        {/* --- Inner Molten Estus Liquid Container --- */}
        <motion.path
          d="
            M 20 16
            C 20 16, 28 16, 28 16
            C 27.5 18, 33 23, 36.5 29.5
            C 40 36, 39 44.5, 34.5 48.5
            C 30 51, 18 51, 13.5 48.5
            C 9 44.5, 8 36, 11.5 29.5
            C 15 23, 20.5 18, 20 16
            Z
          "
          fill="url(#estusLiquid)"
          animate={{
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.2,
            ease: 'easeInOut',
          }}
        />

        {/* --- Molten Core Flame Pulse (Breathing slowly in and out) --- */}
        <motion.ellipse
          cx="24"
          cy="36"
          rx="11"
          ry="9"
          fill="url(#moltenCore)"
          animate={{
            scale: [0.8, 1.18, 0.8],
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.2,
            ease: 'easeInOut',
          }}
          style={{ originX: '24px', originY: '36px' }}
        />

        {/* --- Swirling Flame Tendril inside Bottle --- */}
        <motion.path
          d="M 23 44 C 20 38, 28 34, 24 24 C 22 28, 21 34, 25 40 Z"
          fill="#ffffff"
          opacity="0.6"
          animate={{
            opacity: [0.3, 0.85, 0.3],
            y: [-1, 2, -1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: 'easeInOut',
          }}
        />

        {/* --- Metal Neck Ring & Stopper / Coiled Cap --- */}
        {/* Cork / Metal Stopper */}
        <path
          d="M 20 2 L 28 2 L 27 6 L 21 6 Z"
          fill="#8c6239"
          stroke="#422915"
          strokeWidth="0.8"
        />
        {/* Metal Flange Rim */}
        <rect
          x="18"
          y="5"
          width="12"
          height="2.5"
          rx="1"
          fill="url(#ironBand)"
          stroke="#222"
          strokeWidth="0.6"
        />
        {/* Neck Band */}
        <path
          d="M 19.5 12.5 C 22 13.5, 26 13.5, 28.5 12.5"
          stroke="url(#ironBand)"
          strokeWidth="1.6"
          fill="none"
        />

        {/* --- Ornate Iron Reinforcement Bands (Authentic DS1 Style) --- */}
        <path
          d="M 11.5 32 C 16 35.5, 32 35.5, 36.5 32"
          stroke="#2a1a10"
          strokeWidth="1.4"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 13.5 44 C 18 46.5, 30 46.5, 34.5 44"
          stroke="#2a1a10"
          strokeWidth="1.2"
          fill="none"
          opacity="0.75"
        />

        {/* --- Glass Curvature Specular Highlights (Left Side) --- */}
        <path
          d="
            M 21 16
            C 17 21, 12 28, 12 36
            C 12 42, 14 46, 17 48
            C 15 45, 14 41, 14 36
            C 14 29, 18 23, 21.5 18
            Z
          "
          fill="url(#glassReflection)"
        />

        {/* Small Glint on Neck */}
        <circle cx="21" cy="9" r="0.8" fill="#fff" opacity="0.8" />
        <ellipse cx="23" cy="24" rx="1.5" ry="3" fill="#fff" opacity="0.4" />
      </svg>

      {/* Optional Badge Indicator for Charges */}
      {showBadge && (
        <span
          className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#0c0c0c] border border-[#ff5500] rounded text-[#ffaa00] font-mono font-bold ${text} shadow-[0_0_8px_rgba(255,85,0,0.5)] z-20`}
        >
          {charges}
        </span>
      )}
    </div>
  );
};
