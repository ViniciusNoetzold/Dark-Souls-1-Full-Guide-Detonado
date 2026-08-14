import React, { useState } from 'react';
import { Map as MapIcon, ChevronRight } from 'lucide-react';
import GameMapViewer, { MapMarker } from './GameMapViewer';

const AVAILABLE_MAPS = [
  { id: 'northern_asylum', name: 'Northern Undead Asylum', file: 'preview_Northern_AsylumMapV1.jpg', w: 1200, h: 800 },
  { id: 'firelink', name: 'Firelink Shrine', file: 'preview_FirelinkShrineMap.jpg', w: 1200, h: 800 },
  { id: 'undead_burg', name: 'Undead Burg', file: 'preview_Undead_BurgMapV1.jpg', w: 1400, h: 900 },
  { id: 'undead_parish', name: 'Undead Parish', file: 'preview_Undead_Parish_Map.jpg', w: 1400, h: 900 },
  { id: 'depths', name: 'The Depths', file: 'preview_DepthsMap.png', w: 1200, h: 1000 },
  { id: 'blighttown', name: 'Blighttown (Swamp)', file: 'preview_9_Blighttown_Swamp.png', w: 1400, h: 900 },
  { id: 'sens_fortress', name: 'Sen\'s Fortress', file: 'preview_Sen\'s_Fortress.png', w: 1200, h: 1200 },
  { id: 'anor_londo', name: 'Anor Londo', file: 'preview_12_Anor_Londo.jpg', w: 1600, h: 1000 },
  { id: 'anor_londo_castle', name: 'Anor Londo Castle', file: 'preview_13_Anor_Londo_Castle.jpg', w: 1600, h: 1000 },
  { id: 'painted_world', name: 'Painted World of Ariamis', file: 'preview_14_Painted_World.jpg', w: 1400, h: 900 },
  { id: 'catacombs', name: 'The Catacombs', file: 'preview_23_The_Catacombs_CORRECTED.jpg', w: 1200, h: 1000 },
  { id: 'tomb_giants', name: 'Tomb of the Giants', file: 'preview_24_Tomb_of_the_Giants.jpg', w: 1200, h: 1000 },
  { id: 'new_londo', name: 'New Londo Ruins', file: 'preview_NewLondo_map.jpg', w: 1200, h: 1000 },
  { id: 'dukes_archives', name: 'Duke\'s Archives', file: 'preview_TDA_Main_Hall.png', w: 1200, h: 1000 },
  { id: 'crystal_cave', name: 'Crystal Cave', file: 'preview_16_Crystal_Cave.jpg', w: 1000, h: 800 },
  { id: 'demon_ruins', name: 'Demon Ruins', file: 'preview_Demon_Ruins29.jpg', w: 1200, h: 1000 },
  { id: 'lost_izalith', name: 'Lost Izalith', file: 'preview_20_Lost_Izalith.jpg', w: 1400, h: 1000 },
  { id: 'darkroot_garden', name: 'Darkroot Garden', file: 'preview_Gardin.jpg', w: 1200, h: 1000 },
  { id: 'darkroot_basin', name: 'Darkroot Basin', file: 'preview_Basin.jpg', w: 1000, h: 800 },
  { id: 'great_hollow', name: 'The Great Hollow', file: 'preview_17_Great_Hollow.jpg', w: 800, h: 1200 },
  { id: 'ash_lake', name: 'Ash Lake', file: 'preview_18_Ash_Lake.jpg', w: 1000, h: 1400 },
];

// Marcadores de exemplo para o Northern Asylum
const ASYLUM_MARKERS: MapMarker[] = [
  { id: 'bonfire_1', x: 600, y: 400, type: 'bonfire', title: 'Asylum Courtyard', description: 'A primeira fogueira do jogo.' },
  { id: 'boss_1', x: 600, y: 250, type: 'boss', title: 'Asylum Demon', description: 'Mergulhe (Plunging Attack) lá de cima!' },
  { id: 'npc_1', x: 800, y: 550, type: 'npc', title: 'Oscar of Astora', description: 'Ele te dará o Estus Flask.' },
  { id: 'item_1', x: 300, y: 600, type: 'item', title: 'Estus Flask', description: 'Seu melhor amigo.' }
];

export const MapExplorerView: React.FC = () => {
  const [activeMapId, setActiveMapId] = useState('northern_asylum');

  const activeMap = AVAILABLE_MAPS.find(m => m.id === activeMapId) || AVAILABLE_MAPS[0];

  // Passando marcadores fake (você pode carregar JSONs reais de acordo com a aba selecionada no futuro)
  const currentMarkers = activeMapId === 'northern_asylum' ? ASYLUM_MARKERS : [];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0a0a0a] text-zinc-300">
      
      {/* Sidebar - Lista de Mapas */}
      <div className="w-full lg:w-72 bg-[#111] border-r border-[#222] flex flex-col h-1/3 lg:h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-[#222] bg-[#151515]">
          <h2 className="text-sm font-bold uppercase text-white font-serif flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-[var(--theme-accent-muted)]" /> Arquivo de Mapas
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Explorador de Topografia</p>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {AVAILABLE_MAPS.map((map) => {
            const isActive = map.id === activeMapId;
            return (
              <button
                key={map.id}
                onClick={() => setActiveMapId(map.id)}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded flex items-center justify-between transition-colors ${
                  isActive 
                    ? 'bg-[var(--theme-accent-muted)]/10 text-[var(--theme-accent-muted)] border border-[var(--theme-accent-muted)]/30 font-bold' 
                    : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200 border border-transparent'
                }`}
              >
                {map.name}
                {isActive && <ChevronRight className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Mapa */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col h-[500px] lg:h-full">
        <div className="mb-4">
          <h1 className="text-xl font-serif text-white uppercase tracking-wider">{activeMap.name}</h1>
          <p className="text-xs text-zinc-400 font-mono">Arraste para mover, role para dar zoom.</p>
        </div>

        {/* O container deve ter flex-1 para preencher o espaço restante */}
        <div className="flex-1 w-full rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#333] min-h-[300px]">
          {/* Usamos key={activeMap.id} para forçar o React Leaflet a recriar o container do zero quando trocamos o mapa */}
          <GameMapViewer
            key={activeMap.id}
            imageUrl={`/maps/${activeMap.file}`}
            width={activeMap.w}
            height={activeMap.h}
            markers={currentMarkers}
          />
        </div>
      </div>

    </div>
  );
};
