import React, { useState } from 'react';
import { 
  Shield, Sword, Aperture, Shirt, User, Zap, Weight, 
  Activity, Flame, Droplets, Skull, Biohazard, Eye, ShieldAlert, PackageOpen, Sparkles
} from 'lucide-react';

import { 
  WEAPONS, SHIELDS, HEAD_ARMOR, CHEST_ARMOR, HAND_ARMOR, LEG_ARMOR, 
  RINGS, SPELLS, QUICK_ITEMS, SNAPSHOTS, AppStats
} from '../data/ds1Items';

import {
  calculateTotalAR, calculateMaxEquipLoad, calculateHP, calculateStamina,
  calculateSoulLevel, calculateAttunementSlots, calculateItemDiscovery,
  calculatePoise, calculateDefenses
} from '../utils/ds1Math';

export const BuildPlannerView: React.FC = () => {
  const [activeSnapshot, setActiveSnapshot] = useState('ep20');
  const [stats, setStats] = useState<AppStats>(SNAPSHOTS['ep20'].stats);
  const [equipment, setEquipment] = useState(SNAPSHOTS['ep20'].equipment);

  const handleSnapshotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setActiveSnapshot(key);
    setStats(SNAPSHOTS[key].stats);
    setEquipment(SNAPSHOTS[key].equipment);
  };

  const updateStat = (stat: keyof AppStats, delta: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: Math.max(stat === 'humanity' ? 0 : 1, Math.min(99, prev[stat] + delta))
    }));
  };

  const updateEquipment = (slot: string, id: string) => {
    setEquipment((prev: any) => ({ ...prev, [slot]: id }));
  };

  const updateArrayEquipment = (slot: 'spells' | 'items', index: number, id: string) => {
    setEquipment((prev: any) => {
      const newArray = [...prev[slot]];
      newArray[index] = id;
      return { ...prev, [slot]: newArray };
    });
  };

  // --- Calculations ---
  const soulLevel = calculateSoulLevel(stats);
  const hp = calculateHP(stats.vit, equipment.ring1, equipment.ring2);
  const stamina = calculateStamina(stats.end, equipment.ring1, equipment.ring2);
  const maxEquipLoad = calculateMaxEquipLoad(stats.end, equipment.ring1, equipment.ring2);
  const attSlotsCount = calculateAttunementSlots(stats.att);
  const itemDiscovery = calculateItemDiscovery(stats.humanity, equipment.ring1, equipment.ring2);

  // Equip Load
  const getWeight = (collection: any[], id: string) => collection.find(i => i.id === id)?.weight || 0;
  const currentEquipLoad = 
    getWeight(WEAPONS, equipment.rh1) + getWeight(WEAPONS, equipment.rh2) +
    getWeight(SHIELDS, equipment.lh1) + getWeight(SHIELDS, equipment.lh2) +
    getWeight(HEAD_ARMOR, equipment.head) + getWeight(CHEST_ARMOR, equipment.chest) +
    getWeight(HAND_ARMOR, equipment.hands) + getWeight(LEG_ARMOR, equipment.legs) +
    getWeight(RINGS, equipment.ring1) + getWeight(RINGS, equipment.ring2);

  const equipRatio = currentEquipLoad / maxEquipLoad;
  let rollType = 'Fast Roll'; let rollColor = 'text-emerald-400';
  if (equipRatio > 0.25) { rollType = 'Mid Roll'; rollColor = 'text-amber-400'; }
  if (equipRatio > 0.50) { rollType = 'Fat Roll'; rollColor = 'text-red-500'; }
  if (equipRatio > 1.0) { rollType = 'Overencumbered'; rollColor = 'text-red-700'; }

  // AR & Defenses
  const rh1Weapon = WEAPONS.find(w => w.id === equipment.rh1);
  const arSplit = calculateTotalAR(rh1Weapon, stats.str, stats.dex, stats.humanity);

  const headA = HEAD_ARMOR.find(a => a.id === equipment.head);
  const chestA = CHEST_ARMOR.find(a => a.id === equipment.chest);
  const handsA = HAND_ARMOR.find(a => a.id === equipment.hands);
  const legsA = LEG_ARMOR.find(a => a.id === equipment.legs);
  
  const poise = calculatePoise([headA, chestA, handsA, legsA], equipment.ring1, equipment.ring2);
  const defs = calculateDefenses([headA, chestA, handsA, legsA], equipment.ring1, equipment.ring2);

  // --- Render Helpers ---
  const StatRow = ({ label, statKey, isSoftCapped }: { label: string, statKey: keyof AppStats, isSoftCapped?: boolean }) => (
    <div className="flex items-center justify-between bg-[#151515] p-2 rounded border border-[#2a2a2a]">
      <span className="text-xs font-mono text-zinc-400 uppercase w-28 flex items-center gap-1">
        {label} 
        {isSoftCapped && stats[statKey] >= 40 && <span title="Soft Cap Alcançado"><Zap className="w-3 h-3 text-amber-500" /></span>}
      </span>
      <div className="flex items-center gap-3">
        <button onClick={() => updateStat(statKey, -1)} className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] flex items-center justify-center text-zinc-400 border border-[#444]">-</button>
        <span className={`text-sm font-bold font-mono w-6 text-center ${stats[statKey] >= (isSoftCapped ? 40 : 99) ? 'text-[var(--theme-accent)]' : 'text-white'}`}>{stats[statKey]}</span>
        <button onClick={() => updateStat(statKey, 1)} className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] flex items-center justify-center text-zinc-400 border border-[#444]">+</button>
      </div>
    </div>
  );

  const EquipSelect = ({ label, slot, options, icon: Icon, isArray, arrIndex }: any) => {
    const val = isArray ? equipment[slot][arrIndex] : equipment[slot];
    return (
      <div className="flex flex-col gap-1 w-full flex-1 min-w-[120px]">
        {label && (
          <label className="text-[9px] uppercase font-mono text-zinc-500 flex items-center gap-1">
            <Icon className="w-3 h-3 text-[var(--theme-accent-muted)]" /> {label}
          </label>
        )}
        <select 
          value={val || 'none'}
          onChange={(e) => isArray ? updateArrayEquipment(slot, arrIndex, e.target.value) : updateEquipment(slot, e.target.value)}
          className="bg-[#1c1c1c] border border-[#333] text-zinc-200 text-xs font-mono rounded p-1.5 focus:outline-none focus:border-[var(--theme-accent-muted)] truncate w-full"
        >
          {options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-zinc-300 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111] p-4 border-b border-[#222]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1c0c05] border border-[var(--theme-accent-muted)]/50 rounded flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            <User className="w-6 h-6 text-[var(--theme-accent-muted)]" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-white uppercase tracking-wider">Build & Status</h1>
            <p className="text-xs text-zinc-400 font-mono">Simulador de Escalonamento e Equipamentos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-[#151515] p-2 rounded border border-[#333]">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Progressão:</span>
          <select 
            value={activeSnapshot}
            onChange={handleSnapshotChange}
            className="bg-[#0a0a0a] border border-[#444] text-[var(--theme-accent-muted)] font-bold text-xs uppercase font-mono rounded px-3 py-1.5 focus:outline-none focus:border-[var(--theme-accent-muted)]"
          >
            {Object.entries(SNAPSHOTS).map(([key, snap]) => <option key={key} value={key}>{snap.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Stats */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#111] border border-[#222] rounded p-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase text-white mb-4 border-b border-[#333] pb-2 flex items-center justify-between">
              Atributos <span className="text-[var(--theme-accent-muted)] bg-[var(--theme-accent-muted)]/10 px-2 py-0.5 rounded border border-[var(--theme-accent-muted)]/30 font-mono">SL {soulLevel}</span>
            </h2>
            <div className="space-y-2 mb-6">
              <StatRow label="Vitality" statKey="vit" />
              <StatRow label="Attunement" statKey="att" />
              <StatRow label="Endurance" statKey="end" />
              <StatRow label="Strength" statKey="str" isSoftCapped />
              <StatRow label="Dexterity" statKey="dex" isSoftCapped />
              <StatRow label="Resistance" statKey="res" />
              <StatRow label="Intelligence" statKey="int" />
              <StatRow label="Faith" statKey="fth" />
            </div>

            <h2 className="text-sm font-bold uppercase text-white mb-4 border-b border-[#333] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" /> Status Ativo
            </h2>
            <div className="flex items-center justify-between bg-[#151515] p-2 rounded border border-[#2a2a2a] shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
              <span className="text-xs font-mono text-zinc-300 uppercase w-28 flex items-center gap-1">
                Soft Humanity
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => updateStat('humanity', -1)} className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] flex items-center justify-center text-zinc-400 border border-[#444]">-</button>
                <span className={`text-lg font-bold font-serif w-8 text-center drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white`}>
                  {String(stats.humanity).padStart(2, '0')}
                </span>
                <button onClick={() => updateStat('humanity', 1)} className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] flex items-center justify-center text-zinc-400 border border-[#444]">+</button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 font-mono leading-tight">Humanidade aumenta o Item Discovery e o dano de armas do Chaos (Soft Cap 10).</p>
          </div>
        </div>

        {/* Center Panel: Equipment */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 sm:p-6 w-full shadow-2xl relative flex flex-col items-center">
            
            {/* Top Row: Head & Chest */}
            <div className="flex gap-4 w-full justify-center mb-4">
              <EquipSelect label="Head" slot="head" options={HEAD_ARMOR} icon={Shirt} />
              <EquipSelect label="Chest" slot="chest" options={CHEST_ARMOR} icon={Shirt} />
            </div>

            {/* Middle Row: Hands, Dummy, Legs */}
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex flex-col gap-4 w-1/3">
                <EquipSelect label="Right Hand 1" slot="rh1" options={WEAPONS} icon={Sword} />
                <EquipSelect label="Right Hand 2" slot="rh2" options={WEAPONS} icon={Sword} />
                <EquipSelect label="Hands" slot="hands" options={HAND_ARMOR} icon={Shirt} />
              </div>
              
              <div className="w-1/3 flex justify-center">
                <div className="w-24 h-48 border-2 border-dashed border-[#333] rounded-t-full flex items-center justify-center opacity-30 bg-[#151515]">
                  <User className="w-12 h-12 text-zinc-500" />
                </div>
              </div>

              <div className="flex flex-col gap-4 w-1/3">
                <EquipSelect label="Left Hand 1" slot="lh1" options={SHIELDS} icon={Shield} />
                <EquipSelect label="Left Hand 2" slot="lh2" options={SHIELDS} icon={Shield} />
                <EquipSelect label="Legs" slot="legs" options={LEG_ARMOR} icon={Shirt} />
              </div>
            </div>

            {/* Rings */}
            <div className="flex gap-4 w-full justify-center mb-8 border-b border-[#222] pb-6">
              <EquipSelect label="Ring 1" slot="ring1" options={RINGS} icon={Aperture} />
              <EquipSelect label="Ring 2" slot="ring2" options={RINGS} icon={Aperture} />
            </div>

            {/* Attunement Slots */}
            <div className="w-full">
              <h3 className="text-[10px] uppercase font-mono text-zinc-400 mb-2 flex items-center gap-1 border-b border-[#222] pb-1">
                <Flame className="w-3 h-3 text-[var(--theme-accent-muted)]" /> Attunement Slots ({attSlotsCount})
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: Math.max(1, attSlotsCount) }).map((_, idx) => (
                  <div key={idx} className={`flex-1 min-w-[120px] ${idx >= attSlotsCount ? 'opacity-30 pointer-events-none' : ''}`}>
                    <EquipSelect slot="spells" isArray arrIndex={idx} options={SPELLS} icon={null} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Items */}
            <div className="w-full mt-6">
              <h3 className="text-[10px] uppercase font-mono text-zinc-400 mb-2 flex items-center gap-1 border-b border-[#222] pb-1">
                <PackageOpen className="w-3 h-3 text-zinc-400" /> Quick Items
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex-1 min-w-[90px]">
                    <EquipSelect slot="items" isArray arrIndex={idx} options={QUICK_ITEMS} icon={null} />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#111] border border-[#222] rounded p-4 shadow-xl flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase text-white border-b border-[#333] pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--theme-accent-muted)]" /> Painel de Resultados
            </h2>
            
            {/* Vitals */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>HP</span><span className="text-red-400 font-bold">{hp} / {hp}</span>
                </div>
                <div className="h-1.5 w-full bg-[#222] rounded overflow-hidden"><div className="h-full bg-red-600/80 w-full" /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Stamina</span><span className="text-emerald-400 font-bold">{stamina}</span>
                </div>
                <div className="h-1.5 w-full bg-[#222] rounded overflow-hidden"><div className="h-full bg-emerald-600/80 w-full" /></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 bg-[#181818] p-2 rounded border border-[#2a2a2a]">
                <span>Equip Load</span>
                <span className="font-bold flex items-center gap-2">
                  {currentEquipLoad.toFixed(1)} / {maxEquipLoad.toFixed(1)}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border border-[#444] bg-black/50 uppercase ${rollColor}`}>{rollType}</span>
                </span>
              </div>
            </div>

            {/* Split AR Output */}
            <div className="p-4 bg-[#1a0f0a] border border-[var(--theme-accent-muted)]/30 rounded shadow-[inset_0_0_15px_rgba(217,119,6,0.1)]">
              <h3 className="text-xs uppercase font-mono text-zinc-500 mb-2 border-b border-[var(--theme-accent-muted)]/20 pb-1">Total AR (Right Hand 1)</h3>
              <div className="text-3xl font-serif text-[var(--theme-accent-muted)] font-bold mb-3">
                {arSplit.total} <span className="text-sm text-zinc-400 font-sans font-normal">AR</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded"><span className="text-zinc-400 flex items-center gap-1"><Sword className="w-3 h-3"/> Phys</span> <span>{arSplit.phys}</span></div>
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded"><span className="text-zinc-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Mag</span> <span>{arSplit.mag}</span></div>
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded"><span className="text-zinc-400 flex items-center gap-1"><Flame className="w-3 h-3"/> Fire</span> <span>{arSplit.fire}</span></div>
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded"><span className="text-zinc-400 flex items-center gap-1"><Zap className="w-3 h-3"/> Light</span> <span>{arSplit.light}</span></div>
              </div>
            </div>

            {/* Defenses & Resistances */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-mono text-zinc-500 border-b border-[#333] pb-1">Defesas & Stats</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono">
                <div className="flex justify-between"><span className="text-zinc-400">Poise</span> <span className="text-white font-bold">{poise}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Eye className="w-3 h-3"/> Item Disc</span> <span className="text-amber-400 font-bold">{itemDiscovery}</span></div>
                
                <div className="col-span-2 my-1 border-t border-[#222]"></div>
                
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Phys</span> <span>{defs.phys}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Mag</span> <span>{defs.mag}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Flame className="w-3 h-3"/> Fire</span> <span>{defs.fire}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Zap className="w-3 h-3"/> Light</span> <span>{defs.light}</span></div>
                
                <div className="col-span-2 my-1 border-t border-[#222]"></div>

                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Droplets className="w-3 h-3 text-red-500"/> Bleed</span> <span>{defs.bleed}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Biohazard className="w-3 h-3 text-purple-500"/> Poison</span> <span>{defs.poison}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400 flex items-center gap-1"><Skull className="w-3 h-3 text-zinc-500"/> Curse</span> <span>{defs.curse}</span></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
