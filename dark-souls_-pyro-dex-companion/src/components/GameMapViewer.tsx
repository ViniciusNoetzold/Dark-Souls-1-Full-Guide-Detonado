import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MarkerType = 'bonfire' | 'boss' | 'item' | 'npc';

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  title: string;
  type: MarkerType;
  description?: string;
}

interface GameMapViewerProps {
  imageUrl: string;
  width: number;
  height: number;
  markers: MapMarker[];
}

// Hook para centralizar o mapa quando a imagem mudar
const MapController = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
    map.setZoom(1);
  }, [bounds, map]);
  return null;
};

const GameMapViewer: React.FC<GameMapViewerProps> = ({ imageUrl, width, height, markers }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // O CRS.Simple mapeia x e y diretamente para a imagem.
  // Mapeamos os bounds fixos para [0, 0] e [1000, 1000] conforme requisitado
  const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

  // Criação de Ícones Customizados (HTML) para usar com o TailwindCSS
  const createCustomIcon = (type: MarkerType) => {
    let emoji = '📍';
    let bgColor = 'bg-zinc-800 border-zinc-500';
    
    if (type === 'bonfire') { emoji = '🔥'; bgColor = 'bg-orange-900 border-orange-500'; }
    if (type === 'boss') { emoji = '💀'; bgColor = 'bg-red-900 border-red-500'; }
    if (type === 'item') { emoji = '💎'; bgColor = 'bg-blue-900 border-blue-500'; }
    if (type === 'npc') { emoji = '💬'; bgColor = 'bg-emerald-900 border-emerald-500'; }

    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,0,0,0.8)] ${bgColor} cursor-pointer hover:scale-110 transition-transform">${emoji}</div>`,
      className: 'custom-leaflet-icon', // Remove os estilos padrão do Leaflet
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) return <div className="h-[600px] w-full bg-[#111] animate-pulse rounded-xl border border-[#333] flex items-center justify-center text-zinc-500">Carregando Mapa...</div>;

  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-[#333] relative z-10">
      <MapContainer 
        crs={L.CRS.Simple} 
        bounds={bounds} 
        maxZoom={4}
        minZoom={-2}
        scrollWheelZoom={true}
        className="w-full"
        style={{ height: '600px', width: '100%', backgroundColor: '#111' }}
      >
        <MapController bounds={bounds} />
        
        <ImageOverlay
          url={imageUrl}
          bounds={bounds}
          zIndex={1}
        />

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.y, marker.x]} // Leaflet usa [y, x] para CRS.Simple (LatLng)
            icon={createCustomIcon(marker.type)}
          >
            <Popup className="ds-popup">
              <div className="bg-[#151515] border border-[var(--theme-accent-muted)]/40 p-3 rounded-lg shadow-xl m-[-14px]">
                <h3 className="text-white font-serif font-bold text-sm uppercase flex items-center gap-2 mb-1">
                  {marker.type === 'bonfire' && '🔥 '}
                  {marker.type === 'boss' && '💀 '}
                  {marker.type === 'item' && '💎 '}
                  {marker.title}
                </h3>
                {marker.description && (
                  <p className="text-zinc-400 text-xs font-mono">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Adicionar um estilo CSS injetado para limpar os wrappers padrões do Leaflet no Popup */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #151515 !important;
          border-left: 1px solid rgba(217,119,6,0.4) !important;
          border-top: 1px solid rgba(217,119,6,0.4) !important;
        }
        .custom-leaflet-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default GameMapViewer;

/* =====================================================================
  GUIA DE USO EM NEXT.JS (SSR: FALSE)
  
  Como bibliotecas de mapa interagem com a API "window" e geram erros
  no servidor (Hydration Errors), se você for mover este componente 
  para o Next.js, importe-o na sua View principal usando 'next/dynamic':

  import dynamic from 'next/dynamic';

  const GameMapViewer = dynamic(
    () => import('@/components/GameMapViewer'), 
    { ssr: false, loading: () => <p>Carregando mapa...</p> }
  );

  export default function MyPage() {
    return <GameMapViewer imageUrl="/maps/..." width={1000} height={1000} markers={[]} />
  }
===================================================================== */
