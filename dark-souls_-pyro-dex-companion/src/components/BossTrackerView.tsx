import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Skull, 
  Plus, 
  Minus, 
  RotateCcw, 
  Trophy, 
  Search, 
  Flame, 
  Swords, 
  ShieldAlert, 
  FileEdit, 
  Save, 
  CheckCircle2, 
  CircleDot,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { BossData } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface BossTrackerViewProps {
  bosses: BossData[];
  onUpdateDeaths: (bossId: string, delta: number) => void;
  onResetDeaths: (bossId: string) => void;
  onToggleDefeated: (bossId: string) => void;
  onSaveNotes: (bossId: string, notes: string) => void;
}

export const BossTrackerView: React.FC<BossTrackerViewProps> = ({
  bosses,
  onUpdateDeaths,
  onResetDeaths,
  onToggleDefeated,
  onSaveNotes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'undefeated' | 'defeated' | 'dlc' | 'optional'>('all');
  const [editingNotesBossId, setEditingNotesBossId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');

  const totalDeaths = bosses.reduce((sum, b) => sum + b.deaths, 0);
  const totalDefeated = bosses.filter((b) => b.defeated).length;
  const totalBosses = bosses.length;

  const handleDeathIncrement = (bossId: string) => {
    audioSynth.playDeathThud();
    onUpdateDeaths(bossId, 1);
  };

  const handleDeathDecrement = (bossId: string) => {
    onUpdateDeaths(bossId, -1);
  };

  const handleVictoryToggle = (boss: BossData) => {
    if (!boss.defeated) {
      audioSynth.playVictoryAchieved();
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['var(--theme-accent)', '#f59e0b', '#ef4444', '#10b981'],
        });
      } catch {}
    } else {
      audioSynth.playItemCheck();
    }
    onToggleDefeated(boss.id);
  };

  const startEditingNotes = (boss: BossData) => {
    setEditingNotesBossId(boss.id);
    setCurrentNoteText(boss.userNotes || '');
  };

  const saveNote = (bossId: string) => {
    onSaveNotes(bossId, currentNoteText);
    setEditingNotesBossId(null);
    audioSynth.playItemCheck();
  };

  const filteredBosses = bosses.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.portugueseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'undefeated') return !b.defeated;
    if (filterType === 'defeated') return b.defeated;
    if (filterType === 'dlc') return b.isDlc;
    if (filterType === 'optional') return b.isOptional;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* High Density Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#151515] border border-[#2a2a2a] rounded p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Mortes Totais na Run</div>
            <div className="text-3xl font-mono font-black text-[var(--theme-accent)] flex items-center gap-2 mt-0.5">
              <Skull className="w-5 h-5 text-red-500" />
              {totalDeaths}
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-1 rounded">
            YOU DIED
          </span>
        </div>

        <div className="bg-[#151515] border border-[#2a2a2a] rounded p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Chefes Derrotados</div>
            <div className="text-3xl font-mono font-black text-emerald-400 flex items-center gap-2 mt-0.5">
              <Trophy className="w-5 h-5 text-emerald-500" />
              {totalDefeated} <span className="text-base text-zinc-500 font-normal">/ {totalBosses}</span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-1 rounded">
            {Math.round((totalDefeated / totalBosses) * 100)}% VICTORY
          </span>
        </div>

        <div className="bg-[#151515] border border-[#2a2a2a] rounded p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Chefe Mais Letal (Nemesis)</div>
            {(() => {
              const hardest = [...bosses].sort((a, b) => b.deaths - a.deaths)[0];
              if (!hardest || hardest.deaths === 0) {
                return <div className="text-xs font-mono text-zinc-500 mt-1">Nenhuma morte registrada</div>;
              }
              return (
                <div className="text-sm font-bold text-white truncate max-w-[170px] mt-0.5 font-serif italic">
                  {hardest.name} <span className="text-xs text-[var(--theme-accent)] font-mono font-black not-italic">({hardest.deaths}x)</span>
                </div>
              );
            })()}
          </div>
          <span className="text-[9px] font-mono font-bold text-[var(--theme-accent)] bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/30 px-2 py-1 rounded">
            NEMESIS
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-[#111] p-3 rounded border border-[#2a2a2a]">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="boss-search-input"
            type="text"
            placeholder="Buscar chefe, área ou fraqueza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#333] text-zinc-200 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-[var(--theme-accent)] font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(['all', 'undefeated', 'defeated', 'dlc', 'optional'] as const).map((filter) => (
            <button
              key={filter}
              id={`boss-filter-${filter}`}
              onClick={() => setFilterType(filter)}
              className={`px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono tracking-wider transition-all whitespace-nowrap ${
                filterType === filter
                  ? 'bg-[var(--theme-accent)] text-black font-bold'
                  : 'bg-[#1c1c1c] text-zinc-400 hover:text-zinc-200 border border-[#2e2e2e]'
              }`}
            >
              {filter === 'all'
                ? 'Todos'
                : filter === 'undefeated'
                ? 'Vivos'
                : filter === 'defeated'
                ? 'Derrotados'
                : filter === 'dlc'
                ? 'DLC Oolacile'
                : 'Opcionais'}
            </button>
          ))}
        </div>
      </div>

      {/* Boss Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredBosses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#151515] rounded border border-[#2a2a2a] text-zinc-500 text-xs font-mono">
              Nenhum chefe encontrado com esse filtro.
            </div>
          ) : (
            filteredBosses.map((boss) => {
              const isEditing = editingNotesBossId === boss.id;

              return (
                <motion.div
                  key={boss.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`p-4 rounded border transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                    boss.defeated
                      ? 'bg-[#0e0e0e] border-[#222] opacity-85'
                      : 'bg-[#151515] hover:bg-[#181818] border-[#2a2a2a] hover:border-[var(--theme-accent)]/50 shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {boss.isDlc && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                              DLC
                            </span>
                          )}
                          {boss.isOptional && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#222] text-zinc-400 border border-[#333]">
                              OPCIONAL
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-zinc-500" />
                            {boss.location}
                          </span>
                        </div>

                        <h3 className={`text-base font-serif italic font-bold tracking-tight ${
                          boss.defeated ? 'text-emerald-400 line-through' : 'text-white'
                        }`}>
                          {boss.name}
                        </h3>
                        <div className="text-xs text-zinc-400 font-mono">
                          {boss.portugueseName} • <span className="text-[var(--theme-accent)] font-bold">{boss.souls.toLocaleString()} Almas</span>
                        </div>
                      </div>

                      {/* Victory Status Button */}
                      <button
                        id={`btn-victory-${boss.id}`}
                        onClick={() => handleVictoryToggle(boss)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all uppercase ${
                          boss.defeated
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 hover:bg-emerald-900'
                            : 'bg-[#222] hover:bg-[var(--theme-accent)] hover:text-black text-zinc-300 border border-[#333]'
                        }`}
                      >
                        {boss.defeated ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                            <span>DERROTADO</span>
                          </>
                        ) : (
                          <>
                            <CircleDot className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                            <span>Vencer Chefe</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Boss Weaknesses & Resistances */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="text-zinc-500 uppercase">Fraquezas:</span>
                      {boss.weakness.map((w, idx) => (
                        <span key={idx} className="bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] px-1.5 py-0.5 rounded border border-[var(--theme-accent)]/30 text-[9px] font-bold">
                          {w}
                        </span>
                      ))}
                      {boss.resistances.length > 0 && (
                        <>
                          <span className="text-zinc-500 uppercase ml-2">Imune/Resist:</span>
                          {boss.resistances.map((r, idx) => (
                            <span key={idx} className="bg-red-950/50 text-red-300 px-1.5 py-0.5 rounded border border-red-900/40 text-[9px]">
                              {r}
                            </span>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Dedicated Pyro & Dex Strategies */}
                    <div className="mt-3 space-y-1.5 text-xs bg-[#0d0d0d] p-2.5 rounded border border-[#222] font-mono">
                      <div className="flex items-start gap-2">
                        <Flame className="w-3 h-3 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
                        <div className="text-zinc-300 text-[11px] leading-relaxed">
                          <strong className="text-[var(--theme-accent)]">Piromancia:</strong> {boss.pyroStrategy}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-1.5 border-t border-[#1e1e1e]">
                        <Swords className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-zinc-300 text-[11px] leading-relaxed">
                          <strong className="text-blue-400">Destreza:</strong> {boss.dexStrategy}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Death Counter & Notes */}
                  <div className="mt-3.5 pt-3 border-t border-[#222] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      {/* High Density Death Counter Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-zinc-500">Mortes:</span>
                        <div className="flex items-center bg-[#0d0d0d] border border-[#333] rounded p-0.5">
                          <button
                            id={`btn-dec-death-${boss.id}`}
                            onClick={() => handleDeathDecrement(boss.id)}
                            disabled={boss.deaths <= 0}
                            className="p-1 hover:bg-[#222] text-zinc-400 hover:text-zinc-200 rounded disabled:opacity-30"
                            title="Diminuir mortes"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className={`px-2.5 font-mono text-xs font-black ${
                            boss.deaths > 0 ? 'text-[var(--theme-accent)]' : 'text-zinc-500'
                          }`}>
                            {boss.deaths < 10 ? `0${boss.deaths}` : boss.deaths}
                          </span>
                          <button
                            id={`btn-inc-death-${boss.id}`}
                            onClick={() => handleDeathIncrement(boss.id)}
                            className="p-1 bg-[var(--theme-accent)]/20 hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-black rounded transition-colors font-bold"
                            title="+1 Morte"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {boss.deaths > 0 && (
                          <button
                            id={`btn-reset-death-${boss.id}`}
                            onClick={() => onResetDeaths(boss.id)}
                            className="p-1 text-zinc-600 hover:text-zinc-400 text-[10px]"
                            title="Zerar contador"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Notes Trigger */}
                      <button
                        id={`btn-toggle-notes-${boss.id}`}
                        onClick={() => isEditing ? saveNote(boss.id) : startEditingNotes(boss)}
                        className="text-[10px] uppercase font-mono text-[var(--theme-accent)] hover:text-orange-400 flex items-center gap-1 font-bold"
                      >
                        <FileEdit className="w-3 h-3" />
                        {boss.userNotes ? 'Editar Notas' : '+ Notas'}
                      </button>
                    </div>

                    {/* Custom Notes display/editor */}
                    {isEditing ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={currentNoteText}
                          onChange={(e) => setCurrentNoteText(e.target.value)}
                          placeholder="Anotações da luta (ex: 'Usar Flash Sweat', 'Cuidado com cauda')..."
                          className="flex-1 bg-[#0d0d0d] border border-[var(--theme-accent)] text-zinc-200 text-xs rounded px-2.5 py-1.5 focus:outline-none font-mono"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveNote(boss.id);
                          }}
                        />
                        <button
                          onClick={() => saveNote(boss.id)}
                          className="bg-[var(--theme-accent)] text-black px-2.5 py-1.5 rounded text-xs font-mono font-bold hover:bg-[#ff6a2b] flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Salvar
                        </button>
                      </div>
                    ) : boss.userNotes ? (
                      <div className="text-[11px] bg-[#0d0d0d] p-2 rounded border border-[#222] text-zinc-300 italic font-mono">
                        "{boss.userNotes}"
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
