import React, { useState } from 'react';
import { BuyingGuide } from '../types';
import { BookOpen, Tag, Calendar, ChevronRight, CheckCircle, Search } from 'lucide-react';

interface BuyingGuidesViewProps {
  guides: BuyingGuide[];
}

export default function BuyingGuidesView({ guides }: BuyingGuidesViewProps) {
  const [selectedGuide, setSelectedGuide] = useState<BuyingGuide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 p-8 md:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Expert Handbooks</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Unbiased Purchasing Manuals</h1>
          <p className="text-sm text-indigo-200 font-sans leading-relaxed">
            Written by engineering specialists. No marketing jargon. No affiliate pressure. Only honest, verified specs guides to protect your wallet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Guides List (Left) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search guides, tags, products (e.g., Laptops, TV)..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedGuide?.id === guide.id
                    ? 'border-indigo-500 bg-indigo-50/20 shadow'
                    : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase font-mono mb-2">
                  <span>{guide.category}</span>
                  <span>•</span>
                  <span className="text-indigo-600">Expert Guide</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {guide.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {guide.tags.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-[9px] font-medium px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Guide Reader (Right) */}
        <div className="lg:col-span-6">
          {selectedGuide ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {selectedGuide.category} Guide
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2 leading-tight">{selectedGuide.title}</h2>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-4 font-sans leading-relaxed whitespace-pre-line border-l-2 border-indigo-500 pl-4 bg-slate-50/50 p-4 rounded-xl">
                {selectedGuide.content}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Published in July 2026</span>
                <button
                  onClick={() => {
                    const chatBtn = document.getElementById('ai-chat-tab-button');
                    if (chatBtn) chatBtn.click();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Ask AI For Alternatives
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-sm">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <span>Select any expert buying guide on the left to read full technical parameters and recommended choices.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
