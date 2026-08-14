import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Circle,
  Flame,
  BookOpen,
  Sword,
  Shield,
  Filter,
  Check,
  RotateCcw,
  ExternalLink,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { PLATINUM_ITEMS_DATA, PlatinumItem } from '../data/platinumItemsData';
import { audioSynth } from '../utils/audioSynth';

const STORAGE_KEY = 'ds1_platinum_items_checked_v1';

interface PlatinumItemsViewProps {
  initialCategory?: 'all' | 'pyromancy' | 'miracle' | 'sorcery' | 'weapon' | 'ember';
}

export const PlatinumItemsView: React.FC<PlatinumItemsViewProps> = ({
  initialCategory = 'all',
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pyromancy' | 'miracle' | 'sorcery' | 'weapon' | 'ember'>(initialCategory);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {}
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const isNowChecked = !prev[id];
      if (isNowChecked) {
        audioSynth.playItemCheck();
      }
      return { ...prev, [id]: isNowChecked };
    });
  };

  const markAllInCategory = (category: string, markValue: boolean) => {
    const itemsToUpdate = PLATINUM_ITEMS_DATA.filter(
      (item) => category === 'all' || item.category === category
    );

    setCheckedIds((prev) => {
      const updated = { ...prev };
      itemsToUpdate.forEach((item) => {
        updated[item.id] = markValue;
      });
      return updated;
    });

    if (markValue) {
      audioSynth.playVictoryAchieved();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['var(--theme-accent)', '#f59e0b', '#3b82f6'],
        });
      } catch {}
    }
  };

  const totalItems = PLATINUM_ITEMS_DATA.length;
  const totalCollected = PLATINUM_ITEMS_DATA.filter((item) => checkedIds[item.id]).length;
  const overallPercentage = Math.round((totalCollected / totalItems) * 100);

  // Category counts
  const categoryStats = {
    pyromancy: {
      total: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'pyromancy').length,
      collected: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'pyromancy' && checkedIds[i.id]).length,
    },
    miracle: {
      total: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'miracle').length,
      collected: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'miracle' && checkedIds[i.id]).length,
    },
    sorcery: {
      total: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'sorcery').length,
      collected: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'sorcery' && checkedIds[i.id]).length,
    },
    weapon: {
      total: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'weapon').length,
      collected: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'weapon' && checkedIds[i.id]).length,
    },
    ember: {
      total: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'ember').length,
      collected: PLATINUM_ITEMS_DATA.filter((i) => i.category === 'ember' && checkedIds[i.id]).length,
    },
  };

  // Get available subcategories for current category
  const availableSubCategories = Array.from(
    new Set(
      PLATINUM_ITEMS_DATA.filter((i) => categoryFilter === 'all' || i.category === categoryFilter)
        .map((i) => i.subCategory)
        .filter(Boolean) as string[]
    )
  );

  const filteredItems = PLATINUM_ITEMS_DATA.filter((item) => {
    const isChecked = !!checkedIds[item.id];
    if (showOnlyMissing && isChecked) return false;

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSubCategory = subCategoryFilter === 'all' || item.subCategory === subCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" /> Guia de Itens para 100% Platina
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Dark Souls: Remastered</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight flex items-center gap-2">
              Checklist Completo de Colecionáveis
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Todas as Piromancias, Milagres, Feitiços, Armas Raras de Cavaleiro e Braseiros com localização e ilustrações.
            </p>
          </div>

          {/* Global Progress Gauge */}
          <div className="flex items-center gap-4 bg-[#0d0d0d] px-4 py-2.5 rounded border border-[#262626] min-w-[240px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-400 font-semibold">Total Coletado:</span>
                <span className="text-[var(--theme-accent)] font-bold">
                  {totalCollected} / {totalItems} ({overallPercentage}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-600 via-[var(--theme-accent)] to-yellow-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills with Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#222]">
          <button
            onClick={() => {
              setCategoryFilter('all');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'all'
                ? 'bg-[#222] border-[var(--theme-accent)] text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-zinc-500">Todos os Itens</div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>Geral</span>
              <span className="text-zinc-400">{totalCollected}/{totalItems}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('pyromancy');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'pyromancy'
                ? 'bg-[#2a1308] border-[var(--theme-accent)] text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-[var(--theme-accent)] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" /> Piromancias
            </div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>19 Itens</span>
              <span className="text-amber-400">{categoryStats.pyromancy.collected}/{categoryStats.pyromancy.total}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('miracle');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'miracle'
                ? 'bg-[#261f0a] border-yellow-500 text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-yellow-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Milagres
            </div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>23 Itens</span>
              <span className="text-yellow-400">{categoryStats.miracle.collected}/{categoryStats.miracle.total}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('sorcery');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'sorcery'
                ? 'bg-[#0a182b] border-blue-500 text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5" /> Feitiços
            </div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>24 Itens</span>
              <span className="text-blue-400">{categoryStats.sorcery.collected}/{categoryStats.sorcery.total}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('weapon');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'weapon'
                ? 'bg-[#261515] border-red-500 text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-red-400 flex items-center gap-1">
              <Sword className="w-2.5 h-2.5" /> Armas Raras
            </div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>50 Itens</span>
              <span className="text-red-400">{categoryStats.weapon.collected}/{categoryStats.weapon.total}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('ember');
              setSubCategoryFilter('all');
            }}
            className={`px-3 py-2 rounded text-left border transition-all ${
              categoryFilter === 'ember'
                ? 'bg-[#1e1526] border-purple-500 text-white shadow'
                : 'bg-[#111] border-[#222] text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-purple-400 flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-purple-400" /> Braseiros
            </div>
            <div className="text-xs font-bold font-mono text-white flex items-center justify-between">
              <span>10 Itens</span>
              <span className="text-purple-400">{categoryStats.ember.collected}/{categoryStats.ember.total}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex items-center gap-2 bg-[#0c0c0c] border border-[#2a2a2a] px-3 py-1.5 rounded">
          <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nome em português, inglês, NPC ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-zinc-500 text-xs focus:outline-none w-full font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[10px] text-zinc-500 hover:text-white px-1 font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Subcategory dropdown if available */}
        {availableSubCategories.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-mono whitespace-nowrap">Grupo:</span>
            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="bg-[#0c0c0c] border border-[#2a2a2a] text-zinc-300 text-xs px-2.5 py-1.5 rounded font-mono focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">Todos os Subgrupos ({availableSubCategories.length})</option>
              {availableSubCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filter Toggle for Missing Only */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyMissing(!showOnlyMissing)}
            className={`px-3 py-1.5 rounded text-xs font-mono border flex items-center gap-1.5 transition-all ${
              showOnlyMissing
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-[#111] border-[#2a2a2a] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            {showOnlyMissing ? 'Mostrando Apenas Faltantes' : 'Ver Faltantes'}
          </button>

          <button
            onClick={() => markAllInCategory(categoryFilter, true)}
            className="px-2.5 py-1.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            title="Marcar todos os visíveis como obtidos"
          >
            Marcar Todos
          </button>
          <button
            onClick={() => markAllInCategory(categoryFilter, false)}
            className="px-2.5 py-1.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
            title="Desmarcar todos os visíveis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Platinum Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded border transition-all duration-200 cursor-pointer flex gap-3 select-none ${
                  isChecked
                    ? 'bg-[#141414]/90 border-emerald-800/60 shadow-sm shadow-emerald-950/20'
                    : 'bg-[#111] border-[#242424] hover:border-zinc-700 hover:bg-[#161616]'
                }`}
              >
                {/* Item Thumbnail */}
                <div className="relative flex-shrink-0 w-12 h-12 rounded border border-[#2a2a2a] bg-[#080808] flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-contain transition-all ${
                      isChecked ? 'brightness-105 contrast-105' : 'opacity-80 brightness-90'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {isChecked && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-black rounded p-0.5 shadow font-bold z-10">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className={`text-xs font-bold font-serif leading-snug truncate ${
                      isChecked ? 'text-emerald-400 line-through' : 'text-zinc-200'
                    }`}>
                      {item.name}
                    </h3>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border flex-shrink-0 ${
                      item.category === 'pyromancy' ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/30' :
                      item.category === 'miracle' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-800/30' :
                      item.category === 'sorcery' ? 'bg-blue-950/40 text-blue-400 border-blue-800/30' :
                      item.category === 'weapon' ? 'bg-red-950/40 text-red-400 border-red-800/30' :
                      'bg-purple-950/40 text-purple-400 border-purple-800/30'
                    }`}>
                      {item.subCategory || item.category}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 truncate mb-1">
                    {item.nameEn} {item.cost ? `• ${item.cost}` : ''}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {item.requirements && (
                    <div className="mt-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 truncate">
                      ⚙ {item.requirements}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a] rounded p-6">
          <Info className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400 font-mono">Nenhum item encontrado com os filtros selecionados.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setSubCategoryFilter('all');
              setShowOnlyMissing(false);
            }}
            className="mt-3 px-3 py-1.5 bg-[#222] hover:bg-[#333] text-zinc-300 text-xs font-mono rounded border border-zinc-700"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
