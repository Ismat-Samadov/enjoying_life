'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

  // Add offset to markers with same coordinates
  const getMarkerPosition = (item: CulturalData, index: number): [number, number] => {
    const locationKey = `${item.country.location.latitude},${item.country.location.longitude}`;

    // Count how many items share this location
    const itemsAtLocation = filteredData.filter(d =>
      d.country.location.latitude === item.country.location.latitude &&
      d.country.location.longitude === item.country.location.longitude
    );

    if (itemsAtLocation.length === 1) {
      return [item.country.location.latitude, item.country.location.longitude];
    }

    // Find this item's index among items at the same location
    const localIndex = itemsAtLocation.findIndex(d => d === item);

    // Create circular offset pattern
    const angle = (localIndex / itemsAtLocation.length) * 2 * Math.PI;
    const radius = 0.5; // degrees offset
    const latOffset = Math.cos(angle) * radius;
    const lonOffset = Math.sin(angle) * radius;

    return [
      item.country.location.latitude + latOffset,
      item.country.location.longitude + lonOffset
    ];
  };

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-50">
        <div className="text-xl text-blue-600 animate-pulse font-semibold">Loading world map...</div>
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
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {filteredData.map((item, index) => (
          <Marker
            key={`${item.country.iso2}-${item.concept.word}-${index}`}
            position={getMarkerPosition(item, index)}
            icon={createCustomIcon(item.country.flag.emoji)}
            eventHandlers={{
              click: () => setSelectedConcept(item),
            }}
          />
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
