import React from 'react';
import { motion } from 'motion/react';

interface FireKeeperAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAura?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FireKeeperAnimated: React.FC<FireKeeperAnimatedProps> = ({
  size = 'md',
  showAura = true,
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
      {/* 1. Ethereal Soul Glow Aura (Gold and Mystical White) */}
      {showAura && (
        <>
          <motion.div
            animate={{
              scale: [0.85, 1.25, 0.85],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-tr from-[#7c2d12] via-[#ff6a00] to-[#fef08a] rounded-full blur-md pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.2,
              delay: 0.6,
              ease: 'easeInOut',
            }}
            className="absolute inset-[-4px] bg-[var(--theme-accent-muted)] rounded-full blur-lg pointer-events-none"
          />
        </>
      )}

      {/* 2. Humanity & Soul Wisps Floating Upwards */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <motion.div
          animate={{
            y: [0, -18, -26],
            x: [0, 3, -2],
            opacity: [0, 1, 0],
            scale: [0.3, 1, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-[#fef9c3] rounded-full shadow-[0_0_8px_#f59e0b]"
        />
        <motion.div
          animate={{
            y: [0, -14, -20],
            x: [-2, -5, 1],
            opacity: [0, 0.85, 0],
            scale: [0.2, 0.8, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.2,
            delay: 1.4,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/3 w-1 h-1 bg-[#ea580c] rounded-full shadow-[0_0_5px_#c2410c]"
        />
      </div>

      {/* 3. Detailed Fire Keeper (Anastacia / Dark Souls Keeper) SVG */}
      <svg
        viewBox="0 0 64 64"
        className={`${svg} relative z-10 drop-shadow-[0_2px_8px_rgba(234,88,12,0.5)] overflow-visible`}
      >
        <defs>
          {/* Soul Flame Core Gradient */}
          <radialGradient id="keeperSoulCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
          </radialGradient>

          {/* Robes Gradient */}
          <linearGradient id="keeperRobes" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="50%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0c0a09" />
          </linearGradient>

          {/* Crown & Filigree Gold */}
          <linearGradient id="keeperGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="var(--theme-accent-muted)" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Veil Mesh Pattern */}
          <linearGradient id="keeperVeil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#44403c" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1c1917" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* --- Background Shadow --- */}
        <ellipse cx="32" cy="60" rx="16" ry="3" fill="#000" opacity="0.6" />

        {/* --- Draped Robes / Hood Silhouette --- */}
        <path
          d="
            M 32 6
            C 23 6, 17 14, 16 26
            C 15 34, 13 46, 10 58
            C 22 61, 42 61, 54 58
            C 51 46, 49 34, 48 26
            C 47 14, 41 6, 32 6
            Z
          "
          fill="url(#keeperRobes)"
          stroke="#1c1917"
          strokeWidth="1.2"
        />

        {/* --- Inner Fold of the Robes / Shroud --- */}
        <path
          d="M 22 30 C 26 42, 38 42, 42 30 C 44 45, 48 56, 51 58 C 39 60, 25 60, 13 58 C 16 56, 20 45, 22 30 Z"
          fill="#171513"
        />

        {/* --- Veiled Face / Head Covering with Blindfold / Lace Mask --- */}
        {/* Soft Face Shape behind veil */}
        <path
          d="M 24 16 C 24 12, 40 12, 40 16 C 41 22, 39 27, 32 29 C 25 27, 23 22, 24 16 Z"
          fill="#2d2825"
        />

        {/* Iconic Ornate Fire Keeper Tiara / Eye Blindfold Crown */}
        <path
          d="M 23 15 C 28 17, 36 17, 41 15 L 42 20 C 36 23, 28 23, 22 20 Z"
          fill="url(#keeperGold)"
          stroke="#78350f"
          strokeWidth="0.6"
        />
        {/* Crown Spikes / Filigree Details */}
        <path
          d="M 25 15 L 26 11 L 28 15 M 31 15 L 32 9 L 33 15 M 36 15 L 38 11 L 39 15"
          stroke="url(#keeperGold)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Blindfold Lace Mesh Detail */}
        <path
          d="M 24 18 C 29 20, 35 20, 40 18"
          stroke="#1c1917"
          strokeWidth="0.8"
          strokeDasharray="1.5,1.5"
        />
        <path
          d="M 24 20 C 29 22, 35 22, 40 20"
          stroke="#1c1917"
          strokeWidth="0.8"
          strokeDasharray="1.5,1.5"
        />

        {/* Serene chin & lips */}
        <path
          d="M 30 25 C 31 25.5, 33 25.5, 34 25"
          stroke="#78716c"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* --- Draped Sleeves & Cupped Hands --- */}
        <path
          d="M 18 36 C 21 44, 25 47, 28 47 L 27 42 C 24 40, 21 36, 18 36 Z"
          fill="#292524"
        />
        <path
          d="M 46 36 C 43 44, 39 47, 36 47 L 37 42 C 40 40, 43 36, 46 36 Z"
          fill="#292524"
        />

        {/* Cupped Hands in Prayer / Holding the Flame */}
        <path
          d="M 27 44 C 29 47, 35 47, 37 44 C 36 49, 28 49, 27 44 Z"
          fill="#a8a29e"
          stroke="#57534e"
          strokeWidth="0.6"
        />

        {/* --- THE LUMINOUS FIRE KEEPER SOUL (Dancing between her hands) --- */}
        {/* Soul Body */}
        <motion.ellipse
          cx="32"
          cy="39"
          rx="6"
          ry="7.5"
          fill="url(#keeperSoulCore)"
          animate={{
            scale: [0.85, 1.2, 0.85],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'easeInOut',
          }}
          style={{ originX: '32px', originY: '39px' }}
        />

        {/* Pulsing White Soul Spark */}
        <motion.circle
          cx="32"
          cy="38.5"
          r="2.5"
          fill="#ffffff"
          animate={{
            scale: [0.6, 1.4, 0.6],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
          }}
          style={{ originX: '32px', originY: '38.5px' }}
        />

        {/* Ethereal Soul Tendril rising */}
        <motion.path
          d="M 32 36 C 30 31, 35 29, 32 23 C 30 27, 33 30, 31 36 Z"
          fill="#ffffff"
          opacity="0.8"
          animate={{
            y: [-1, -3, -1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: 'easeInOut',
          }}
        />

        {/* Gold Necklace & Soul Threads */}
        <path
          d="M 27 28 C 30 33, 34 33, 37 28"
          stroke="url(#keeperGold)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </div>
  );
};
