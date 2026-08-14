import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pin, 
  Trash2, 
  Plus, 
  Search, 
  Flame, 
  Swords, 
  Sparkles, 
  Clock, 
  Check,
  Tag
} from 'lucide-react';
import { QuickNote } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface QuickNotesViewProps {
  notes: QuickNote[];
  onAddNote: (text: string, category: QuickNote['category']) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const QuickNotesView: React.FC<QuickNotesViewProps> = ({
  notes,
  onAddNote,
  onTogglePin,
  onDeleteNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [category, setCategory] = useState<QuickNote['category']>('general');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    audioSynth.playItemCheck();
    onAddNote(newNoteText.trim(), category);
    setNewNoteText('');
  };

  const getCategoryColor = (cat: QuickNote['category']) => {
    switch (cat) {
      case 'build':
        return 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/30';
      case 'boss':
        return 'bg-red-950/60 text-red-300 border-red-800/40';
      case 'npc':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 'farming':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/40';
      default:
        return 'bg-[#222] text-zinc-300 border-[#333]';
    }
  };

  const filteredNotes = notes
    .filter((n) => filterCategory === 'all' || n.category === filterCategory)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="space-y-4">
      {/* Add New Note Card */}
      <form
        onSubmit={handleCreateNote}
        className="bg-[#151515] border border-[#2a2a2a] rounded p-4 shadow-lg space-y-3"
      >
        <div className="flex items-center justify-between border-b border-[#222] pb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[var(--theme-accent)] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> + Nova Nota de Exploração
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Anotações de Rotas, Drops & Quests
          </span>
        </div>

        <textarea
          id="quick-note-input"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Ex: Pegar 20k de almas para Bellowing Ring em Sen; Voltar ao Asylum para matar Stray Demon; Laurentius já está em Firelink..."
          rows={2}
          className="w-full bg-[#0d0d0d] border border-[#333] focus:border-[var(--theme-accent)] rounded p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none font-mono"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[var(--theme-accent)]" /> Categoria:
            </span>
            {(['general', 'build', 'boss', 'npc', 'farming'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                id={`note-cat-${cat}`}
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                  category === cat
                    ? 'bg-[var(--theme-accent)] text-black font-bold border-[var(--theme-accent)]'
                    : 'bg-[#1c1c1c] text-zinc-400 border-[#2e2e2e] hover:text-zinc-200'
                }`}
              >
                {cat === 'general' ? 'Geral' : cat === 'build' ? 'Build' : cat === 'boss' ? 'Chefe' : cat === 'npc' ? 'NPC' : 'Farm'}
              </button>
            ))}
          </div>

          <button
            type="submit"
            id="btn-submit-quick-note"
            disabled={!newNoteText.trim()}
            className="px-4 py-1.5 bg-[var(--theme-accent)] hover:bg-[#ff6a2b] disabled:opacity-40 text-black font-bold font-mono uppercase tracking-wider rounded text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Salvar Nota
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 bg-[#111] p-2.5 rounded border border-[#2a2a2a]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Filtrar:</span>
          {['all', 'build', 'boss', 'npc', 'farming', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-[var(--theme-accent)] text-black font-bold'
                  : 'bg-[#1c1c1c] text-zinc-400 hover:text-zinc-200 border border-[#2e2e2e]'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'REGISTRO' : 'REGISTROS'}
        </span>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-[#151515] rounded border border-[#2a2a2a] text-zinc-500 text-xs font-mono">
              Nenhuma anotação rápida salva ainda. Use o campo acima para registrar lembretes da sua jornada.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3.5 rounded border transition-all flex flex-col justify-between ${
                  note.pinned
                    ? 'bg-[#151515] border-[var(--theme-accent)]/50 shadow-md shadow-[var(--theme-accent)]/10'
                    : 'bg-[#151515] border-[#2a2a2a] hover:border-[#333]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryColor(note.category)}`}>
                      {note.category === 'build' ? 'Build' : note.category === 'npc' ? 'NPC' : note.category === 'boss' ? 'Chefe' : note.category === 'farming' ? 'Farming' : 'Geral'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-pin-note-${note.id}`}
                        onClick={() => onTogglePin(note.id)}
                        className={`p-1 rounded hover:bg-[#222] text-xs transition-colors ${
                          note.pinned ? 'text-[var(--theme-accent)]' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title={note.pinned ? 'Desafixar nota' : 'Fixar no topo'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-delete-note-${note.id}`}
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 rounded hover:bg-red-950/60 text-zinc-500 hover:text-red-400 text-xs transition-colors"
                        title="Excluir nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-mono">
                    {note.text}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#222] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-zinc-500" />
                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {note.pinned && <span className="text-[var(--theme-accent)] font-bold">📌 FIXADA</span>}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
