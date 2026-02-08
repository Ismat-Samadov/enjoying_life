'use client';

import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { CulturalData } from '@/types/data';

interface FilterSidebarProps {
  data: CulturalData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  data,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const regions = ['all', ...Array.from(new Set(data.map(item => item.meta.region)))];
  const categories = ['all', ...Array.from(new Set(data.map(item => item.meta.category)))];

  const filteredCount = data.filter((item) => {
    const matchesRegion = selectedRegion === 'all' || item.meta.region === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || item.meta.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.concept.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.core_theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesCategory && matchesSearch;
  }).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-slate-800/95 backdrop-blur-md border-r border-slate-700 p-6 overflow-y-auto z-50 md:relative md:translate-x-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results count */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            Showing <span className="font-bold text-lg">{filteredCount}</span> of {data.length} concepts
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, countries..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Region filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors capitalize"
          >
            {regions.map((region) => (
              <option key={region} value={region} className="capitalize">
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors capitalize"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="capitalize">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {(searchQuery || selectedRegion !== 'all' || selectedCategory !== 'all') && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setSelectedCategory('all');
            }}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            Reset Filters
          </motion.button>
        )}

        {/* Info section */}
        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 className="font-semibold mb-2 text-sm">About</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore {data.length} cultural concepts from around the world that capture the essence of enjoying life.
            Click on any marker to learn more about each unique word.
          </p>
        </div>
      </motion.aside>
    </>
  );
}
