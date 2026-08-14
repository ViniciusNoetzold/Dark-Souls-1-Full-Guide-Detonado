import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Skull, Sword, Shield, Sparkles, Award } from 'lucide-react';
import { SteamAchievementData } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';

interface AchievementIconProps {
  achievement: SteamAchievementData;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementIcon: React.FC<AchievementIconProps> = ({
  achievement,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  // Look up authoritative local image if achievement.icon is missing or relative
  const matchedDefault = INITIAL_ACHIEVEMENTS.find(
    (a) =>
      a.apiname === achievement.apiname ||
      a.apiname.toLowerCase() === achievement.apiname.toLowerCase() ||
      a.name.toLowerCase() === achievement.name.toLowerCase() ||
      a.name.split('(')[0].trim().toLowerCase() === achievement.name.split('(')[0].trim().toLowerCase()
  );

  const iconSrc = matchedDefault?.icon || achievement.icon || '';

  useEffect(() => {
    setImgError(false);
  }, [achievement.icon, achievement.apiname]);

  const boxSize = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  const getCategoryIcon = () => {
    switch (achievement.category) {
      case 'pyromancy':
        return <Flame className={`${iconSize} text-[var(--theme-accent)]`} />;
      case 'boss':
        return <Skull className={`${iconSize} text-red-400`} />;
      case 'weapon':
        return <Sword className={`${iconSize} text-amber-400`} />;
      case 'covenant':
        return <Shield className={`${iconSize} text-blue-400`} />;
      case 'ending':
        return <Sparkles className={`${iconSize} text-yellow-300`} />;
      default:
        return <Trophy className={`${iconSize} text-amber-500`} />;
    }
  };

  const getCategoryBg = () => {
    switch (achievement.category) {
      case 'pyromancy':
        return 'from-[#2b0f05] via-[#1a0903] to-[#0d0502] border-[var(--theme-accent)]/40';
      case 'boss':
        return 'from-[#2b0a0a] via-[#180606] to-[#0a0202] border-red-800/40';
      case 'weapon':
        return 'from-[#261d08] via-[#171105] to-[#0a0702] border-amber-600/40';
      case 'covenant':
        return 'from-[#0a182b] via-[#050e1a] to-[#02060d] border-blue-800/40';
      case 'ending':
        return 'from-[#2b240a] via-[#1a1605] to-[#0d0b02] border-yellow-500/40';
      default:
        return 'from-[#1c1c1c] via-[#141414] to-[#0d0d0d] border-[#333]';
    }
  };

  return (
    <div
      className={`relative ${boxSize} rounded border flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ${
        achievement.unlocked
          ? 'border-[var(--theme-accent)] shadow-md shadow-[var(--theme-accent)]/20'
          : 'border-[#2a2a2a] opacity-75'
      }`}
    >
      {!imgError && iconSrc ? (
        <img
          src={iconSrc}
          alt={achievement.name}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all ${
            achievement.unlocked ? 'brightness-105 contrast-105' : 'grayscale opacity-50 brightness-75'
          }`}
        />
      ) : (
        /* Dark Souls Stylized Crest / Badge Fallback */
        <div
          className={`w-full h-full bg-gradient-to-b ${getCategoryBg()} flex flex-col items-center justify-center p-1 relative`}
        >
          {/* Subtle inner crest border */}
          <div className="absolute inset-0.5 border border-white/5 rounded-sm pointer-events-none" />
          
          {getCategoryIcon()}

          <span className="text-[7px] font-mono font-bold uppercase tracking-tighter text-zinc-400 mt-0.5 truncate max-w-[90%]">
            {achievement.category === 'pyromancy' ? 'PIRO' : achievement.category.slice(0, 4)}
          </span>
        </div>
      )}
    </div>
  );
};
