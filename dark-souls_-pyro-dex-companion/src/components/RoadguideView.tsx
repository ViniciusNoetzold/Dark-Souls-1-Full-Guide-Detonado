import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  Swords, 
  BookOpen, 
  Zap, 
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Layers,
  AlertTriangle,
  Target,
  ListChecks
} from 'lucide-react';
import { RoadguideStage, TaskCategory } from '../types';
import { audioSynth } from '../utils/audioSynth';
import { BonfireAnimated } from './BonfireAnimated';
import { EstusFlaskAnimated } from './EstusFlaskAnimated';
import { StageHeaderIcon } from './StageHeaderIcon';
import { ChosenUndeadProgressTracker } from './ChosenUndeadProgressTracker';

interface RoadguideViewProps {
  stages: RoadguideStage[];
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const RoadguideView: React.FC<RoadguideViewProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  onToggleTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'guide' | 'tactics'>('checklist');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const currentStageIndex = stages.findIndex((s) => s.id === selectedStageId);
  const currentStage = stages[currentStageIndex] || stages[0];
  const hasNextStage = currentStageIndex < stages.length - 1;

  const handleNextStage = () => {
    if (hasNextStage) {
      onSelectStage(stages[currentStageIndex + 1].id);
    }
  };

  const handleTaskClick = (taskId: string) => {
    audioSynth.playItemCheck();
    onToggleTask(taskId);
  };

  const filteredTasks = currentStage.tasks.filter((task) => {
    const matchCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchCategory && matchPriority;
  });

  const completedCount = currentStage.tasks.filter((t) => t.completed).length;
  const totalCount = currentStage.tasks.length;
  const stageProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Extract boss task if any for quick spotlight
  const stageBossTask = currentStage.tasks.find((t) => t.category === 'boss') || currentStage.tasks[0];

