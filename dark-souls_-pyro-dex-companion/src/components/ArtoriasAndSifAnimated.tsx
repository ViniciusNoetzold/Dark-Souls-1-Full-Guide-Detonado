import React from 'react';
import { motion } from 'motion/react';

interface ArtoriasAndSifAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAbyssAura?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ArtoriasAndSifAnimated: React.FC<ArtoriasAndSifAnimatedProps> = ({
  size = 'md',
  showAbyssAura = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { container: 'w-12 h-10', svg: 'w-12 h-10' },
    md: { container: 'w-16 h-14', svg: 'w-16 h-14' },
    lg: { container: 'w-24 h-20', svg: 'w-24 h-20' },
    xl: { container: 'w-32 h-28', svg: 'w-32 h-28' },
  };

  const { container, svg } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${container} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 1. Abyss Miasma & Moonlight Aura (Deep Violet & Cyan Glow) */}
      {showAbyssAura && (
        <>
          <motion.div
            animate={{
              scale: [0.88, 1.22, 0.88],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.0,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-tr from-[#1e1b4b] via-[#312e81] to-[#38bdf8] rounded-full blur-md pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              delay: 0.5,
              ease: 'easeInOut',
            }}
            className="absolute inset-[-4px] bg-[#6366f1] rounded-full blur-lg pointer-events-none"
          />
        </>
      )}

      {/* 2. Floating Abyss Embers and Moonlight Motes */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <motion.div
          animate={{
            y: [0, -18, -26],
            x: [-2, 3, -1],
            opacity: [0, 1, 0],
            scale: [0.3, 1.1, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.0,
            delay: 0.2,
            ease: 'easeOut',
          }}
          className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-[#67e8f9] rounded-full shadow-[0_0_8px_#38bdf8]"
        />
        <motion.div
          animate={{
            y: [0, -14, -22],
            x: [2, 6, 3],
            opacity: [0, 0.8, 0],
            scale: [0.2, 0.8, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.4,
            delay: 1.1,
            ease: 'easeOut',
          }}
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#c084fc] rounded-full shadow-[0_0_6px_#a855f7]"
        />
      </div>

      {/* 3. The Duo Artorias the Abysswalker & Great Grey Wolf Sif SVG */}
      <svg
        viewBox="0 0 100 80"
        className={`${svg} relative z-10 drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)] overflow-visible`}
      >
        <defs>
          {/* Armor Steel Gradient */}
          <linearGradient id="artoriasSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Flowing Blue Plume */}
          <linearGradient id="artoriasPlume" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Wolf Sif Fur */}
          <linearGradient id="sifFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Greatsword Blade */}
          <linearGradient id="greatswordBlade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* --- Background Shadow Ground --- */}
        <ellipse cx="50" cy="74" rx="42" ry="5" fill="#050711" opacity="0.75" />

        {/* ============================================================ */}
        {/* ARTORIAS THE ABYSSWALKER (Left Side)                         */}
        {/* ============================================================ */}
        <g id="artorias-group">
          {/* Cape / Tattered Cloth Flapping */}
          <motion.path
            d="M 28 32 C 22 38, 14 48, 11 68 C 17 66, 26 62, 32 58 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.8"
            animate={{
              d: [
                'M 28 32 C 22 38, 14 48, 11 68 C 17 66, 26 62, 32 58 Z',
                'M 28 32 C 20 40, 12 50, 9 70 C 16 67, 25 63, 32 58 Z',
                'M 28 32 C 22 38, 14 48, 11 68 C 17 66, 26 62, 32 58 Z',
              ],
            }}
            transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut' }}
          />

          {/* Body Armor / Torso */}
          <path
            d="M 26 28 L 38 28 L 36 54 L 28 54 Z"
            fill="url(#artoriasSteel)"
            stroke="#0f172a"
            strokeWidth="1"
          />

          {/* Pauldrons (Left and Right Spiked Shoulder Guards) */}
          <path
            d="M 22 26 L 27 24 L 28 36 L 21 34 Z"
            fill="url(#artoriasSteel)"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          <path
            d="M 37 24 L 42 26 L 43 34 L 36 36 Z"
            fill="url(#artoriasSteel)"
            stroke="#1e293b"
            strokeWidth="0.8"
          />

          {/* Legs & Sabatons */}
          <path
            d="M 28 54 L 26 72 L 30 73 L 32 54 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.8"
          />
          <path
            d="M 33 54 L 35 72 L 39 73 L 37 54 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="0.8"
          />

          {/* Corrupted / Slumped Arm holding Artorias Greatsword */}
          <path
            d="M 23 34 L 18 48 L 22 50 L 25 38 Z"
            fill="url(#artoriasSteel)"
            stroke="#0f172a"
            strokeWidth="0.8"
          />

          {/* The Greatsword of Artorias (Planted in the ground) */}
          <g id="greatsword">
            {/* Blade */}
            <path
              d="M 18 36 L 20 74 L 17 74 L 15 36 Z"
              fill="url(#greatswordBlade)"
              stroke="#1e293b"
              strokeWidth="0.6"
            />
            {/* Crossguard & Pommel */}
            <path
              d="M 13 36 L 22 36 L 20 38 L 15 38 Z"
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="0.6"
            />
            <path d="M 17.5 36 L 17.5 28" stroke="#334155" strokeWidth="1.2" />
            <circle cx="17.5" cy="27" r="1.5" fill="#38bdf8" />
          </g>

          {/* Helmet (Iconic Narrow Visor Helmet) */}
          <path
            d="M 29 16 C 29 10, 36 10, 36 16 C 37 21, 35 27, 32.5 28 C 30 27, 28 21, 29 16 Z"
            fill="url(#artoriasSteel)"
            stroke="#0f172a"
            strokeWidth="1"
          />
          {/* Slit Visor with Glowing Cyan Abyss Eye */}
          <path d="M 30 19 L 35 19" stroke="#000" strokeWidth="1.2" />
          <circle cx="33" cy="19" r="0.8" fill="#38bdf8" />

          {/* Flowing Blue Plume (Iconic Knight Mane) */}
          <motion.path
            d="
              M 32 10
              C 28 4, 18 4, 13 8
              C 18 10, 24 9, 28 13
              Z
            "
            fill="url(#artoriasPlume)"
            stroke="#0284c7"
            strokeWidth="0.6"
            animate={{
              d: [
                'M 32 10 C 28 4, 18 4, 13 8 C 18 10, 24 9, 28 13 Z',
                'M 32 10 C 27 2, 16 5, 10 11 C 17 12, 23 11, 28 13 Z',
                'M 32 10 C 28 4, 18 4, 13 8 C 18 10, 24 9, 28 13 Z',
              ],
            }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          />
        </g>

        {/* ============================================================ */}
        {/* GREAT GREY WOLF SIF (Right Side, standing proudly beside him) */}
        {/* ============================================================ */}
        <g id="sif-the-great-wolf">
          {/* Sif's Body & Hindquarters */}
          <motion.path
            d="
              M 52 46
              C 52 40, 65 38, 76 43
              C 84 48, 86 58, 86 68
              C 82 72, 74 72, 70 66
              C 66 62, 60 62, 54 68
              C 48 72, 46 64, 52 46
              Z
            "
            fill="url(#sifFur)"
            stroke="#334155"
            strokeWidth="1"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{ originX: '65px', originY: '60px' }}
          />

          {/* Bushy Wolf Tail */}
          <motion.path
            d="M 85 54 C 94 52, 98 62, 92 70 C 88 64, 85 60, 85 54 Z"
            fill="url(#sifFur)"
            stroke="#475569"
            strokeWidth="0.8"
            animate={{
              rotate: [0, 6, -4, 0],
            }}
            transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut' }}
            style={{ originX: '85px', originY: '54px' }}
          />

          {/* Front Paws & Hind Leg */}
          <path
            d="M 54 60 L 52 74 L 57 74 L 59 62 Z"
            fill="#cbd5e1"
            stroke="#334155"
            strokeWidth="0.8"
          />
          <path
            d="M 62 60 L 61 74 L 66 74 L 67 62 Z"
            fill="#94a3b8"
            stroke="#334155"
            strokeWidth="0.8"
          />
          <path
            d="M 78 62 L 77 74 L 82 74 L 84 62 Z"
            fill="#64748b"
            stroke="#334155"
            strokeWidth="0.8"
          />

          {/* Sif's Majestic Wolf Head & Chest Mane */}
          <path
            d="
              M 50 36
              C 48 30, 52 24, 58 22
              C 62 20, 68 24, 70 30
              C 72 38, 64 46, 52 46
              Z
            "
            fill="url(#sifFur)"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Fluffy Wolf Chest Ruff */}
          <path
            d="M 48 38 C 42 46, 45 56, 52 58 C 50 50, 50 42, 48 38 Z"
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth="0.6"
          />

          {/* Wolf Ears */}
          {/* Left Ear */}
          <path
            d="M 56 23 L 53 14 L 60 19 Z"
            fill="#e2e8f0"
            stroke="#334155"
            strokeWidth="0.8"
          />
          {/* Right Ear */}
          <path
            d="M 64 22 L 67 13 L 69 22 Z"
            fill="#94a3b8"
            stroke="#334155"
            strokeWidth="0.8"
          />

          {/* Wolf Muzzle & Snout */}
          <path
            d="M 52 29 L 42 32 L 44 36 L 52 36 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="0.8"
          />
          {/* Black Nose */}
          <polygon points="42,32 40,33 42,34" fill="#0f172a" />

          {/* Glowing Wolf Eye */}
          <circle cx="53" cy="27" r="1.4" fill="#38bdf8" />
          <circle cx="53" cy="27" r="0.6" fill="#ffffff" />

          {/* Sif Holding the Sword Hilt / Blade in mouth */}
          <g id="sif-mouth-blade">
            <path
              d="M 36 34 L 56 34 L 55 37 L 37 37 Z"
              fill="url(#greatswordBlade)"
              stroke="#0f172a"
              strokeWidth="0.6"
            />
            {/* Sword glow / hilt in mouth */}
            <circle cx="44" cy="35.5" r="1.2" fill="#38bdf8" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
};
