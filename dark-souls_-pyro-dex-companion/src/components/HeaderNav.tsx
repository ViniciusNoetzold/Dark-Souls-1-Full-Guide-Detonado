import React from 'react';
import { 
  Map, 
  Skull, 
  FileText, 
  Gamepad2, 
  Settings, 
  Zap,
  Minimize2,
  Maximize2,
  Sparkles,
  X
} from 'lucide-react';
import { RoadguideStage, BossData } from '../types';
import { BonfireAnimated } from './BonfireAnimated';
import { EstusFlaskAnimated } from './EstusFlaskAnimated';

export type ActiveTab = 'roadguide' | 'maps' | 'bosses' | 'build_planner' | 'checklist' | 'platinum' | 'notes' | 'steam' | 'settings';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentStage: RoadguideStage;
  bosses: BossData[];
  completedTasksCount: number;
  totalTasksCount: number;
  language: 'pt' | 'en';
  showQuickSettings: boolean;
  onToggleQuickSettings?: () => void;
  onCloseHUD?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  currentStage,
  bosses,
  completedTasksCount,
  totalTasksCount,
  language,
  showQuickSettings,
  onToggleQuickSettings,
  onCloseHUD,
}) => {
  const totalDeaths = bosses.reduce((sum, b) => sum + b.deaths, 0);
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'roadguide',
      label: 'Roadguide',
      icon: <Map className="w-3.5 h-3.5" />,
      badge: language === 'pt' ? `E${currentStage.number}` : `S${currentStage.number}`,
    },
    {
      id: 'maps',
      label: language === 'pt' ? 'Explorador' : 'Explorer',
      icon: <Map className="w-3.5 h-3.5 text-[var(--theme-accent-muted)]" />,
    },
    {
      id: 'bosses',
      label: language === 'pt' ? 'Chefes & Mortes' : 'Bosses & Deaths',
      icon: <Skull className="w-3.5 h-3.5" />,
      badge: totalDeaths > 0 ? `${totalDeaths}` : undefined,
    },
    {
      id: 'platinum',
      label: language === 'pt' ? 'Platina 100%' : '100% Platinum',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      badge: '126',
    },
    {
      id: 'build_planner',
      label: 'Build & Status',
      icon: <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent-muted)]" />,
    },
    {
      id: 'checklist',
      label: language === 'pt' ? 'Build Master (TXT)' : 'Checklist (TXT)',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'notes',
      label: language === 'pt' ? 'Notas' : 'Notes',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'steam',
      label: language === 'pt' ? 'Steam & Conquistas' : 'Steam & Achievements',
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'settings',
      label: language === 'pt' ? 'Overlay & HUD' : 'Overlay & Settings',
      icon: <Settings className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header data-tauri-drag-region className="bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#252525] sticky top-0 z-30 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        {/* Main Header Container */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-max">
            <div className="w-8 h-8 bg-[#151515] border border-[var(--theme-accent)]/40 rounded flex items-center justify-center shadow-[0_0_10px_rgba(255,78,0,0.25)] flex-shrink-0 p-0.5 overflow-hidden">
              <BonfireAnimated size="sm" showEmbers={true} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase font-serif">
                  Pyromancer + DEX <span className="text-[var(--theme-accent)]">Roadguide</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#1c1c1c] text-[var(--theme-accent)] border border-[#333]">
                  DS:R
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                Etapa atual: <span className="text-zinc-200">{currentStage.title}</span>
              </span>
            </div>
          </div>

          {/* Quick HUD Metrics & Controls (Right Side) */}
          <div className="flex items-center gap-2 text-xs flex-wrap sm:flex-nowrap">
            {/* Estus Flask Quick Pill */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#151515] rounded border border-amber-900/40 text-[11px] font-mono shadow-sm" title="Frascos de Estus Disponíveis">
              <EstusFlaskAnimated size="sm" showGlow={true} />
              <span className="text-amber-400 font-bold">10 Estus</span>
            </div>

            {/* Run Progress Progress Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#151515] rounded border border-[#2a2a2a] text-[11px] font-mono" title={language === 'pt' ? "Progresso da Run" : "Run Progress"}>
              <span className="text-zinc-500 text-[10px] uppercase">{language === 'pt' ? 'Progresso:' : 'Progress:'}</span>
              <span className="font-bold text-[var(--theme-accent)]">{progressPercent}%</span>
              <div className="w-12 bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--theme-accent)] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Total Deaths Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#151515] rounded border border-red-950/60 text-[11px] font-mono shadow-sm" title={language === 'pt' ? "Contador Total de Mortes" : "Total Death Counter"}>
              <Skull className="w-3 h-3 text-red-500" />
              <span className="text-zinc-400 text-[10px]">{language === 'pt' ? 'Mortes:' : 'Deaths:'}</span>
              <span className="font-bold text-red-400">{totalDeaths}</span>
            </div>

            {/* Toggle Quick Settings Toolbar */}
            {onToggleQuickSettings && (
              <button
                onClick={onToggleQuickSettings}
                className="bg-[#181818] hover:bg-[#222] hover:border-[var(--theme-accent)]/50 border border-[#333] text-zinc-300 px-2.5 py-1 rounded flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono transition-all shadow-sm"
                title={language === 'pt' ? "Mostrar/Esconder Barra de Configurações" : "Toggle Settings Toolbar"}
              >
                <Settings className="w-3 h-3 text-[var(--theme-accent)]" />
                <span className="hidden sm:inline">{showQuickSettings ? (language === 'pt' ? 'Esconder Menu' : 'Hide Menu') : (language === 'pt' ? 'Mostrar Menu' : 'Show Menu')}</span>
              </button>
            )}

            {/* Toggle Fullscreen Button */}
            <button
              id="btn-toggle-fullscreen"
              onClick={async () => {
                try {
                  const { getCurrentWindow } = await import('@tauri-apps/api/window');
                  const win = getCurrentWindow();
                  const isFullscreen = await win.isFullscreen();
                  await win.setFullscreen(!isFullscreen);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="bg-[#181818] hover:bg-[#222] hover:border-[var(--theme-accent)]/50 border border-[#333] text-zinc-300 px-2.5 py-1 rounded flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono transition-all shadow-sm"
              title={language === 'pt' ? "Tela Cheia / Modo Janela" : "Fullscreen / Windowed"}
            >
              <Maximize2 className="w-3 h-3 text-[var(--theme-accent)]" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Tela Cheia' : 'Fullscreen'}</span>
            </button>

            {/* Minimize HUD Button */}
            {onCloseHUD && (
              <button
                id="btn-collapse-hud"
                onClick={onCloseHUD}
                className="bg-[#181818] hover:bg-[#222] hover:border-[var(--theme-accent)]/50 border border-[#333] text-zinc-300 px-2.5 py-1 rounded flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono transition-all shadow-sm"
                title={language === 'pt' ? "Minimizar HUD para o Pet Flutuante" : "Minimize HUD to Floating Pet"}
              >
                <Minimize2 className="w-3 h-3 text-[var(--theme-accent)]" />
                <span className="hidden sm:inline">{language === 'pt' ? 'Pet' : 'Pet'}</span>
              </button>
            )}

            {/* Close App Button */}
            <button
              id="btn-close-app"
              onClick={async () => {
                try {
                  const { getCurrentWindow } = await import('@tauri-apps/api/window');
                  getCurrentWindow().close();
                } catch (e) {
                  window.close();
                }
              }}
              className="bg-[#181818] hover:bg-red-950 hover:border-red-500/50 hover:text-red-400 border border-[#333] text-zinc-300 px-2.5 py-1 rounded flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono transition-all shadow-sm ml-1"
              title={language === 'pt' ? "Fechar Aplicativo" : "Close App"}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Seamless Navigation Tab Bar (Segmented & Fluid, No Horizontal Overflow) */}
        <nav className="flex items-center gap-1.5 pt-1.5 pb-2 border-t border-[#202020] flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--theme-accent)] text-black font-bold shadow-[0_0_12px_rgba(255,78,0,0.4)]'
                    : 'bg-[#141414] hover:bg-[#1f1f1f] text-zinc-400 hover:text-zinc-200 border border-[#262626]'
                }`}
              >
                <span className={isActive ? 'text-black' : 'text-zinc-400'}>
                  {tab.icon}
                </span>
                <span className="text-[11px] font-semibold">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isActive 
                      ? 'bg-black text-[var(--theme-accent)]' 
                      : 'bg-[#222] text-zinc-300 border border-[#333]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
