import React, { useState, useRef } from 'react';
import { MemoryItem } from '../../../types';
import { BookOpen, Plus, Trash2, ArrowUp, ArrowDown, Star, Edit3, Image as ImageIcon, Check, X, Tag } from 'lucide-react';

interface MemoriesSectionProps {
  memories: MemoryItem[];
  onChange: (updatedMemories: MemoryItem[]) => void;
}

const CATEGORIES = [
  'Our Moments',
  'Favorite Photos',
  'Silly Memories',
  'Little Messages',
  'Birthday Moments',
  'Special Days',
];

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories, onChange }) => {
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states for new or edited memory
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Today');
  const [category, setCategory] = useState('Our Moments');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('💕 Sweet Memory');
  const [sticker, setSticker] = useState('🎀');
  const [tapeType, setTapeType] = useState<'pink' | 'gold' | 'corner'>('pink');
  const [featured, setFeatured] = useState(false);

  const openAddModal = () => {
    setTitle('');
    setDate('Today');
    setCategory('Our Moments');
    setImage('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80');
    setDescription('');
    setTag('💕 Sweet Moment');
    setSticker('🎀');
    setTapeType('pink');
    setFeatured(false);
    setEditingMemory(null);
    setIsAddingNew(true);
  };

  const openEditModal = (mem: MemoryItem) => {
    setEditingMemory(mem);
    setTitle(mem.title);
    setDate(mem.date);
    setCategory(mem.category);
    setImage(mem.image);
    setDescription(mem.description);
    setTag(mem.tag);
    setSticker(mem.sticker || '🎀');
    setTapeType(mem.tapeType || 'pink');
    setFeatured(!!mem.featured);
    setIsAddingNew(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Please provide a memory title and image.');
      return;
    }

    if (editingMemory) {
      // Update
      const updated = memories.map((m) =>
        m.id === editingMemory.id
          ? {
              ...m,
              title: title.trim(),
              date: date.trim() || 'Today',
              category,
              image: image.trim(),
              description: description.trim() || 'Heartfelt memory.',
              tag: tag.trim() || '💕 Memory',
              sticker,
              tapeType,
              featured,
            }
          : m
      );
      onChange(updated);
    } else {
      // Create
      const newMemory: MemoryItem = {
        id: `mem-${Date.now()}`,
        title: title.trim(),
        date: date.trim() || 'Today',
        category,
        image: image.trim(),
        description: description.trim() || 'Heartfelt memory.',
        tag: tag.trim() || '💕 Memory',
        color: 'from-rose-500 to-pink-600',
        rotation: Number(((Math.random() * 4) - 2).toFixed(1)),
        layoutVariant: 'polaroid',
        sticker,
        tapeType,
        order: memories.length + 1,
        featured,
      };
      onChange([newMemory, ...memories]);
    }

    setIsAddingNew(false);
    setEditingMemory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      onChange(memories.filter((m) => m.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= memories.length) return;
    const updated = [...memories];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange(updated);
  };

  const toggleFeatured = (id: string) => {
    onChange(
      memories.map((m) => (m.id === id ? { ...m, featured: !m.featured } : m))
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <span>Memory Album Manager ({memories.length})</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Add unlimited memories, set categories, washi tape accents, and featured moments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Memory</span>
        </button>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isAddingNew && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-rose-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>{editingMemory ? 'Edit Memory' : 'Create New Birthday Memory'}</span>
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveMemory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset Giggles"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Date / Moment
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 14 May 2026 or Summer Nights"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. 💕 Sweet Note"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Scrapbook Sticker
                </label>
                <select
                  value={sticker}
                  onChange={(e) => setSticker(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="🎀">🎀 Ribbon</option>
                  <option value="💕">💕 Hearts</option>
                  <option value="✨">✨ Sparkles</option>
                  <option value="🌸">🌸 Flower</option>
                  <option value="🎂">🎂 Cake</option>
                  <option value="🎉">🎉 Confetti</option>
                  <option value="👑">👑 Crown</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Washi Tape Style
                </label>
                <select
                  value={tapeType}
                  onChange={(e) => setTapeType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="pink">Pink Tape</option>
                  <option value="gold">Gold Foil Tape</option>
                  <option value="corner">Corner Photo Tabs</option>
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Image (URL or Upload File) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 cursor-pointer"
                  >
                    Browse File
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Heartfelt Memory Story / Description *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write the sweet story behind this memory..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Featured Memory (Golden Highlight)</span>
                </label>
              </div>
            </div>

            {/* Preview snippet */}
            {image && (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-3">
                <img src={image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                <div className="text-xs">
                  <p className="font-bold text-white">{title || 'Untitled Memory'}</p>
                  <p className="text-neutral-400 text-[11px]">{date} • {category}</p>
                  <span className="text-[10px] text-rose-400 font-semibold">{sticker} {tapeType} tape</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {editingMemory ? 'Update Memory' : 'Add to Scrapbook'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories List */}
      <div className="space-y-3">
        {memories.map((mem, index) => (
          <div
            key={mem.id}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/70 ${
              mem.featured ? 'border-amber-500/50 bg-amber-950/10' : 'border-neutral-800'
            }`}
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 text-xs">{mem.sticker || '🎀'}</div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{mem.title}</h4>
                  {mem.featured && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-bold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                  <span className="text-rose-400 font-semibold">{mem.category}</span>
                  <span>•</span>
                  <span>{mem.date}</span>
                  <span>•</span>
                  <span>{mem.tag}</span>
                </div>
                <p className="text-xs text-neutral-300 line-clamp-1 mt-1 max-w-md">
                  {mem.description}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                onClick={() => toggleFeatured(mem.id)}
                title="Toggle Featured"
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  mem.featured
                    ? 'bg-amber-500 text-neutral-950 border-amber-400'
                    : 'text-neutral-400 hover:text-amber-400 border-neutral-800'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={() => openEditModal(mem)}
                title="Edit Memory"
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-neutral-700 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                title="Move Up"
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === memories.length - 1}
                title="Move Down"
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(mem.id)}
                title="Delete"
                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
