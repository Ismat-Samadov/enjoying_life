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
        className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-r border-slate-200 p-6 overflow-y-auto z-50 md:relative md:translate-x-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Results count */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Showing <span className="font-bold text-lg text-blue-600">{filteredCount}</span> of {data.length} concepts
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, countries..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* Region filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-700">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all capitalize text-slate-700"
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
          <label className="block text-sm font-medium mb-2 text-slate-700">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all capitalize text-slate-700"
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
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors text-slate-700"
          >
            Reset Filters
          </motion.button>
        )}

        {/* Concepts List */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-sm text-slate-700 uppercase tracking-wide">Concepts ({filteredCount})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.filter((item) => {
              const matchesRegion = selectedRegion === 'all' || item.meta.region === selectedRegion;
              const matchesCategory = selectedCategory === 'all' || item.meta.category === selectedCategory;
              const matchesSearch = searchQuery === '' ||
                item.concept.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.concept.core_theme.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesRegion && matchesCategory && matchesSearch;
            }).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{item.country.flag.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-blue-600 truncate">{item.concept.word}</p>
                    <p className="text-xs text-slate-500 truncate">{item.country.name}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">{item.concept.literal_translation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
