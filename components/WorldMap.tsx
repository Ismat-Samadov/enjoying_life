'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CulturalData } from '@/types/data';
import ConceptCard from './ConceptCard';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WorldMapProps {
  data: CulturalData[];
  selectedRegion: string;
  selectedCategory: string;
  searchQuery: string;
}

const createCustomIcon = (emoji: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div class="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white marker-pulse">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
};

export default function WorldMap({ data, selectedRegion, selectedCategory, searchQuery }: WorldMapProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<CulturalData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = data.filter((item) => {
    const matchesRegion = selectedRegion === 'all' || item.meta.region === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || item.meta.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.concept.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.core_theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesCategory && matchesSearch;
  });

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="text-xl text-blue-400 animate-pulse">Loading world map...</div>
      </div>
    );
  }

  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        className="w-full h-full z-0"
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {filteredData.map((item, index) => (
          <Marker
            key={`${item.country.iso2}-${index}`}
            position={[item.country.location.latitude, item.country.location.longitude]}
            icon={createCustomIcon(item.country.flag.emoji)}
            eventHandlers={{
              click: () => setSelectedConcept(item),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{item.country.flag.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{item.country.name}</h3>
                    <p className="text-xs text-slate-400">{item.country.capital}</p>
                  </div>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2">
                  <p className="text-2xl font-bold text-blue-400 mb-1">{item.concept.word}</p>
                  <p className="text-sm text-slate-300 italic mb-2">{item.concept.literal_translation}</p>
                  <p className="text-sm">{item.concept.core_theme}</p>
                </div>
                <button
                  onClick={() => setSelectedConcept(item)}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Learn More
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedConcept && (
        <ConceptCard
          data={selectedConcept}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </>
  );
}
