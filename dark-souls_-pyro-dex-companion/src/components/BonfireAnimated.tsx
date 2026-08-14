import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BonfireAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSwordGlow?: boolean;
  showEmbers?: boolean;
  className?: string;
  onClick?: () => void;
}

// Sequence for 3 frames ping-pong loop to create a smooth 4-step organic flicker
const FRAME_SEQUENCE = [0, 1, 2, 1];

export const BonfireAnimated: React.FC<BonfireAnimatedProps> = ({
  size = 'md',
  showSwordGlow = true,
  showEmbers = true,
  className = '',
  onClick,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Cycle frames every 160ms for smooth pixel-art flame oscillation
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAME_SEQUENCE.length);
    }, 160);
    return () => clearInterval(timer);
  }, []);

  const activeFrameNumber = FRAME_SEQUENCE[frameIndex] + 1; // 1, 2, 3

  // Size dimensions
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const imagePaths = [
    `/BonfireFrame${activeFrameNumber}.png`,
    `BonfireFrame${activeFrameNumber}.png`,
    `/assets/BonfireFrame${activeFrameNumber}.png`,
  ];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Dynamic Ambient Fire Glow */}
      <motion.div
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-[var(--theme-accent)] rounded-full blur-md pointer-events-none"
      />

      {/* Embers particle simulation */}
      {showEmbers && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <motion.div
            animate={{
              y: [-2, -18, -25],
              x: [0, 3, -2],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: 0.2,
              ease: 'easeOut',
            }}
            className="absolute top-1/4 left-1/2 w-1 h-1 bg-[#ffaa00] rounded-full shadow-[0_0_4px_var(--theme-accent)]"
          />
          <motion.div
            animate={{
              y: [-1, -14, -20],
              x: [1, -4, -6],
              opacity: [0, 0.9, 0],
              scale: [0.5, 0.8, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.7,
              delay: 0.6,
              ease: 'easeOut',
            }}
            className="absolute top-1/3 left-1/3 w-0.5 h-0.5 bg-[#ff3300] rounded-full shadow-[0_0_4px_#ff3300]"
          />
          <motion.div
            animate={{
              y: [0, -16, -24],
              x: [-1, 5, 2],
              opacity: [0, 0.8, 0],
              scale: [0.4, 0.9, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.9,
              ease: 'easeOut',
            }}
            className="absolute top-1/4 right-1/3 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_4px_#ff9900]"
          />
        </div>
      )}

      {/* Main Pixel Art Frame Display */}
      {!imageError ? (
        <img
          key={activeFrameNumber}
          src={imagePaths[0]}
          alt={`Bonfire Pixel Art Frame ${activeFrameNumber}`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain relative z-10 [image-rendering:pixelated] drop-shadow-[0_0_12px_rgba(255,78,0,0.5)]"
        />
      ) : (
        /* Procedural Pixel-Art SVG Fallback in case local file serving is resolving */
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(255,78,0,0.7)]"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Ash Base */}
            <ellipse cx="16" cy="27" rx="11" ry="3" fill="#1a1412" />
            <ellipse cx="16" cy="26.5" rx="8" ry="2" fill="#2d1e18" />

            {/* Crossed Bones / Charred Wood */}
            <line x1="8" y1="28" x2="24" y2="24" stroke="#3b261b" strokeWidth="2" strokeLinecap="round" />
            <line x1="9" y1="24" x2="23" y2="28" stroke="#4a2e1d" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="27" x2="20" y2="23" stroke="var(--theme-accent)" strokeWidth="1" opacity="0.6" />

            {/* Coiled Sword in Center */}
            <path
              d="M16 6 L16 26 M13 12 L19 12 M15 5 L17 5 M16 4 L16 6"
              stroke="#8a8a8a"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            {showSwordGlow && (
              <path
                d="M16 8 L16 22"
                stroke="#ffaa44"
                strokeWidth="0.8"
                opacity={activeFrameNumber % 2 === 0 ? 0.9 : 0.6}
              />
            )}

            {/* Dynamic Animated Pixel Flames */}
            {activeFrameNumber === 1 && (
              <>
                <path d="M14 26 C13 20 12 16 15 11 C17 15 19 19 18 26 Z" fill="#ff3700" />
                <path d="M15 26 C14 22 13 18 16 14 C17 18 18 22 17 26 Z" fill="#ff8c00" />
                <path d="M15.5 26 C15 23 15 20 16 17 C16.5 20 16.5 23 16 26 Z" fill="#fff3a1" />
              </>
            )}
            {activeFrameNumber === 2 && (
              <>
                <path d="M13 26 C12 19 15 15 16 10 C18 14 19 20 19 26 Z" fill="var(--theme-accent)" />
                <path d="M14 26 C13 21 15 17 16 13 C17 17 18 21 18 26 Z" fill="#ffa200" />
                <path d="M15 26 C14.8 22 15.5 19 16 16 C16.5 19 16.8 22 16 26 Z" fill="#fff8b8" />
              </>
            )}
            {activeFrameNumber === 3 && (
              <>
                <path d="M14 26 C15 19 13 15 16 11 C19 15 17 20 18 26 Z" fill="#ff2600" />
                <path d="M14.5 26 C15 21 14 17 16 14 C17.5 17 17 21 17 26 Z" fill="#ff7a00" />
                <path d="M15.2 26 C15.5 22 15 19 16 17 C16.5 19 16.2 22 16 26 Z" fill="#fff080" />
              </>
            )}
          </svg>
        </div>
      )}
    </div>
  );
};
