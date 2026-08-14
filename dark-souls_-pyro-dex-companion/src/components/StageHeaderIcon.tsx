import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface StageHeaderIconProps {
  stageNumber: number;
  isCompleted: boolean;
  progressPct: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StageHeaderIcon: React.FC<StageHeaderIconProps> = ({
  stageNumber,
  isCompleted,
  progressPct,
  size = 'md',
}) => {
  const isFull = isCompleted;

  return (
    <div className="relative flex items-center justify-center">
      {/* Background radial glow for completed state */}
      <AnimatePresence>
        {isFull && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-radial from-[var(--theme-accent)]/25 via-orange-600/10 to-transparent pointer-events-none rounded-full"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-center">
        {isFull ? (
          /* COMPLETED STATE: Golden Stage Crest */
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative flex flex-col items-center justify-center"
          >
            <svg
              viewBox="0 0 48 48"
              className={size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}
              fill="none"
            >
              {/* Subtle background rays */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '24px 24px' }}
              >
                <circle cx="24" cy="24" r="22" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
              </motion.g>

              {/* Shield Base - Golden */}
              <path 
                d="M24 4 L40 10 L40 26 C40 38 28 44 24 46 C20 44 8 38 8 26 L8 10 Z" 
                fill="#291000" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
              
              {/* Inner engraved border */}
              <path 
                d="M24 9 L35 13 L35 25 C35 34 26 39 24 40.5 C22 39 13 34 13 25 L13 13 Z" 
                fill="#451a03" 
                stroke="#fbbf24" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
              />

              {/* Top Crown/Star indicator */}
              <path d="M24 10 L26 14 L22 14 Z" fill="#fef08a" />

              {/* Stage Number inside */}
              <text 
                x="24" 
                y="31" 
                fill="#fef08a" 
                fontSize="18" 
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" 
                fontWeight="900" 
                textAnchor="middle"
              >
                {stageNumber}
              </text>
            </svg>

            {/* Complete Badge checkmark */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-200 flex items-center justify-center shadow-sm shadow-black">
              <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
            </div>
          </motion.div>
        ) : (
          /* INCOMPLETE STATE: Dark Iron Crest */
          <div className="relative flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className={size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}
              fill="none"
            >
              {/* Shield Base - Dark Iron */}
              <path 
                d="M24 4 L40 10 L40 26 C40 38 28 44 24 46 C20 44 8 38 8 26 L8 10 Z" 
                fill="#0d0d0d" 
                stroke="#3f3f46" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
              
              {/* Inner engraved border */}
              <path 
                d="M24 9 L35 13 L35 25 C35 34 26 39 24 40.5 C22 39 13 34 13 25 L13 13 Z" 
                fill="#18181b" 
                stroke="#27272a" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
              />

              {/* Top rivet/indicator */}
              <circle cx="24" cy="13" r="1.5" fill="#3f3f46" />

              {/* Stage Number inside */}
              <text 
                x="24" 
                y="31" 
                fill="#71717a" 
                fontSize="18" 
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" 
                fontWeight="900" 
                textAnchor="middle"
              >
                {stageNumber}
              </text>
            </svg>

            {/* Progress indicator outline if partially complete */}
            {progressPct > 0 && (
              <svg viewBox="0 0 48 48" className="absolute inset-0 pointer-events-none -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="23"
                  fill="none"
                  stroke="var(--theme-accent)"
                  strokeWidth="1.5"
                  strokeDasharray={`${(progressPct / 100) * (2 * Math.PI * 23)} 200`}
                  strokeLinecap="round"
                  className="opacity-60"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
