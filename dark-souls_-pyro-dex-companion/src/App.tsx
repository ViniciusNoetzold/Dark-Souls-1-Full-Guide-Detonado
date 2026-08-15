import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Map, 
  Skull, 
  FileText, 
  Gamepad2, 
  Settings, 
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  RotateCcw,
  CheckCircle2,
  Shield,
  Swords,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

import { 
  RoadguideStage, 
  BossData, 
  QuickNote, 
  SteamAchievementData, 
  SteamProfileState, 
  OverlaySettings 
} from './types';

import { INITIAL_ROADGUIDE_STAGES } from './data/roadguideData';
import { INITIAL_BOSSES_DATA } from './data/bossData';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';

import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { RoadguideView } from './components/RoadguideView';
import { BossTrackerView } from './components/BossTrackerView';
import { QuickNotesView } from './components/QuickNotesView';
import { SteamSyncView } from './components/SteamSyncView';
import { PlatinumItemsView } from './components/PlatinumItemsView';
import { MapExplorerView } from './components/MapExplorerView';
import { TaticaDSView } from './components/TaticaDSView';
import { BuildPlannerView } from './components/BuildPlannerView';
import { OverlayControls } from './components/OverlayControls';
import { CompanionPet } from './components/CompanionPet';
import { BonfireAnimated } from './components/BonfireAnimated';
import { SolaireSunAnimated } from './components/SolaireSunAnimated';
import { FireKeeperAnimated } from './components/FireKeeperAnimated';
import { EstusFlaskAnimated } from './components/EstusFlaskAnimated';
import { ArtoriasAndSifAnimated } from './components/ArtoriasAndSifAnimated';
import { resolveVanity, getPlayerSummary, getAchievements } from './utils/steamApi';
import { audioSynth } from './utils/audioSynth';

const STORAGE_KEYS = {
  STAGES: 'ds1_pyro_dex_stages_v1',
  BOSSES: 'ds1_pyro_dex_bosses_v1',
  NOTES: 'ds1_pyro_dex_notes_v1',
  STEAM_PROFILE: 'ds1_pyro_dex_steam_profile_v1',
  ACHIEVEMENTS: 'ds1_pyro_dex_achievements_v1',
  SETTINGS: 'ds1_pyro_dex_settings_v1',
};

const DEFAULT_SETTINGS: OverlaySettings = {
  opacity: 0.95,
  backdropBlur: true,
  overlayMode: true,
  nightMode: true,
  theme: 'pyromancer',
  fontFamily: 'classic',
  language: 'pt',
  companionType: 'bonfire',
  soundEnabled: true,
  pinnedToCorner: 'bottom-right',
  showPetOnScreen: true,
  showQuickSettings: true,
};

const DEFAULT_STEAM_PROFILE: SteamProfileState = {
  steamId: '76561198000000000',
  personaname: 'Chosen Undead (Lordran)',
  avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
  profileUrl: 'https://steamcommunity.com',
  personaState: 1,
  isPlayingDS1: true,
  isSimulated: true,
};

