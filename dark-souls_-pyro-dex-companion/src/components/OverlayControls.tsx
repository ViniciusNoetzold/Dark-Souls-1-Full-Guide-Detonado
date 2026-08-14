import React from 'react';
import { 
  Sliders, 
  Eye, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Minimize2, 
  Maximize2, 
  Sparkles,
  Flame
} from 'lucide-react';
import { OverlaySettings, CompanionType } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface OverlayControlsProps {
  settings: OverlaySettings;
  onUpdateSettings: (updates: Partial<OverlaySettings>) => void;
}

export const OverlayControls: React.FC<OverlayControlsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    audioSynth.setMuted(!next);
    if (next) audioSynth.playItemCheck();
    onUpdateSettings({ soundEnabled: next });
  };

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Opacity Slider for In-Game Overlay */}
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400 text-[10px] uppercase whitespace-nowrap">HUD Opacity:</span>
          <input
            id="overlay-opacity-range"
            type="range"
            min="0.25"
            max="1.0"
            step="0.05"
            value={settings.opacity}
            onChange={(e) => onUpdateSettings({ opacity: parseFloat(e.target.value) })}
            className="w-20 accent-[var(--theme-accent)] cursor-pointer h-1.5 bg-[#222] rounded"
          />
          <span className="text-[10px] font-mono text-[var(--theme-accent)] font-bold w-7">
            {Math.round(settings.opacity * 100)}%
          </span>
        </div>

        {/* Backdrop Blur Toggle */}
        <button
          id="btn-toggle-blur"
          onClick={() => onUpdateSettings({ backdropBlur: !settings.backdropBlur })}
          className={`px-2 py-1 rounded-sm text-[10px] uppercase font-mono tracking-wider border transition-colors ${
            settings.backdropBlur
              ? 'bg-[#1e1e1e] text-[var(--theme-accent)] border-[var(--theme-accent)]/50 font-bold'
              : 'bg-[#151515] text-zinc-400 border-[#2a2a2a]'
          }`}
        >
          Blur: {settings.backdropBlur ? 'ON' : 'OFF'}
        </button>

        {/* Night / Ash Dark Mode */}
        <button
          id="btn-toggle-night"
          onClick={() => onUpdateSettings({ nightMode: !settings.nightMode })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono tracking-wider border transition-colors ${
            settings.nightMode
              ? 'bg-[#1e1e1e] text-[var(--theme-accent)] border-[var(--theme-accent)]/50 font-bold'
              : 'bg-[#151515] text-zinc-400 border-[#2a2a2a]'
          }`}
          title="Alternar Modo Noturno / Cinzas de Lordran"
        >
          <Moon className="w-3 h-3 text-[var(--theme-accent)]" />
          <span>Night Mode</span>
        </button>

        {/* Audio Synthesizer SFX */}
        <button
          id="btn-toggle-sound"
          onClick={handleSoundToggle}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono tracking-wider border transition-colors ${
            settings.soundEnabled
              ? 'bg-[#1e1e1e] text-[var(--theme-accent)] border-[var(--theme-accent)]/50 font-bold'
              : 'bg-[#151515] text-zinc-500 border-[#2a2a2a]'
          }`}
          title="Sons de fogueira e conquistas"
        >
          {settings.soundEnabled ? (
            <>
              <Volume2 className="w-3 h-3 text-[var(--theme-accent)]" />
              <span>Audio SFX</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-zinc-500" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2 border-l border-[#2a2a2a] pl-4">
          <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[var(--theme-accent)]" /> Theme:
          </span>
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-0.5 rounded border border-[#2a2a2a]">
            {([
              { id: 'pyromancer', label: '🔥 Pyro' },
              { id: 'sorcerer', label: '🔮 Magic' },
              { id: 'cleric', label: '☀️ Faith' },
              { id: 'abyssal', label: '🌑 Dark' },
              { id: 'hollow', label: '💀 Hollow' },
            ] as const).map((theme) => (
              <button
                key={theme.id}
                onClick={() => onUpdateSettings({ theme: theme.id })}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                  settings.theme === theme.id
                    ? 'bg-[var(--theme-accent)] text-black font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-2 border-l border-[#2a2a2a] pl-4">
          <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[var(--theme-accent)]" /> Font:
          </span>
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-0.5 rounded border border-[#2a2a2a]">
            {([
              { id: 'classic', label: 'Classic' },
              { id: 'clean', label: 'Clean' },
              { id: 'soft', label: 'Soft' },
              { id: 'cartoon', label: 'Cartoon' },
            ] as const).map((font) => (
              <button
                key={font.id}
                onClick={() => onUpdateSettings({ fontFamily: font.id })}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                  settings.fontFamily === font.id
                    ? 'bg-[var(--theme-accent)] text-black font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 border-l border-[#2a2a2a] pl-4">
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-0.5 rounded border border-[#2a2a2a]">
            {([
              { id: 'pt', label: 'PT' },
              { id: 'en', label: 'EN' },
            ] as const).map((lang) => (
              <button
                key={lang.id}
                onClick={() => onUpdateSettings({ language: lang.id })}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                  settings.language === lang.id
                    ? 'bg-[var(--theme-accent)] text-black font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

      {/* Companion Virtual Pet Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[var(--theme-accent)]" /> Pet:
        </span>
        <div className="flex items-center gap-1 bg-[#0d0d0d] p-0.5 rounded border border-[#2a2a2a]">
          {([
            { id: 'bonfire', label: '🔥 Bonfire' },
            { id: 'solaire', label: '☀️ Solaire' },
            { id: 'firekeeper', label: '👑 Keeper' },
            { id: 'estus', label: '🧪 Estus' },
            { id: 'artorias', label: '🐺 Artorias & Sif' },
          ] as const).map((pet) => (
            <button
              key={pet.id}
              id={`select-pet-${pet.id}`}
              onClick={() => {
                audioSynth.playBonfireChime();
                onUpdateSettings({ companionType: pet.id });
              }}
              className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                settings.companionType === pet.id
                  ? 'bg-[var(--theme-accent)] text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pet.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
