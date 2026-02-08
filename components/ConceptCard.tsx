'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CulturalData } from '@/types/data';
import { X, MapPin, Globe, Tag, Sparkles } from 'lucide-react';

interface ConceptCardProps {
  data: CulturalData;
  onClose: () => void;
}

export default function ConceptCard({ data, onClose }: ConceptCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with flag and country */}
          <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{data.country.flag.emoji}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{data.country.name}</h2>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4" />
                  <span>{data.country.capital}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 space-y-6">
            {/* Concept word */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  {data.concept.original_language}
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                {data.concept.word}
              </h3>
              <p className="text-lg text-slate-300 italic">
                &ldquo;{data.concept.literal_translation}&rdquo;
              </p>
            </div>

            {/* Core theme */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-xl font-semibold text-blue-300">{data.concept.core_theme}</p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Description
              </h4>
              <p className="text-slate-300 leading-relaxed">{data.concept.description}</p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-400" />
                Related Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.concept.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Region</p>
                <p className="font-semibold">{data.meta.region}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Category</p>
                <p className="font-semibold">{data.meta.category}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 mb-1">Cultural Domains</p>
                <p className="font-semibold">{data.meta.cultural_domain.join(', ')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