export default function App() {
  // Load or Initialize Stages State
  const [stages, setStages] = useState<RoadguideStage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAGES);
    if (saved) {
      try {
        const parsed: RoadguideStage[] = JSON.parse(saved);
        // Map completions to fresh stages to ensure updated guide content is rendered
        return INITIAL_ROADGUIDE_STAGES.map((freshStage) => {
          const matchingSaved = parsed.find((s) => s.id === freshStage.id);
          if (!matchingSaved) return freshStage;
          return {
            ...freshStage,
            tasks: freshStage.tasks.map((task) => {
              const savedTask = matchingSaved.tasks.find((t) => t.id === task.id);
              return savedTask ? { ...task, completed: savedTask.completed } : task;
            }),
          };
        });
      } catch {}
    }
    return INITIAL_ROADGUIDE_STAGES;
  });

  // Load or Initialize Bosses State
  const [bosses, setBosses] = useState<BossData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOSSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BOSSES_DATA;
  });

  // Load or Initialize Quick Notes State
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'note-default-1',
        text: 'Laurentius de Great Swamp é o mestre chave para upar a Chama até +10. Resgatá-lo nas Profundezas antes de Blighttown!',
        category: 'build',
        createdAt: Date.now() - 3600000,
        pinned: true,
      },
      {
        id: 'note-default-2',
        text: 'Ao atingir 45 de DEX, a velocidade de cast de Great Combustion e Fireball fica máxima.',
        category: 'build',
        createdAt: Date.now() - 1800000,
        pinned: true,
      },
    ];
  });

  // Load Steam Profile & Achievements State
  const [steamProfile, setSteamProfile] = useState<SteamProfileState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEAM_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_STEAM_PROFILE;
  });

  const [achievements, setAchievements] = useState<SteamAchievementData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (saved) {
      try {
        const parsed: SteamAchievementData[] = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map((freshAch) => {
          const matchingSaved = parsed.find(
            (a) =>
              a.apiname === freshAch.apiname ||
              a.apiname.toLowerCase() === freshAch.apiname.toLowerCase() ||
              a.name.toLowerCase() === freshAch.name.toLowerCase() ||
              a.name.split('(')[0].trim().toLowerCase() === freshAch.name.split('(')[0].trim().toLowerCase()
          );
          if (!matchingSaved) return freshAch;
          return {
            ...freshAch,
            unlocked: matchingSaved.unlocked,
            unlockTime: matchingSaved.unlockTime,
            icon: (matchingSaved.icon && matchingSaved.icon.startsWith('http')) ? matchingSaved.icon : freshAch.icon,
          };
        });
      } catch {}
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Settings State
  const [settings, setSettings] = useState<OverlaySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_SETTINGS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('roadguide');
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[0]?.id || 'stage-1');
  const [platinumCategory, setPlatinumCategory] = useState<'all' | 'pyromancy' | 'miracle' | 'sorcery' | 'weapon' | 'ember'>('all');
  const [isHUDOpen, setIsHUDOpen] = useState<boolean>(true);
  const [isSteamLoading, setIsSteamLoading] = useState<boolean>(false);
  const [steamError, setSteamError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOSSES, JSON.stringify(bosses));
  }, [bosses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(quickNotes));
  }, [quickNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEAM_PROFILE, JSON.stringify(steamProfile));
  }, [steamProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    audioSynth.setMuted(!settings.soundEnabled);
  }, [settings]);

  // Stage tasks handlers
  const handleToggleTask = (taskId: string) => {
    setStages((prevStages) =>
      prevStages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );
  };

  // Boss handlers
  const handleUpdateDeaths = (bossId: string, delta: number) => {
    setBosses((prev) =>
      prev.map((b) => (b.id === bossId ? { ...b, deaths: Math.max(0, b.deaths + delta) } : b))
    );
  };

  const handleResetDeaths = (bossId: string) => {
    setBosses((prev) => prev.map((b) => (b.id === bossId ? { ...b, deaths: 0 } : b)));
  };

  const handleToggleDefeated = (bossId: string) => {
    setBosses((prev) =>
      prev.map((b) => (b.id === bossId ? { ...b, defeated: !b.defeated } : b))
    );
  };

  const handleSaveBossNotes = (bossId: string, notes: string) => {
    setBosses((prev) =>
      prev.map((b) => (b.id === bossId ? { ...b, userNotes: notes } : b))
    );
  };

  // Quick notes handlers
  const handleAddNote = (text: string, category: QuickNote['category']) => {
    const newNote: QuickNote = {
      id: `note-${Date.now()}`,
      text,
      category,
      createdAt: Date.now(),
      pinned: false,
    };
    setQuickNotes((prev) => [newNote, ...prev]);
  };

  const handleTogglePinNote = (noteId: string) => {
    setQuickNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setQuickNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Steam Sync Handler
  const handleSyncSteam = async (steamInput: string) => {
    setIsSteamLoading(true);
    setSteamError(null);

    try {
      // 1. Resolve vanity URL if needed
      let steamIdToUse = steamInput.trim();
      if (!/^\d{17}$/.test(steamIdToUse)) {
        const vanityData = await resolveVanity(steamIdToUse);
        if (vanityData.steamId) {
          steamIdToUse = vanityData.steamId;
        }
      }

      // 2. Fetch Player Summary
      const summaryData = await getPlayerSummary(steamIdToUse);

      if (summaryData) {
        setSteamProfile({
          steamId: steamIdToUse,
          personaname: summaryData.personaname || `Undead (${steamIdToUse.slice(-4)})`,
          avatar: summaryData.avatarfull || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
          profileUrl: summaryData.profileurl || `https://steamcommunity.com/profiles/${steamIdToUse}`,
          personaState: summaryData.personastate !== undefined ? summaryData.personastate : 1,
          isPlayingDS1: summaryData.gameid === '570940' || summaryData.gameextrainfo?.includes('DARK SOULS') || true,
          gameTitle: summaryData.gameextrainfo || 'DARK SOULS™: REMASTERED',
          lastSyncedAt: Date.now(),
          isSimulated: Boolean(summaryData.simulated),
        });
      }

      // 3. Fetch Achievements
      const achData = await getAchievements(steamIdToUse, 570940);

      if (achData && Array.isArray(achData) && achData.length > 0) {
        setAchievements((prev) =>
          prev.map((localAch) => {
            const remote = achData.find(
              (r: any) => r.apiname.toUpperCase() === localAch.apiname.toUpperCase()
            );
            return remote ? { ...localAch, unlocked: remote.achieved === 1 } : localAch;
          })
        );
      }

      audioSynth.playBonfireChime();
    } catch (err: any) {
      console.error('Steam sync error:', err);
      setSteamError('Não foi possível conectar à Steam no momento. Você ainda pode marcar conquistas manualmente.');
    } finally {
      setIsSteamLoading(false);
    }
  };

  const handleToggleAchievementManual = (apiname: string) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.apiname === apiname ? { ...ach, unlocked: !ach.unlocked } : ach
      )
    );
  };

  // Reset all run progress
  const handleResetRun = () => {
    setShowResetConfirm(true);
  };

  const performResetRun = () => {
    setStages(INITIAL_ROADGUIDE_STAGES);
    setBosses(INITIAL_BOSSES_DATA);
    setAchievements(INITIAL_ACHIEVEMENTS);
    audioSynth.playBonfireChime();
    setShowResetConfirm(false);
  };

  // Metrics
  const totalTasksCount = stages.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasksCount = stages.reduce(
    (sum, s) => sum + s.tasks.filter((t) => t.completed).length,
    0
  );
  const currentSelectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];
  const totalDeaths = bosses.reduce((sum, b) => sum + b.deaths, 0);

  return (
    <div
      id="dark-souls-app-root"
      data-theme={settings.theme || 'pyromancer'}
      data-font={settings.fontFamily || 'classic'}
      className={`min-h-screen transition-all duration-200 selection:bg-[var(--theme-accent)] selection:text-black font-sans ${
        settings.overlayMode ? 'bg-transparent text-zinc-200' : (settings.nightMode ? 'bg-[#0a0a0a] text-zinc-200' : 'bg-[#111] text-zinc-200')
      }`}
      style={{
        opacity: isHUDOpen ? settings.opacity : 1,
        backdropFilter: (!settings.overlayMode && settings.backdropBlur) ? 'blur(12px)' : 'none',
      }}
    >
      {/* Background Ambience Subtle Glow */}
      {!settings.overlayMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--theme-accent)]/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px]" />
        </div>
      )}

      {/* Main HUD Container */}
      <AnimatePresence>
        {isHUDOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            className="relative z-10 flex flex-col min-h-screen"
          >
            {/* Header Navigation */}
            <HeaderNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              currentStage={currentSelectedStage}
              bosses={bosses}
              completedTasksCount={completedTasksCount}
              totalTasksCount={totalTasksCount}
              language={settings.language}
              showQuickSettings={settings.showQuickSettings}
              onToggleQuickSettings={() => setSettings(s => ({ ...s, showQuickSettings: !s.showQuickSettings }))}
              onCloseHUD={() => setIsHUDOpen(false)}
            />

            {/* Quick Floating Toolbar in Overlay Mode */}
            {settings.showQuickSettings && (
              <div className="max-w-7xl mx-auto px-4 w-full mt-3 relative">
                <OverlayControls
                  settings={settings}
                  onUpdateSettings={(updates) => setSettings((s) => ({ ...s, ...updates }))}
                />
              </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-4 w-full">
              {activeTab === 'roadguide' && (
                <RoadguideView
                  stages={stages}
                  selectedStageId={selectedStageId}
                  onSelectStage={setSelectedStageId}
                  onToggleTask={handleToggleTask}
                />
              )}

              {activeTab === 'bosses' && (
                <BossTrackerView
                  bosses={bosses}
                  onUpdateDeaths={handleUpdateDeaths}
                  onResetDeaths={handleResetDeaths}
                  onToggleDefeated={handleToggleDefeated}
                  onSaveNotes={handleSaveBossNotes}
                />
              )}

              {activeTab === 'platinum' && (
                <PlatinumItemsView initialCategory={platinumCategory} />
              )}

              {activeTab === 'checklist' && (
                <TaticaDSView />
              )}

              {activeTab === 'build_planner' && (
                <BuildPlannerView />
              )}

              {activeTab === 'maps' && (
                <MapExplorerView />
              )}

              {activeTab === 'notes' && (
                <QuickNotesView
                  notes={quickNotes}
                  onAddNote={handleAddNote}
                  onTogglePin={handleTogglePinNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}

              {activeTab === 'steam' && (
                <SteamSyncView
                  profile={steamProfile}
                  achievements={achievements}
                  onSyncSteam={handleSyncSteam}
                  onToggleAchievementManual={handleToggleAchievementManual}
                  onNavigateToPlatinum={(category) => {
                    if (category) setPlatinumCategory(category as any);
                    setActiveTab('platinum');
                  }}
                  onNavigateToBosses={(_bossId) => {
                    setActiveTab('bosses');
                  }}
                  onNavigateToRoadguide={(stageNum) => {
                    if (stageNum) {
                      const targetStage = stages.find((s) => s.number === stageNum);
                      if (targetStage) setSelectedStageId(targetStage.id);
                    }
                    setActiveTab('roadguide');
                  }}
                  isLoading={isSteamLoading}
                  error={steamError}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="bg-[#151515] border border-[#2a2a2a] rounded p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#222] pb-3">
                      <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[var(--theme-accent)]" />
                        Configurações do Overlay & Detalhes da Build
                      </h2>
                      <span className="text-[10px] font-mono text-zinc-500">
                        PYROMANCER + DEXTERITY ROADGUIDE
                      </span>
                    </div>

                    {/* Pyro + Dex Build Summary Card */}
                    <div className="bg-[#0d0d0d] p-4 rounded border border-[#2a2a2a] space-y-2">
                      <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono font-bold text-xs uppercase tracking-wider">
                        <Flame className="w-4 h-4 text-[var(--theme-accent)]" />
                        Resumo da Build Piromante + Destreza (Dark Souls 1)
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                        A build de Piromancia com Destreza é uma das combinações mais letais de todo o jogo. Em Dark Souls 1, a Destreza aumenta a velocidade de conjuração das magias entre 35 e 45 DEX (com 45 sendo o softcap absoluto). A chama de piromancia não necessita de atributos para dano base, permitindo investir em Vigor, Vitalidade e Destreza para dano de corte com Uchigatana, Great Scythe e Balder Side Sword.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs font-mono">
                        <div className="bg-[#151515] p-2.5 rounded border border-[#2a2a2a]">
                          <span className="text-zinc-500 block text-[9px] uppercase">Arma Primária DEX:</span>
                          <strong className="text-white">Uchigatana / Great Scythe +15</strong>
                        </div>
                        <div className="bg-[#151515] p-2.5 rounded border border-[#2a2a2a]">
                          <span className="text-zinc-500 block text-[9px] uppercase">Feitiços Nucleares:</span>
                          <strong className="text-[var(--theme-accent)]">Great Combustion + Black Flame</strong>
                        </div>
                        <div className="bg-[#151515] p-2.5 rounded border border-[#2a2a2a]">
                          <span className="text-zinc-500 block text-[9px] uppercase">Anéis Recomendados:</span>
                          <strong className="text-zinc-200">Bellowing Ring + FaP / Havel</strong>
                        </div>
                      </div>
                    </div>

                    {/* Virtual Companions Showcase */}
                    <div className="bg-[#0d0d0d] p-4 rounded border border-[#2a2a2a] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Mascotes Virtuais do HUD (Lordran Companions)
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Selecione o guardião que flutuará na tela
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                        {/* 1. Bonfire */}
                        <div
                          onClick={() => {
                            audioSynth.playBonfireChime();
                            setSettings((s) => ({ ...s, companionType: 'bonfire' }));
                          }}
                          className={`p-3 rounded border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            settings.companionType === 'bonfire'
                              ? 'bg-[#1e1510] border-[var(--theme-accent)] shadow-lg shadow-[var(--theme-accent)]/20'
                              : 'bg-[#151515] border-[#2a2a2a] hover:border-zinc-600'
                          }`}
                        >
                          <div className="h-14 flex items-center justify-center">
                            <BonfireAnimated size="sm" showEmbers={true} />
                          </div>
                          <span className="text-xs font-mono font-bold text-white mt-1">Fogueira</span>
                          <span className="text-[9px] font-mono text-zinc-400">Cinzas e Espada Espiral</span>
                        </div>

                        {/* 2. Solaire Holy Sun */}
                        <div
                          onClick={() => {
                            audioSynth.playBonfireChime();
                            setSettings((s) => ({ ...s, companionType: 'solaire' }));
                          }}
                          className={`p-3 rounded border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            settings.companionType === 'solaire'
                              ? 'bg-[#1e1510] border-amber-500 shadow-lg shadow-amber-500/20'
                              : 'bg-[#151515] border-[#2a2a2a] hover:border-zinc-600'
                          }`}
                        >
                          <div className="h-14 flex items-center justify-center">
                            <SolaireSunAnimated size="sm" showRaysAnimation={true} />
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400 mt-1">Solaire Sun</span>
                          <span className="text-[9px] font-mono text-zinc-400">Praise the Sun!</span>
                        </div>

                        {/* 3. Fire Keeper */}
                        <div
                          onClick={() => {
                            audioSynth.playBonfireChime();
                            setSettings((s) => ({ ...s, companionType: 'firekeeper' }));
                          }}
                          className={`p-3 rounded border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            settings.companionType === 'firekeeper'
                              ? 'bg-[#1e1510] border-amber-600 shadow-lg shadow-amber-600/20'
                              : 'bg-[#151515] border-[#2a2a2a] hover:border-zinc-600'
                          }`}
                        >
                          <div className="h-14 flex items-center justify-center">
                            <FireKeeperAnimated size="sm" showAura={true} />
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-200 mt-1">Fire Keeper</span>
                          <span className="text-[9px] font-mono text-zinc-400">Alma da Guardiã</span>
                        </div>

                        {/* 4. Estus Flask */}
                        <div
                          onClick={() => {
                            audioSynth.playBonfireChime();
                            setSettings((s) => ({ ...s, companionType: 'estus' }));
                          }}
                          className={`p-3 rounded border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                            settings.companionType === 'estus'
                              ? 'bg-[#1e1510] border-amber-500 shadow-lg shadow-amber-500/20'
                              : 'bg-[#151515] border-[#2a2a2a] hover:border-zinc-600'
                          }`}
                        >
                          <div className="h-14 flex items-center justify-center">
                            <EstusFlaskAnimated size="sm" showGlow={true} />
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400 mt-1">Frasco Estus</span>
                          <span className="text-[9px] font-mono text-zinc-400">Chama Engarrafada</span>
                        </div>

                        {/* 5. Artorias & Sif */}
                        <div
                          onClick={() => {
                            audioSynth.playBonfireChime();
                            setSettings((s) => ({ ...s, companionType: 'artorias' }));
                          }}
                          className={`p-3 rounded border cursor-pointer flex flex-col items-center justify-center text-center transition-all col-span-2 sm:col-span-1 ${
                            settings.companionType === 'artorias'
                              ? 'bg-[#0f172a] border-cyan-500 shadow-lg shadow-cyan-900/30'
                              : 'bg-[#151515] border-[#2a2a2a] hover:border-zinc-600'
                          }`}
                        >
                          <div className="h-14 flex items-center justify-center">
                            <ArtoriasAndSifAnimated size="sm" showAbyssAura={true} />
                          </div>
                          <span className="text-xs font-mono font-bold text-cyan-300 mt-1">Artorias & Sif</span>
                          <span className="text-[9px] font-mono text-zinc-400">Cavaleiro e Lobo</span>
                        </div>
                      </div>
                    </div>

                    {/* Reset Run Button */}
                    <div className="pt-3 border-t border-[#222] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white font-mono uppercase">Reiniciar Progresso da Run</div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          Zera todas as checklists, contadores de mortes e conquistas salvas localmente.
                        </div>
                      </div>
                      <button
                        id="btn-reset-full-run"
                        onClick={handleResetRun}
                        className="px-3.5 py-1.5 bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/60 rounded text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Nova Run
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Bottom Footer Bar */}
            <footer className="border-t border-[#222] bg-[#0d0d0d] py-2.5 px-4 text-center text-xs text-zinc-500 font-mono">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Flame className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  Dark Souls: Remastered Pyro+Dex Companion HUD
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">
                  Praise the Sun! • High-Density In-Game Overlay
                </span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-[var(--theme-accent)]/30 p-6 rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4 text-[var(--theme-accent)]">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-serif font-bold uppercase">Reiniciar Toda a Run?</h3>
              </div>
              <p className="text-sm text-zinc-300 font-sans mb-6">
                Tem certeza que deseja apagar todos os dados salvos e recomeçar sua jornada? Isso zerará todas as checklists do Roadguide, contadores de mortes dos chefes e conquistas salvas localmente.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-[#222] hover:bg-[#333] text-zinc-300 border border-[#444] rounded text-sm font-mono uppercase font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={performResetRun}
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded text-sm font-mono uppercase font-bold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Sim, Zere Tudo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize Handle for Windowed Mode */}
      {!settings.overlayMode && (
        <div
          className="fixed bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-end justify-end p-1 opacity-50 hover:opacity-100"
          onPointerDown={async (e) => {
            if (e.button !== 0) return;
            try {
              const { getCurrentWindow } = await import('@tauri-apps/api/window');
              await getCurrentWindow().startResizing('bottomRight');
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L0 12H12V0Z" fill="currentColor" className="text-zinc-500" />
          </svg>
        </div>
      )}

      {/* Floating Virtual Pet / Companion Widget (Always accessible) */}
      <CompanionPet
        companionType={settings.companionType}
        isOpen={isHUDOpen}
        onToggleOpen={() => setIsHUDOpen((prev) => !prev)}
        currentStage={currentSelectedStage}
        totalDeaths={totalDeaths}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        isOverlayMode={settings.overlayMode}
        opacity={settings.opacity}
        onQuickNoteClick={() => {
          setIsHUDOpen(true);
          setActiveTab('notes');
        }}
      />
    </div>
  );
}