  const getCategoryBadge = (category: TaskCategory) => {
    switch (category) {
      case 'pyromancy':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30">
            <Flame className="w-2.5 h-2.5" /> Pyro
          </span>
        );
      case 'weapon':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-blue-950/60 text-blue-400 border border-blue-800/40">
            <Swords className="w-2.5 h-2.5" /> DEX Weapon
          </span>
        );
      case 'boss':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-red-950/60 text-red-400 border border-red-800/40">
            <ShieldAlert className="w-2.5 h-2.5" /> Boss
          </span>
        );
      case 'npc':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Sparkles className="w-2.5 h-2.5" /> NPC
          </span>
        );
      case 'shortcut':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
            <Zap className="w-2.5 h-2.5" /> Shortcut / Key
          </span>
        );
      case 'stat':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Award className="w-2.5 h-2.5" /> Stat Goal
          </span>
        );
      case 'exploration':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            <MapPin className="w-2.5 h-2.5" /> Explore
          </span>
        );
      case 'quest':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-purple-950/60 text-purple-400 border border-purple-800/40">
            <BookOpen className="w-2.5 h-2.5" /> Quest
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
            <MapPin className="w-2.5 h-2.5" /> Item
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-stretch">
      {/* Sidebar: High Density Journey Progress */}
      <aside className="w-full lg:w-72 border border-[#2a2a2a] bg-[#0d0d0d] rounded flex flex-col flex-shrink-0 overflow-hidden shadow-xl">
        <div className="p-3.5 border-b border-[#2a2a2a] bg-[#111] flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-accent)] font-bold">
            Journey Progress
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">{stages.length} STAGES</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e1e] max-h-[260px] lg:max-h-[700px] scrollbar-thin">
          {stages.map((stage) => {
            const isSelected = stage.id === currentStage.id;
            const completed = stage.tasks.filter((t) => t.completed).length;
            const total = stage.tasks.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isFinished = completed === total && total > 0;

            return (
              <button
                key={stage.id}
                id={`stage-nav-${stage.id}`}
                onClick={() => onSelectStage(stage.id)}
                className={`w-full text-left p-3.5 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#1a1a1a] border-l-2 border-[var(--theme-accent)]'
                    : isFinished
                    ? 'hover:bg-[#151515] opacity-90'
                    : 'hover:bg-[#151515] opacity-75'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <StageHeaderIcon
                    stageNumber={stage.number}
                    isCompleted={isFinished}
                    progressPct={pct}
                    size="sm"
                  />
                  <div className="truncate">
                    <span className={`text-xs font-medium block truncate ${
                      isSelected ? 'text-white font-bold' : isFinished ? 'text-emerald-400' : 'text-zinc-300'
                    }`}>
                      {stage.title.split(':')[0]}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate block">
                      {stage.zone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-xs font-mono font-bold ${
                    pct === 100 ? 'text-emerald-400' : isSelected ? 'text-[var(--theme-accent)]' : 'text-zinc-500'
                  }`}>
                    {pct}%
                  </span>
                  {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Build Metrics at Bottom of Sidebar */}
        <div className="p-3 bg-[#111] border-t border-[#2a2a2a] text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span>DEX Recomendada:</span>
            <span className="text-white font-bold">{currentStage.recommendedDex}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Chama Recomendada:</span>
            <span className="text-[var(--theme-accent)] font-bold">{currentStage.recommendedPyroFlame}</span>
          </div>
          {currentStage.levelRange && (
            <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-[#222]">
              <span>Level da Etapa:</span>
              <span className="text-amber-400 font-bold">{currentStage.levelRange}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Section */}
      <section className="flex-1 flex flex-col space-y-4 min-w-0">
        {/* Stage Header Banner */}
        <div className="bg-[#151515] p-4 sm:p-5 rounded border border-[#2a2a2a] shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
            <div className="flex items-start gap-3">
              <StageHeaderIcon
                stageNumber={currentStage.number}
                isCompleted={stageProgress === 100}
                progressPct={stageProgress}
                size="md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${
                    stageProgress === 100
                      ? 'bg-amber-400/20 text-amber-300 border-amber-500/50'
                      : 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/30'
                  }`}>
                    {stageProgress === 100 ? 'ESTÁGIO CONCLUÍDO' : `ESTÁGIO ${currentStage.number}`}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {currentStage.zone}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">
                  {currentStage.title}
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {currentStage.subtitle}
                </p>
              </div>
            </div>

            {stageProgress === 100 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">Fogueira Acesa & 100% Completo</span>
              </div>
            )}
          </div>

          {/* Interactive Chosen Undead Progress Tracker */}
          <ChosenUndeadProgressTracker
            completedCount={completedCount}
            totalCount={totalCount}
            stageProgress={stageProgress}
            currentStageNumber={currentStage.number}
            hasNextStage={hasNextStage}
            onNextStage={handleNextStage}
            stageTitle={currentStage.title}
          />

          {/* Build Status Card (if available for stage) */}
          {currentStage.buildStatus && (
            <div className="bg-[#0d0d0d] p-3.5 rounded border border-[#262626] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-zinc-500 text-[9px] uppercase block">Level Progress:</span>
                <strong className="text-amber-400 text-[11px]">{currentStage.buildStatus.startLevel} ➔ {currentStage.buildStatus.endLevel}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-500 text-[9px] uppercase block">Armas & Magia:</span>
                <strong className="text-zinc-200 text-[11px] truncate block" title={currentStage.buildStatus.weapons}>
                  {currentStage.buildStatus.weapons}
                </strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-500 text-[9px] uppercase block">Atributo Foco:</span>
                <strong className="text-[var(--theme-accent)] text-[11px]">{currentStage.buildStatus.focusStat}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-500 text-[9px] uppercase block">Defesa / Escudo:</span>
                <strong className="text-emerald-400 text-[11px] truncate block" title={currentStage.buildStatus.defense}>
                  {currentStage.buildStatus.defense}
                </strong>
              </div>
            </div>
          )}

          {/* Key Rewards Pill List */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1 mr-1">
              <Award className="w-3 h-3 text-[var(--theme-accent)]" /> Coletáveis Chave:
            </span>
            {currentStage.keyRewards.map((reward, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[#1c1c1c] text-zinc-300 border border-[#2a2a2a]"
              >
                {reward}
              </span>
            ))}
          </div>
        </div>

        {/* View Mode Tabs: Checklist vs Full Guide Chapters vs Combat Tactics */}
        <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded border border-[#2a2a2a]">
          <button
            id="subtab-checklist"
            onClick={() => setActiveSubTab('checklist')}
            className={`flex-1 py-2 px-3 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'checklist'
                ? 'bg-[var(--theme-accent)] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Checklist Interativa ({totalCount})</span>
          </button>

          {currentStage.guideSections && currentStage.guideSections.length > 0 && (
            <button
              id="subtab-guide"
              onClick={() => setActiveSubTab('guide')}
              className={`flex-1 py-2 px-3 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'guide'
                  ? 'bg-[var(--theme-accent)] text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia de Rota & Capítulos</span>
            </button>
          )}

          {currentStage.combatTactics && currentStage.combatTactics.length > 0 && (
            <button
              id="subtab-tactics"
              onClick={() => setActiveSubTab('tactics')}
              className={`flex-1 py-2 px-3 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'tactics'
                  ? 'bg-[var(--theme-accent)] text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Táticas de Combate</span>
            </button>
          )}
        </div>

        {/* TAB 1: INTERACTIVE CHECKLIST */}
        {activeSubTab === 'checklist' && (
          <div className="space-y-4">
            {/* Stage Boss & Tactical Objectives Header */}
            {stageBossTask && (
              <div className="bg-[#151515] p-3.5 sm:p-4 rounded border border-[#2a2a2a] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-[#20100a] border border-[var(--theme-accent)]/40 flex items-center justify-center text-[var(--theme-accent)] flex-shrink-0 shadow-sm">
                    <Swords className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-[var(--theme-accent)] px-1.5 py-0.2 border border-[var(--theme-accent)]/30 rounded bg-[var(--theme-accent)]/10 font-mono font-bold uppercase">
                        Chefe Principal da Etapa
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {currentStage.zone}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight">
                      {stageBossTask.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5 max-w-2xl leading-relaxed">
                      {stageBossTask.pyroTip || stageBossTask.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => handleTaskClick(stageBossTask.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                      stageBossTask.completed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                        : 'bg-[var(--theme-accent)] text-black hover:bg-[#ff6a2b] shadow-[0_0_10px_rgba(255,78,0,0.3)]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    {stageBossTask.completed ? 'Chefe Derrotado ✓' : 'Marcar Derrotado'}
                  </button>
                </div>
              </div>
            )}

            {/* Checklist Header with Counter & Filter Bar */}
            <div className="space-y-2.5 bg-[#111] p-3 rounded border border-[#2a2a2a]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-[var(--theme-accent)]" />
                    Objetivos da Etapa ({completedCount} de {totalCount} Concluídos)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allDone = currentStage.tasks.every(t => t.completed);
                      currentStage.tasks.forEach(t => {
                        if (t.completed === allDone) {
                          onToggleTask(t.id);
                        }
                      });
                    }}
                    className="text-[10px] font-mono uppercase text-zinc-400 hover:text-zinc-200 bg-[#1c1c1c] hover:bg-[#252525] px-2 py-1 rounded border border-[#333] transition-colors"
                  >
                    {currentStage.tasks.every(t => t.completed) ? 'Desmarcar Todos' : 'Marcar Todos Concluídos'}
                  </button>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  <span className="text-zinc-500 flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider">
                    <Filter className="w-3 h-3 text-[var(--theme-accent)]" /> Categoria:
                  </span>
                  {['all', 'pyromancy', 'weapon', 'boss', 'npc', 'shortcut', 'stat', 'item'].map((cat) => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat}`}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-1 rounded-sm text-[10px] uppercase font-mono tracking-wider transition-all whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-[var(--theme-accent)] text-black font-bold'
                          : 'bg-[#1c1c1c] text-zinc-400 hover:text-zinc-200 border border-[#2e2e2e]'
                      }`}
                    >
                      {cat === 'all' ? `TODAS (${totalCount})` : cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-[10px] uppercase font-mono">Prioridade:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-[#1c1c1c] border border-[#333] text-zinc-200 text-[10px] font-mono rounded px-2 py-1 focus:outline-none focus:border-[var(--theme-accent)]"
                  >
                    <option value="all">Todas as Prioridades</option>
                    <option value="essential">Essenciais ⭐</option>
                    <option value="recommended">Recomendadas</option>
                    <option value="optional">Opcionais</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Full Interactive Tasks List */}
            <div className="space-y-2 overflow-y-auto max-h-[450px] pr-2 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 bg-[#151515] rounded border border-[#2a2a2a] text-zinc-500 text-xs font-mono">
                    Nenhum objetivo encontrado com os filtros selecionados.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        onClick={() => handleTaskClick(task.id)}
                        className={`group relative p-3.5 rounded border transition-all duration-150 cursor-pointer ${
                          task.completed
                            ? 'bg-[#0e0e0e] border-[#222] opacity-80'
                            : 'bg-[#151515] hover:bg-[#1a1a1a] border-[#2a2a2a] hover:border-[var(--theme-accent)]/50 shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {task.completed ? (
                              <div className="w-4 h-4 rounded-sm bg-[var(--theme-accent)] border border-[var(--theme-accent)] flex items-center justify-center text-black shadow-[0_0_8px_rgba(255,78,0,0.4)]">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-sm border border-[#444] group-hover:border-[var(--theme-accent)] flex items-center justify-center transition-colors">
                                <div className="w-1.5 h-1.5 bg-transparent group-hover:bg-[var(--theme-accent)]/40 rounded-xs transition-colors" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {getCategoryBadge(task.category)}
                              {task.priority === 'essential' && (
                                <span className="text-[9px] font-mono font-bold text-[var(--theme-accent)] bg-[var(--theme-accent)]/10 px-1.5 py-0.2 rounded border border-[var(--theme-accent)]/30">
                                  ⭐ ESSENCIAL
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 ml-auto">
                                <MapPin className="w-2.5 h-2.5 text-zinc-500" />
                                {task.location}
                              </span>
                            </div>

                            <h3 className={`text-xs font-semibold tracking-tight ${
                              task.completed ? 'text-zinc-500 line-through' : 'text-zinc-100 group-hover:text-white'
                            }`}>
                              {task.title}
                            </h3>

                            <p className={`text-[11px] mt-1 leading-relaxed ${
                              task.completed ? 'text-zinc-600' : 'text-zinc-300'
                            }`}>
                              {task.description}
                            </p>

                            {(task.pyroTip || task.dexTip) && (
                              <div className="mt-2 pt-2 border-t border-[#222] grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                {task.pyroTip && (
                                  <div className="flex items-start gap-1.5 text-orange-300/90 bg-[#1c120c] p-1.5 rounded border border-[var(--theme-accent)]/20 font-mono text-[10px]">
                                    <Flame className="w-3 h-3 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-[var(--theme-accent)]">Pyro Tip:</strong> {task.pyroTip}</span>
                                  </div>
                                )}
                                {task.dexTip && (
                                  <div className="flex items-start gap-1.5 text-blue-300/90 bg-[#0c1424] p-1.5 rounded border border-blue-800/30 font-mono text-[10px]">
                                    <Swords className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-blue-400">DEX Tip:</strong> {task.dexTip}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* TAB 2: FULL ROUTE & CHAPTERS GUIDE */}
        {activeSubTab === 'guide' && currentStage.guideSections && (
          <div className="space-y-4">
            <div className="bg-[#151515] p-4 rounded border border-[#2a2a2a] text-xs font-mono leading-relaxed text-zinc-300">
              <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-3">
                <h3 className="text-xs uppercase tracking-widest text-[var(--theme-accent)] font-bold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Guia Estratégico Detalhado: {currentStage.title}
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">Progressão Orgânica</span>
              </div>
              <p className="text-zinc-400 mb-3">
                {currentStage.summary}
              </p>
            </div>

            <div className="space-y-3">
              {currentStage.guideSections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-[#151515] rounded border border-[#2a2a2a] p-4 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-[#222] pb-2">
                    <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                      <span className="w-5 h-5 rounded-sm bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/40 text-[var(--theme-accent)] flex items-center justify-center text-[10px]">
                        0{idx + 1}
                      </span>
                      {sec.title}
                    </h4>
                    {sec.badge && (
                      <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#1c1c1c] text-[var(--theme-accent)] border border-[#2a2a2a]">
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs font-mono text-zinc-300">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-[var(--theme-accent)] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {sec.warning && (
                    <div className="mt-2 p-2.5 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span><strong>ATENÇÃO:</strong> {sec.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMBAT TACTICS & BUILD MECHANICS */}
        {activeSubTab === 'tactics' && currentStage.combatTactics && (
          <div className="space-y-4">
            <div className="bg-[#151515] p-4 rounded border border-[#2a2a2a] shadow-lg space-y-3">
              <div className="border-b border-[#222] pb-2">
                <h3 className="text-xs uppercase tracking-widest text-[var(--theme-accent)] font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--theme-accent)]" />
                  Mecânicas & Táticas de Combate (Piro + Dex)
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Vantagens exclusivas do arquétipo Híbrido no início de Dark Souls 1.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {currentStage.combatTactics.map((tactic, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d0d0d] p-3.5 rounded border border-[#2a2a2a] flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-white font-mono">
                          {tactic.name}
                        </h4>
                        {tactic.tag && (
                          <span className="text-[9px] font-mono font-bold text-[var(--theme-accent)] bg-[var(--theme-accent)]/10 px-1.5 py-0.2 rounded border border-[var(--theme-accent)]/30">
                            {tactic.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                        {tactic.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice Banner */}
            <div className="bg-[#151515] p-4 rounded border border-[#2a2a2a] text-xs font-mono text-zinc-400 space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dica de Ouro da Build:
              </div>
              <p className="leading-relaxed">
                O dano do personagem no começo do jogo é muito mais influenciado pelo fortalecimento da arma no Ferreiro e pelo nível da Chama de Piromancia do que por subir dezenas de níveis no personagem em si. Use suas almas preferencialmente para upgrades e compra de itens chaves como a Residence Key.
              </p>
            </div>
          </div>
        )}

        {/* Stage Navigation Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#222]">
          <button
            id="btn-prev-stage"
            disabled={currentStageIndex === 0}
            onClick={() => onSelectStage(stages[currentStageIndex - 1].id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider border ${
              currentStageIndex === 0
                ? 'opacity-30 cursor-not-allowed border-[#222] text-zinc-600'
                : 'bg-[#1a1a1a] text-zinc-200 border-[#333] hover:bg-[#252525] hover:border-[var(--theme-accent)]'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Fase Anterior
          </button>

          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Etapa {currentStageIndex + 1} de {stages.length}
          </span>

          <button
            id="btn-next-stage"
            disabled={currentStageIndex === stages.length - 1}
            onClick={() => onSelectStage(stages[currentStageIndex + 1].id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider border ${
              currentStageIndex === stages.length - 1
                ? 'opacity-30 cursor-not-allowed border-[#222] text-zinc-600'
                : 'bg-[var(--theme-accent)] text-black font-bold border-[var(--theme-accent)] hover:bg-[#ff6a2b]'
            }`}
          >
            Próxima Fase <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
