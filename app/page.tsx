'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Globe } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';
import culturalData from '@/data/data.json';
import { CulturalData } from '@/types/data';

// Dynamic import for map to avoid SSR issues with Leaflet
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-blue-600 font-semibold">Loading world map...</p>
      </div>
    </div>
  ),
});

const data: CulturalData[] = culturalData as CulturalData[];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="relative z-30 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 border-b border-blue-200 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Globe className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                Enjoying Life
              </h1>
              <p className="text-sm text-blue-100 hidden sm:block">
                Cultural Concepts Around the World
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
              {data.length} Concepts
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <FilterSidebar
          data={data}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Map container */}
        <div className="flex-1 relative">
          <WorldMap
            data={data}
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-30 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
          <p>
            Discover how different cultures express joy, balance, and the art of living well
          </p>
          <p className="text-xs text-slate-500">
            Built with Next.js & Leaflet
          </p>
        </div>
      </footer>
    </div>
  );
}
