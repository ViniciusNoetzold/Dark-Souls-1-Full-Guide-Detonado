import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield, BookOpen } from 'lucide-react';
import { buildReferenceMarkdown, checklistMarkdown } from '../data/taticaDS';

export function TaticaDSView() {
  const [activeTab, setActiveTab] = useState<'build' | 'checklist'>('build');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-zinc-300">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#111] p-4 border-b border-[#222]">
        <div className="w-12 h-12 bg-zinc-900 border border-[var(--theme-accent)]/50 rounded flex items-center justify-center shadow-[0_0_15px_rgba(255,78,0,0.2)]">
          <Shield className="w-6 h-6 text-[var(--theme-accent)]" />
        </div>
        <div>
          <h1 className="text-xl font-serif text-white uppercase tracking-wider">
            Build & Checklist
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Menção Honrosa: Evil Gilbertinho & Tática DS
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0f0f0f] border-b border-[#222]">
        <button
          onClick={() => setActiveTab('build')}
          className={`flex-1 py-3 text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'build'
              ? 'bg-[#1a1a1a] text-[var(--theme-accent)] border-b-2 border-[var(--theme-accent)]'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#151515]'
          }`}
        >
          <Shield className="w-4 h-4" />
          Build Reference
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-3 text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-[#1a1a1a] text-[var(--theme-accent)] border-b-2 border-[var(--theme-accent)]'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#151515]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Checklist 100% Master
        </button>
      </div>

      {/* Markdown Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
        <div className="max-w-4xl mx-auto markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {activeTab === 'build' ? buildReferenceMarkdown : checklistMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
