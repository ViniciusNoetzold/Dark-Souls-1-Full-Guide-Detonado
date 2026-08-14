import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  RefreshCw, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  ExternalLink, 
  Search, 
  Gamepad2, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Award,
  Check,
  Sword,
  Shield,
  Skull,
  BookOpen,
  MapPin,
  HelpCircle,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SteamAchievementData, SteamProfileState } from '../types';
import { audioSynth } from '../utils/audioSynth';
import { AchievementIcon } from './AchievementIcon';

interface SteamSyncViewProps {
  profile: SteamProfileState;
  achievements: SteamAchievementData[];
  onSyncSteam: (steamInput: string) => Promise<void>;
  onToggleAchievementManual: (apiname: string) => void;
  onNavigateToPlatinum?: (category?: 'all' | 'pyromancy' | 'miracle' | 'sorcery' | 'weapon' | 'ember') => void;
  onNavigateToBosses?: (bossId?: string) => void;
  onNavigateToRoadguide?: (stageNumber?: number) => void;
  isLoading: boolean;
  error?: string | null;
}

export const SteamSyncView: React.FC<SteamSyncViewProps> = ({
  profile,
  achievements,
  onSyncSteam,
  onToggleAchievementManual,
  onNavigateToPlatinum,
  onNavigateToBosses,
  onNavigateToRoadguide,
  isLoading,
  error,
}) => {
  const [steamInput, setSteamInput] = useState(profile.steamId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!steamInput.trim()) return;
    await onSyncSteam(steamInput.trim());
  };

  const handleToggle = (achievement: SteamAchievementData) => {
    if (!achievement.unlocked) {
      audioSynth.playVictoryAchieved();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['var(--theme-accent)', '#f59e0b', '#ef4444'],
        });
      } catch {}
    } else {
      audioSynth.playItemCheck();
    }
    onToggleAchievementManual(achievement.apiname);
  };

  const filteredAchievements = achievements.filter((a) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      a.name.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      (a.relationshipTip && a.relationshipTip.toLowerCase().includes(term)) ||
      (a.relationshipLabel && a.relationshipLabel.toLowerCase().includes(term));

    let matchCat = true;
    if (categoryFilter === 'pyromancy') matchCat = a.category === 'pyromancy';
    else if (categoryFilter === 'spells') matchCat = a.category === 'general' && (a.apiname.includes('PRAYER') || a.apiname.includes('WISDOM'));
    else if (categoryFilter === 'weapon') matchCat = a.category === 'weapon';
    else if (categoryFilter === 'covenant') matchCat = a.category === 'covenant';
    else if (categoryFilter === 'boss') matchCat = a.category === 'boss' || a.apiname.includes('RING_THE_BELL') || a.apiname.includes('ART_OF_ABYSSWALKING') || a.apiname.includes('RITE_OF_KINDLING');
    else if (categoryFilter === 'ending') matchCat = a.category === 'ending';
    else if (categoryFilter === 'general') matchCat = a.category === 'general' && !a.apiname.includes('PRAYER') && !a.apiname.includes('WISDOM') && !a.apiname.includes('RITE_OF_KINDLING');

    let matchStatus = true;
    if (statusFilter === 'unlocked') matchStatus = a.unlocked;
    if (statusFilter === 'locked') matchStatus = !a.unlocked;

    return matchSearch && matchCat && matchStatus;
  });

  const getCategoryBadge = (ach: SteamAchievementData) => {
    if (ach.category === 'pyromancy') {
      return { label: 'Piromancia', color: 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/30' };
    }
    if (ach.apiname.includes('PRAYER')) {
      return { label: 'Milagres (23)', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    }
    if (ach.apiname.includes('WISDOM')) {
      return { label: 'Feitiços (24)', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
    }
    if (ach.apiname.includes('KNIGHTS_HONOR')) {
      return { label: 'Armas Raras (50)', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
    }
    if (ach.category === 'weapon') {
      return { label: 'Reforço de Arma', color: 'bg-orange-500/10 text-orange-300 border-orange-500/30' };
    }
    if (ach.category === 'covenant') {
      return { label: 'Pacto', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
    }
    if (ach.category === 'boss' || ach.apiname.includes('RING_THE_BELL') || ach.apiname.includes('ART_OF_ABYSSWALKING') || ach.apiname.includes('RITE_OF_KINDLING')) {
      return { label: 'Chefe / Sino', color: 'bg-red-500/10 text-red-300 border-red-500/30' };
    }
    if (ach.category === 'ending') {
      return { label: 'Final do Jogo', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
    }
    if (ach.apiname === 'ACHIEVEMENT_THE_DARK_SOUL') {
      return { label: 'Platina Suprema', color: 'bg-amber-400/20 text-amber-200 border-amber-400/50' };
    }
    return { label: 'Jornada', color: 'bg-zinc-700/30 text-zinc-300 border-zinc-600/40' };
  };

  return (
    <div className="space-y-4">
      {/* Steam Sync Header Form */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/40 flex items-center gap-1">
                <Gamepad2 className="w-3 h-3" /> Steam Integration
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Dark Souls: Remastered (AppID 570940)</span>
            </div>
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">
              Sincronização de Perfil & Conquistas (41 Conquistas)
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Conecte seu Steam ID ou clique nas cartas para alternar o progresso manualmente.
            </p>
          </div>

          {/* Steam ID Input Form */}
          <form onSubmit={handleSync} className="flex items-center gap-2">
            <input
              id="steam-id-input"
              type="text"
              placeholder="SteamID64 ou Vanity URL..."
              value={steamInput}
              onChange={(e) => setSteamInput(e.target.value)}
              className="bg-[#0d0d0d] border border-[#333] text-zinc-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[var(--theme-accent)] w-56 font-mono"
            />
            <button
              type="submit"
              id="btn-sync-steam"
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-[var(--theme-accent)] hover:bg-[#ff6a2b] disabled:opacity-50 text-black font-mono uppercase tracking-wider font-bold text-xs rounded flex items-center gap-1.5 shadow-md transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'SYNC...' : 'SINCRONIZAR'}</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Details & Overview Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Steam Avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded border border-[#333] bg-[#0d0d0d] object-cover"
              />
              <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                profile.isPlayingDS1 ? 'bg-[var(--theme-accent)]' : profile.personaState > 0 ? 'bg-blue-500' : 'bg-zinc-600'
              }`} />
            </div>

            <div>
              <div className="font-bold text-white flex items-center gap-1.5 font-mono text-xs">
                {profile.personaname}
                {profile.isSimulated && (
                  <span className="text-[9px] font-mono text-zinc-500 bg-[#222] px-1.5 py-0.2 rounded border border-[#333]">
                    OFFLINE / LOCAL
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
                {profile.isPlayingDS1 ? (
                  <span className="text-[var(--theme-accent)] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[var(--theme-accent)]" /> Jogando Dark Souls™
                  </span>
                ) : (
                  <span>Status: {profile.personaState > 0 ? 'Online na Steam' : 'Offline'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0d0d0d] px-3 py-2 rounded border border-[#2a2a2a]">
            <div>
              <div className="text-[9px] uppercase font-mono text-zinc-500">Conquistas Desbloqueadas</div>
              <div className="text-sm font-mono font-bold text-white">
                {unlockedCount}/{totalCount} <span className="text-xs text-[var(--theme-accent)]">({percentage}%)</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-[var(--theme-accent)]/40 flex items-center justify-center text-xs font-mono font-bold text-[var(--theme-accent)] bg-[var(--theme-accent)]/10">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Relational Hub Banner: Connects Achievements with Platinum Checklist */}
        {onNavigateToPlatinum && (
          <div className="mt-3.5 pt-3 border-t border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-[#1f1406] via-[#140f0a] to-[#0f0f0f] p-3 rounded border border-amber-900/50">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-200 font-mono block">
                  Checklist de Itens para Platinar (126 Itens Catalogados)
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  19 Piromancias • 23 Milagres • 24 Feitiços • 50 Armas Raras • 10 Braseiros
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigateToPlatinum('all')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Abrir Checklist 100%</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Achievements Filters and Search Controls */}
      <div className="space-y-2 bg-[#111] p-3 rounded border border-[#2a2a2a] text-xs">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="achievement-search-input"
              type="text"
              placeholder="Buscar conquista por nome, chefe, arma, feitiço ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] text-zinc-200 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-[var(--theme-accent)] font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0d0d0d] p-0.5 rounded border border-[#222]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                statusFilter === 'all' ? 'bg-[#2a2a2a] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todas ({achievements.length})
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                statusFilter === 'unlocked' ? 'bg-[var(--theme-accent)] text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                statusFilter === 'locked' ? 'bg-amber-600 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Faltando ({totalCount - unlockedCount})
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-[#222]">
          {[
            { id: 'all', label: 'Todas (41)' },
            { id: 'pyromancy', label: '🔥 Piromancias (1)' },
            { id: 'spells', label: '📜 Milagres & Feitiços (2)' },
            { id: 'weapon', label: '⚔️ Armas & Reforços (11)' },
            { id: 'covenant', label: '🛡️ Pactos (9)' },
            { id: 'boss', label: '💀 Chefes & Sinos (9)' },
            { id: 'general', label: '🗺️ Jornada (7)' },
            { id: 'ending', label: '👑 Finais (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[var(--theme-accent)] text-black font-bold shadow'
                  : 'bg-[#181818] text-zinc-400 hover:text-zinc-200 border border-[#2a2a2a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((ach) => {
            const badge = getCategoryBadge(ach);
            return (
              <motion.div
                key={ach.apiname}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded border flex flex-col justify-between gap-2.5 transition-all ${
                  ach.unlocked
                    ? 'bg-[#141414] border-[var(--theme-accent)]/40 shadow-sm'
                    : 'bg-[#0f0f0f] border-[#222] hover:border-[#333]'
                }`}
              >
                {/* Header Row: Icon + Names + Badge */}
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => handleToggle(ach)}
                    className="relative flex-shrink-0 cursor-pointer group"
                    title="Clique para alternar o status da conquista"
                  >
                    <AchievementIcon achievement={ach} size="lg" />
                    {ach.unlocked ? (
                      <span className="absolute -top-1.5 -right-1.5 bg-[var(--theme-accent)] text-black rounded-full p-0.5 font-bold shadow-md z-10">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#222] text-zinc-400 group-hover:text-white rounded-full p-0.5 text-[8px] font-mono border border-[#444] z-10">
                        🔒
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 font-mono">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${badge.color}`}>
                        {badge.label}
                      </span>
                      <button
                        onClick={() => handleToggle(ach)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                          ach.unlocked
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700'
                        }`}
                      >
                        {ach.unlocked ? '✓ Desbloqueada' : 'Bloqueada (Alternar)'}
                      </button>
                    </div>

                    <h4 className={`text-xs font-bold leading-tight ${ach.unlocked ? 'text-[var(--theme-accent)]' : 'text-zinc-200'}`}>
                      {ach.name}
                    </h4>

                    <p className="text-[10px] text-zinc-400 leading-snug mt-1">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Relational Section: Context, Tips & Direct Navigation Links */}
                {(ach.relationshipTip || ach.relationshipLabel) && (
                  <div className="bg-[#0b0b0b] border border-[#222] rounded p-2 text-[10px] font-mono space-y-1.5 mt-1">
                    {ach.relationshipTip && (
                      <div className="text-zinc-300 flex items-start gap-1.5">
                        <span className="text-[var(--theme-accent)] font-bold flex-shrink-0">Guia:</span>
                        <span className="text-zinc-400 leading-tight">{ach.relationshipTip}</span>
                      </div>
                    )}

                    {/* Interactive Action Button to Other Tabs */}
                    {ach.relatedTargetTab === 'platinum' && onNavigateToPlatinum && (
                      <div className="pt-1 border-t border-[#1a1a1a] flex items-center justify-between gap-2">
                        <span className="text-[9px] text-amber-400/90 font-bold uppercase tracking-tight flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Relacionado ao Checklist 100%
                        </span>
                        <button
                          onClick={() => onNavigateToPlatinum(ach.relatedCategoryFilter as any || 'all')}
                          className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded text-[9px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>{ach.relationshipLabel || 'Ver Checklist'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {ach.relatedTargetTab === 'bosses' && onNavigateToBosses && (
                      <div className="pt-1 border-t border-[#1a1a1a] flex items-center justify-between gap-2">
                        <span className="text-[9px] text-red-400/90 font-bold uppercase tracking-tight flex items-center gap-1">
                          <Skull className="w-3 h-3 text-red-400" />
                          Chefe no Rastreador de Mortes
                        </span>
                        <button
                          onClick={() => onNavigateToBosses(ach.relatedBossId)}
                          className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded text-[9px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>{ach.relationshipLabel || 'Ver Estratégia de Chefe'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {ach.relatedTargetTab === 'roadguide' && onNavigateToRoadguide && (
                      <div className="pt-1 border-t border-[#1a1a1a] flex items-center justify-between gap-2">
                        <span className="text-[9px] text-cyan-400/90 font-bold uppercase tracking-tight flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          Guia de Jornada por Etapas
                        </span>
                        <button
                          onClick={() => onNavigateToRoadguide(ach.relatedStageNumber)}
                          className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded text-[9px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>{ach.relationshipLabel || 'Abrir Etapa no Guia'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 bg-[#111] rounded border border-[#222] font-mono text-xs text-zinc-500">
          <p>Nenhuma conquista encontrada para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};
