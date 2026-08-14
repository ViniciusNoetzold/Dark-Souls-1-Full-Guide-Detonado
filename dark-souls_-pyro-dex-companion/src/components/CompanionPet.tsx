import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Skull, CheckCircle2, Move } from 'lucide-react';
import { CompanionType, RoadguideStage } from '../types';
import { audioSynth } from '../utils/audioSynth';
import { BonfireAnimated } from './BonfireAnimated';
import { EstusFlaskAnimated } from './EstusFlaskAnimated';
import { SolaireSunAnimated } from './SolaireSunAnimated';
import { FireKeeperAnimated } from './FireKeeperAnimated';
import { ArtoriasAndSifAnimated } from './ArtoriasAndSifAnimated';

interface CompanionPetProps {
  companionType: CompanionType;
  isOpen: boolean;
  onToggleOpen: () => void;
  currentStage: RoadguideStage;
  totalDeaths: number;
  completedTasksCount: number;
  totalTasksCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isOverlayMode: boolean;
  opacity: number;
  onQuickNoteClick: () => void;
}

const STORAGE_KEY = 'ds1_companion_pet_coords_v4';

export const CompanionPet: React.FC<CompanionPetProps> = ({
  companionType,
  isOpen,
  onToggleOpen,
  currentStage,
  totalDeaths,
  completedTasksCount,
  totalTasksCount,
  opacity,
  onQuickNoteClick,
}) => {
  const [isPetHovered, setIsPetHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Position state (in pixels from top-left)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {}

    // Default position: bottom-right
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(20, window.innerWidth - 120),
        y: Math.max(20, window.innerHeight - 150),
      };
    }
    return { x: 300, y: 300 };
  });

  const dragRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    initialPetX: number;
    initialPetY: number;
    hasMoved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    initialPetX: 0,
    initialPetY: 0,
    hasMoved: false,
  });

  // Keep pet inside window bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const clampedX = Math.max(10, Math.min(winW - 100, prev.x));
        const clampedY = Math.max(10, Math.min(winH - 110, prev.y));
        if (clampedX !== prev.x || clampedY !== prev.y) {
          const newPos = { x: clampedX, y: clampedY };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
          } catch {}
          return newPos;
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global pointer move & up handlers during dragging
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDown) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      if (Math.hypot(deltaX, deltaY) > 4) {
        dragRef.current.hasMoved = true;
        if (!isDragging) {
          setIsDragging(true);
        }
      }

      const winW = window.innerWidth;
      const winH = window.innerHeight;

      // Bound within screen (with 10px margin)
      const newX = Math.max(8, Math.min(winW - 100, dragRef.current.initialPetX + deltaX));
      const newY = Math.max(8, Math.min(winH - 110, dragRef.current.initialPetY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleGlobalPointerUp = () => {
      if (!dragRef.current.isDown) return;

      dragRef.current.isDown = false;
      setIsDragging(false);

      // Save the exact final position in localStorage
      setPosition((currentPos) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPos));
        } catch {}
        return currentPos;
      });
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button (left click / single touch)
    if (e.button !== 0) return;

    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      initialPetX: position.x,
      initialPetY: position.y,
      hasMoved: false,
    };
  };

  const handlePetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If user dragged, do not trigger click/toggle
    if (dragRef.current.hasMoved) return;

    audioSynth.playBonfireChime();
    onToggleOpen();
  };

  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Render Pet Graphic based on selected companion
  const renderPetGraphic = () => {
    switch (companionType) {
      case 'solaire':
        return (
          <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="relative flex items-center justify-center p-1">
              <SolaireSunAnimated size="md" showRaysAnimation={true} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-300 uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Solaire
            </span>
          </div>
        );

      case 'firekeeper':
        return (
          <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="relative flex items-center justify-center p-1">
              <FireKeeperAnimated size="md" showAura={true} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-200 uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Guardiã
            </span>
          </div>
        );

      case 'artorias':
        return (
          <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="relative flex items-center justify-center p-1">
              <ArtoriasAndSifAnimated size="md" showAbyssAura={true} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Artorias & Sif
            </span>
          </div>
        );

      case 'estus':
        return (
          <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="relative flex items-center justify-center p-1">
              <EstusFlaskAnimated size="md" showGlow={true} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Estus
            </span>
          </div>
        );

      case 'bonfire':
      default:
        return (
          <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="relative flex items-center justify-center p-1">
              <BonfireAnimated size="md" showEmbers={true} showSwordGlow={true} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff5500] uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Bonfire
            </span>
          </div>
        );
    }
  };

  // Determine if popup tooltip should appear above, below, left or right of the pet
  const isNearTop = position.y < 220;
  const isNearRight = typeof window !== 'undefined' ? position.x > window.innerWidth - 280 : true;

  return (
    <div
      id="companion-pet-root"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        opacity: Math.max(0.75, opacity),
        touchAction: 'none',
      }}
      className="select-none"
    >
      {/* Mini Quick Status Banner (rendered when hovered or closed) */}
      <AnimatePresence>
        {(isPetHovered || !isOpen) && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: isNearTop ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: isNearTop ? -8 : 8 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              isNearTop ? 'top-full mt-2' : 'bottom-full mb-2'
            } ${
              isNearRight ? 'right-0' : 'left-0'
            } bg-[#141414]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-lg p-3 shadow-2xl text-zinc-200 text-xs w-64 font-mono z-50 pointer-events-auto`}
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-1.5 mb-2">
              <div className="flex items-center gap-1.5 text-[var(--theme-accent)] font-bold text-[10px] uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>Lordran Companion</span>
              </div>
              <span className="text-[9px] text-zinc-400 bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">
                STAGE {currentStage.number}
              </span>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="text-zinc-500 uppercase">Progresso da Run:</span>
                <span className="font-mono text-[var(--theme-accent)] font-black">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--theme-accent)] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-1 text-red-400">
                  <Skull className="w-3 h-3 text-red-500" />
                  <span className="font-mono font-bold">{totalDeaths} mortes</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{completedTasksCount}/{totalTasksCount}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-[#222] text-[10px] text-zinc-400 truncate">
                Foco: <span className="text-zinc-200">{currentStage.zone}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#222] flex items-center justify-between text-[10px]">
              <button
                id="pet-quick-note-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickNoteClick();
                }}
                className="text-[var(--theme-accent)] hover:text-orange-300 font-bold uppercase transition-colors"
              >
                + Nova Nota
              </button>
              <span className="text-zinc-500 uppercase text-[9px] flex items-center gap-1">
                <Move className="w-2.5 h-2.5 text-[var(--theme-accent)]" /> Arraste para mover
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pet Element: Pure backdrop blur glow, no box border, exact drag tracking */}
      <div
        id="companion-pet-avatar"
        onPointerDown={handlePointerDown}
        onClick={handlePetClick}
        onMouseEnter={() => setIsPetHovered(true)}
        onMouseLeave={() => setIsPetHovered(false)}
        className={`relative flex flex-col items-center justify-center p-3 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-150 ${
          isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'
        } group pointer-events-auto border border-white/5 hover:border-white/15`}
        title="Arraste para posicionar onde quiser na tela • Clique para abrir o menu do HUD"
      >
        {/* Soft Radial Ambient Glow in background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[var(--theme-accent)]/25 via-[var(--theme-accent)]/10 to-transparent blur-xl pointer-events-none -z-10 group-hover:from-[var(--theme-accent)]/40 transition-all" />

        {/* Pet Graphic (Bonfire / Solaire / FireKeeper / etc) */}
        {renderPetGraphic()}

        {/* Drag indicator icon on hover */}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-zinc-400 p-1 rounded-full border border-white/10 text-[8px] pointer-events-none shadow">
          <Move className="w-2.5 h-2.5 text-[var(--theme-accent)]" />
        </div>
      </div>
    </div>
  );
};
