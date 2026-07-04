import React, { useState } from 'react';
import { BlogPost } from '../types';
import { FileText, Calendar, ArrowLeft, User, Sparkles, BookOpen } from 'lucide-react';

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      {!selectedPost && (
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-black p-8 md:p-12 text-white border border-slate-850 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">TheDeals24 Blog</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Smart Shopping Education</h1>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              We investigate fine print, check cashback policies, analyze holiday sale dates, and help you shop like a master editor.
            </p>
          </div>
        </div>
      )}

      {selectedPost ? (
        /* Blog Reader view */
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-950 transition-colors font-semibold text-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog List
          </button>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> By {selectedPost.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Published {selectedPost.date}</span>
            </div>
          </div>

          <div className="bg-slate-100 h-64 rounded-2xl flex items-center justify-center text-8xl">
            {selectedPost.imageUrl}
          </div>

          <div className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line space-y-4 pt-4 border-t border-slate-100">
            {selectedPost.content}
          </div>
        </div>
      ) : (
        /* Blog grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="p-6 bg-slate-50 flex items-center justify-center text-7xl h-44 group-hover:scale-105 transition-transform duration-500">
                {post.imageUrl}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase font-mono">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <button
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-50 w-fit"
                >
                  Read Full Article <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper icons
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
