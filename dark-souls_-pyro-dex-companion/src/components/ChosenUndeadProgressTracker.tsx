import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Sparkles, CheckCircle2, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
import { EstusFlaskAnimated } from './EstusFlaskAnimated';
import { audioSynth } from '../utils/audioSynth';

interface ChosenUndeadProgressTrackerProps {
  completedCount: number;
  totalCount: number;
  stageProgress: number;
  currentStageNumber: number;
  hasNextStage: boolean;
  onNextStage?: () => void;
  stageTitle?: string;
}

export const ChosenUndeadProgressTracker: React.FC<ChosenUndeadProgressTrackerProps> = ({
  completedCount,
  totalCount,
  stageProgress,
  currentStageNumber,
  hasNextStage,
  onNextStage,
  stageTitle,
}) => {
  const [isWalking, setIsWalking] = useState(false);
  const [lastProgress, setLastProgress] = useState(stageProgress);

  // Trigger brief walking animation when progress changes
  useEffect(() => {
    if (stageProgress !== lastProgress) {
      setIsWalking(true);
      const timer = setTimeout(() => {
        setIsWalking(false);
      }, 1200);
      setLastProgress(stageProgress);
      return () => clearTimeout(timer);
    }
  }, [stageProgress, lastProgress]);

  const isComplete = stageProgress === 100;
  // Calculate clamped position from 4% (near bonfire) to 88% (at the fog wall)
  const knightPositionPct = Math.min(88, Math.max(4, 4 + (stageProgress / 100) * 84));

  return (
    <div className="bg-gradient-to-b from-[#161616] to-[#0d0d0d] p-3.5 sm:p-4 rounded-xl border border-[#2d2d2d] shadow-xl relative overflow-hidden space-y-3">
      {/* Background Ambience Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-black/40 pointer-events-none" />

      {/* Top Header Row: Estus Icon + Progress Metric + Next Stage Shortcut */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#222] pb-2.5">
        <div className="flex items-center gap-3">
          {/* Estus Flask dynamic level */}
          <div className="flex-shrink-0 relative">
            <EstusFlaskAnimated
              size="sm"
              charges={Math.max(1, Math.round((stageProgress / 100) * 10))}
              showGlow={stageProgress > 0}
            />
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-black flex items-center justify-center"
              >
                <Sparkles className="w-2 h-2 text-black" />
              </motion.div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-[var(--theme-accent)]" />
                Jornada do Morto-Vivo (Progresso da Fase)
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm sm:text-base font-mono font-bold text-white tracking-tight">
                {completedCount} <span className="text-zinc-500 font-normal">/ {totalCount} Tarefas</span>
              </span>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isComplete
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                    : 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/30'
                }`}
              >
                {stageProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Action button if at 100% */}
        {isComplete && hasNextStage && onNextStage && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            onClick={() => {
              audioSynth.playBossVictory();
              onNextStage();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-mono font-bold text-xs shadow-lg shadow-amber-900/40 transition-all cursor-pointer border border-amber-300 group"
          >
            <span className="tracking-wide uppercase text-[11px]">Atravessar a Névoa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* 2. Interactive Character Walking Track / Pathway */}
      <div className="relative pt-6 pb-4 px-2">
        {/* Track Pathway (Lordran Stone Road) */}
        <div className="relative h-4 bg-[#0a0a0a] rounded-full border border-[#262626] overflow-visible shadow-inner flex items-center">
          {/* Progress fill trail */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[var(--theme-accent)]/60 via-amber-500/70 to-amber-400 rounded-full"
            style={{ width: `${stageProgress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          />

          {/* Cobblestone milestones (25%, 50%, 75%) */}
          <div className="absolute left-[25%] -translate-x-1/2 w-1.5 h-3 bg-[#333] rounded-sm z-0" />
          <div className="absolute left-[50%] -translate-x-1/2 w-1.5 h-3 bg-[#333] rounded-sm z-0" />
          <div className="absolute left-[75%] -translate-x-1/2 w-1.5 h-3 bg-[#333] rounded-sm z-0" />

          {/* Left Anchor: Starting Bonfire (0%) */}
          <div className="absolute -left-1 -bottom-2 z-10 flex flex-col items-center pointer-events-none">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <ellipse cx="12" cy="19" rx="6" ry="2" fill="#2d1305" />
                <path d="M12 7 L12 18" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M10 9 L14 9" stroke="#cbd5e1" strokeWidth="1.5" />
                <motion.path
                  d="M12 9 C10 12 9 15 11 18 C12.5 19 13.5 19 13 17 C12.5 15 13.5 13 12 9 Z"
                  fill="var(--theme-accent)"
                  animate={{ scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </svg>
            </div>
            <span className="text-[8px] font-mono text-zinc-500 mt-[-2px]">Fogueira</span>
          </div>

          {/* Right Anchor: The Fog Wall / Névoa de Chefe (100%) */}
          <div className="absolute -right-2 -bottom-2 z-10 flex flex-col items-center pointer-events-none">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Stone Archway */}
              <div className="absolute inset-0 rounded-t-lg border-2 border-zinc-600 bg-black/60 overflow-hidden">
                {/* Billowing Fog Animation */}
                <motion.div
                  animate={{
                    opacity: [0.6, 0.95, 0.6],
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-full h-full ${
                    isComplete
                      ? 'bg-gradient-to-t from-amber-300 via-yellow-100 to-white'
                      : 'bg-gradient-to-t from-zinc-300/80 via-slate-100/90 to-white/70'
                  }`}
                  style={{
                    filter: 'blur(1px)',
                  }}
                />
              </div>

              {/* Fog Ethereal Light Sparks */}
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent"
              />
            </div>
            <span
              className={`text-[8px] font-mono font-bold mt-[-2px] ${
                isComplete ? 'text-amber-400' : 'text-zinc-400'
              }`}
            >
              Névoa
            </span>
          </div>

          {/* 3. The Moving Knight / Chosen Undead Character */}
          <motion.div
            className="absolute top-[-36px] z-20 pointer-events-none"
            initial={{ left: '4%' }}
            animate={{ left: `${knightPositionPct}%` }}
            transition={{
              type: 'spring',
              damping: 18,
              stiffness: 90,
              mass: 0.8,
            }}
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="relative flex flex-col items-center">
              {/* Walking Bob Animation Container */}
              <motion.div
                animate={
                  isWalking
                    ? { y: [0, -3, 0, -3, 0], rotate: [0, -2, 2, -2, 0] }
                    : { y: [0, -1.5, 0] }
                }
                transition={
                  isWalking
                    ? { duration: 0.5, repeat: Infinity }
                    : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
                className="relative"
              >
                {/* Dark Souls Elite Knight Avatar Graphic */}
                <svg viewBox="0 0 32 36" className="w-8 h-9 filter drop-shadow-md overflow-visible">
                  {/* Glowing Soul / Eye Glint */}
                  <motion.circle
                    cx="15"
                    cy="8.5"
                    r="1"
                    fill="#38bdf8"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  {/* Helmet (Elite Knight / Fluted Helm) */}
                  <path
                    d="M11 6 C11 3.5 14 2 17 2 C20 2 22 3.5 22 6 L22 12 C22 13 20 14 16.5 14 C13 14 11 13 11 12 Z"
                    fill="#94a3b8"
                    stroke="#334155"
                    strokeWidth="0.8"
                  />
                  {/* Visor Slit */}
                  <path d="M13 8 L20 8" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M15 8 L17 8" stroke="#38bdf8" strokeWidth="0.8" />

                  {/* Blue Cape / Surcoat (Astora Elite Knight) */}
                  <path
                    d="M10 13 C8 15 7 24 6 26 C9 25 11 23 11 21"
                    fill="#0284c7"
                    stroke="#0369a1"
                    strokeWidth="0.6"
                  />

                  {/* Armor Chestplate */}
                  <path
                    d="M11 13 L22 13 L21 22 L12 22 Z"
                    fill="#64748b"
                    stroke="#1e293b"
                    strokeWidth="0.8"
                  />
                  {/* Heraldic Gold Trim */}
                  <path d="M13 13 L16.5 19 L20 13" stroke="#f59e0b" strokeWidth="0.7" fill="none" />

                  {/* Left Arm / Shield (Crest Shield) */}
                  <path
                    d="M8 14 C8 14 6 18 8 22 C10 24 12 24 12 22 C12 18 10 14 8 14 Z"
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth="0.7"
                  />

                  {/* Right Arm & Sword */}
                  <path d="M22 14 L25 18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Straight Sword Blade */}
                  <path
                    d="M25 17 L29 27"
                    stroke={isComplete ? '#fbbf24' : '#cbd5e1'}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path d="M24 18 L27 17" stroke="#eab308" strokeWidth="1.2" />

                  {/* Legs and Greaves */}
                  <motion.g
                    animate={
                      isWalking
                        ? { rotate: [-10, 10, -10] }
                        : { rotate: 0 }
                    }
                    style={{ transformOrigin: '16px 22px' }}
                  >
                    {/* Left Leg */}
                    <path d="M13 22 L12 30 L10 32" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Right Leg */}
                    <path d="M19 22 L20 30 L22 32" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
                  </motion.g>
                </svg>

                {/* Footstep Ember Sparks when walking */}
                {isWalking && (
                  <motion.div
                    initial={{ opacity: 1, scale: 0.5, y: 0 }}
                    animate={{ opacity: 0, scale: 1.5, y: -4, x: -3 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 pointer-events-none"
                  />
                )}
              </motion.div>

              {/* Status Pill over Knight's head */}
              <div className="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border border-zinc-700 text-[8px] font-mono text-zinc-300 whitespace-nowrap shadow-sm">
                {isComplete ? 'Na Névoa!' : isWalking ? 'Avançando...' : 'Escolhido'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Milestone Labels below track */}
        <div className="flex justify-between text-[8px] font-mono text-zinc-500 pt-1.5 px-1">
          <span>Início</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className={isComplete ? 'text-amber-400 font-bold' : ''}>100% Névoa</span>
        </div>
      </div>
    </div>
  );
};
