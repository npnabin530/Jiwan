import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  Trash2,
  Plus,
  Settings,
  Sparkles,
  RotateCcw,
  Check,
  Tag,
  Calendar,
  Layers,
  FileText,
  MessageSquare,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { MemoryItem, Album, BirthdayWish, CelebrationSettings } from '../types';
import confetti from 'canvas-confetti';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onUpdateMemories: (updated: MemoryItem[]) => void;
  albums: Album[];
  onUpdateAlbums: (updated: Album[]) => void;
  wishes: BirthdayWish[];
  onUpdateWishes: (updated: BirthdayWish[]) => void;
  settings: CelebrationSettings;
  onUpdateSettings: (updated: CelebrationSettings) => void;
  onResetAllData: () => void;
}

type AdminTab = 'media' | 'albums' | 'celebration' | 'wishes';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  memories,
  onUpdateMemories,
  albums,
  onUpdateAlbums,
  wishes,
  onUpdateWishes,
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('media');
  const [notification, setNotification] = useState<string>('');

  // Media Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Today');
  const [newCategory, setNewCategory] = useState('Our Moments');
  const [newAlbumId, setNewAlbumId] = useState<string>(albums[0]?.id || 'album-our-moments');
  const [newDescription, setNewDescription] = useState('');
  const [newTag, setNewTag] = useState('💕 Sweet Memory');
  const [newSticker, setNewSticker] = useState('🎀');
  const [newTapeType, setNewTapeType] = useState<'pink' | 'gold' | 'corner'>('pink');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-rose-500 to-pink-600');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Album Form State
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumBadge, setNewAlbumBadge] = useState('✨ Album');
  const [newAlbumCover, setNewAlbumCover] = useState('');
  const albumCoverInputRef = useRef<HTMLInputElement | null>(null);

  // Settings State Form
  const [personName, setPersonName] = useState(settings.personName);
  const [personAge, setPersonAge] = useState(settings.age);
  const [subTitle, setSubTitle] = useState(settings.subTitle);
  const [signatureName, setSignatureName] = useState(settings.signatureName);
  const [dateStamp, setDateStamp] = useState(settings.dateStamp);
  const [letterParagraph1, setLetterParagraph1] = useState(settings.letterBody[0] || '');
  const [letterParagraph2, setLetterParagraph2] = useState(settings.letterBody[1] || '');
  const [letterParagraph3, setLetterParagraph3] = useState(settings.letterBody[2] || '');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Handle local image file upload & convert to base64
  const handleFileUpload = (file: File, isAlbumCover = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, GIF, etc.).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isAlbumCover) {
        setNewAlbumCover(result);
      } else {
        setNewImageUrl(result);
      }
      showToast('Image uploaded successfully! 📸');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Add new Memory Asset
  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) {
      alert('Please provide a title and an image (upload or URL).');
      return;
    }

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim() || 'Today',
      category: newCategory.trim() || 'Our Moments',
      albumId: newAlbumId,
      image: newImageUrl.trim(),
      description: newDescription.trim() || 'Unforgettable celebration memory.',
      tag: newTag.trim() || '💕 Sweet Moment',
      color: selectedColor,
      isCustomUpload: true,
      sticker: newSticker,
      tapeType: newTapeType,
      rotation: Number(((Math.random() * 4) - 2).toFixed(1)),
      layoutVariant: 'polaroid',
    };

    onUpdateMemories([newItem, ...memories]);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    showToast('New media memory added to Album! 🎉');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Delete Memory
  const handleDeleteMemory = (id: string) => {
    if (confirm('Delete this memory from the scrapbook?')) {
      onUpdateMemories(memories.filter((m) => m.id !== id));
      showToast('Memory removed.');
    }
  };

  // Add new Album
  const handleAddAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) {
      alert('Please provide an album name.');
      return;
    }

    const newAlb: Album = {
      id: `album-${Date.now()}`,
      name: newAlbumName.trim(),
      description: newAlbumDesc.trim() || 'Curated collection of special moments.',
      coverImage: newAlbumCover.trim() || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
      badge: newAlbumBadge.trim() || '📁 Album',
      createdAt: 'Just now',
    };

    onUpdateAlbums([...albums, newAlb]);
    setNewAlbumName('');
    setNewAlbumDesc('');
    setNewAlbumBadge('✨ Album');
    setNewAlbumCover('');
    showToast('New Album created! 📁');
  };

  // Delete Album
  const handleDeleteAlbum = (id: string) => {
    if (albums.length <= 1) {
      alert('You must keep at least one album.');
      return;
    }
    if (confirm('Delete this album? Photos in this album will remain in general memories.')) {
      onUpdateAlbums(albums.filter((a) => a.id !== id));
      showToast('Album deleted.');
    }
  };

  // Save Celebration Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CelebrationSettings = {
      personName: personName.trim() || 'Jawan Urnaw',
      age: Number(personAge) || 19,
      subTitle: subTitle.trim() || '19th Birthday Experience',
      signatureName: signatureName.trim() || `Happy ${personAge}th Birthday, ${personName}!`,
      dateStamp: dateStamp.trim() || 'September 2026 • Royal Milestone',
      letterTitle: `DEAREST ${personName.toUpperCase()}`,
      letterBody: [
        letterParagraph1.trim(),
        letterParagraph2.trim(),
        letterParagraph3.trim(),
      ].filter(Boolean),
    };
    onUpdateSettings(updated);
    showToast('Celebration details updated successfully! 👑');
  };

  // Delete Wish
  const handleDeleteWish = (id: string) => {
    onUpdateWishes(wishes.filter((w) => w.id !== id));
    showToast('Wish deleted.');
  };

  if (!isOpen) return null;

  return (
    <div
      id="admin-panel-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-lg overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id="admin-panel-dialog"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-neutral-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_70px_rgba(245,158,11,0.3)] text-neutral-100 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                Celebration Admin Panel
              </h2>
              <p className="text-[11px] text-neutral-400">
                Upload media assets, organize albums & customize celebration
              </p>
            </div>
          </div>
          <button
            id="btn-close-admin-panel"
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-4 pb-3 overflow-x-auto no-scrollbar border-b border-neutral-800 text-xs font-semibold">
          <button
            id="tab-admin-media"
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media ({memories.length})</span>
          </button>
          <button
            id="tab-admin-albums"
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'albums'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Albums ({albums.length})</span>
          </button>
          <button
            id="tab-admin-celebration"
            onClick={() => setActiveTab('celebration')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'celebration'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Details & Letter</span>
          </button>
          <button
            id="tab-admin-wishes"
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wishes'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Guest Wishes ({wishes.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {/* ================= TAB 1: MEDIA ASSETS UPLOAD ================= */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Upload Card */}
              <form onSubmit={handleAddMemorySubmit} className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Upload New Photo / Media Asset</span>
                  </h3>
                  <span className="text-[10px] text-neutral-400">Syncs immediately to 3D memory book</span>
                </div>

                {/* Drag and Drop Box & File input */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragOver
                      ? 'border-amber-400 bg-amber-500/15'
                      : 'border-neutral-700 bg-neutral-900/60 hover:border-amber-500/50 hover:bg-neutral-900'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {newImageUrl ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-amber-400/40">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1 bg-neutral-900 text-xs text-white rounded-full font-semibold">
                          Click to Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <Upload className="w-5 h-5 animate-bounce" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-200">
                        Drop image here, or <span className="text-amber-400 underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-neutral-500">Supports PNG, JPG, WEBP, GIF</p>
                    </>
                  )}
                </div>

                {/* Image URL fallback */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Or Paste Direct Image Web URL
                  </label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Memory Metadata Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Memory Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Birthday Party Madness"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Assign to Album *
                    </label>
                    <select
                      value={newAlbumId}
                      onChange={(e) => setNewAlbumId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.badge} {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Scrapbook Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Our Moments">Our Moments</option>
                      <option value="Favorite Photos">Favorite Photos</option>
                      <option value="Silly Memories">Silly Memories</option>
                      <option value="Little Messages">Little Messages</option>
                      <option value="Birthday Moments">Birthday Moments</option>
                      <option value="Special Days">Special Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Date / Moment
                    </label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="Today, Summer 2026..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Sticker & Washi Tape
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={newSticker}
                        onChange={(e) => setNewSticker(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="🎀">🎀 Ribbon</option>
                        <option value="💕">💕 Hearts</option>
                        <option value="✨">✨ Sparkles</option>
                        <option value="🌸">🌸 Flower</option>
                        <option value="🎂">🎂 Cake</option>
                        <option value="🎉">🎉 Confetti</option>
                        <option value="👑">👑 Crown</option>
                      </select>
                      <select
                        value={newTapeType}
                        onChange={(e) => setNewTapeType(e.target.value as 'pink' | 'gold' | 'corner')}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="pink">Pink Tape</option>
                        <option value="gold">Gold Tape</option>
                        <option value="corner">Corner Tabs</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Caption / Heartfelt Story
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Write a sweet memory or inside joke for this photo..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Theme Accent Color */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-400">Accent:</span>
                    {[
                      'from-amber-500 to-yellow-600',
                      'from-rose-500 to-red-600',
                      'from-blue-500 to-indigo-600',
                      'from-purple-500 to-pink-600',
                      'from-emerald-500 to-teal-600',
                    ].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`w-5 h-5 rounded-full bg-gradient-to-tr ${col} ${
                          selectedColor === col ? 'ring-2 ring-white scale-110' : 'opacity-70'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload to Album</span>
                  </button>
                </div>
              </form>

              {/* Existing Media Items Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Uploaded Memories ({memories.length})
                  </h3>
                  <span className="text-[11px] text-neutral-400">Click trash to remove</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {memories.map((mem) => {
                    const album = albums.find((a) => a.id === mem.albumId);
                    return (
                      <div
                        key={mem.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 group"
                      >
                        <img
                          src={mem.image}
                          alt={mem.title}
                          className="w-14 h-14 rounded-lg object-cover border border-neutral-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">{mem.title}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-amber-400 font-medium truncate">
                              {album?.name || mem.category}
                            </span>
                            <span className="text-[9px] text-neutral-500">{mem.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMemory(mem.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Delete memory"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: ALBUMS MANAGER ================= */}
          {activeTab === 'albums' && (
            <div className="space-y-6">
              {/* Create Album Form */}
              <form onSubmit={handleAddAlbumSubmit} className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4" />
                  <span>Create New Memory Album</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Album Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      placeholder="e.g. High School Memories, Trips"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Badge Icon / Text
                    </label>
                    <input
                      type="text"
                      value={newAlbumBadge}
                      onChange={(e) => setNewAlbumBadge(e.target.value)}
                      placeholder="👑 Milestone, 🚀 Travel, 🎧 Beats"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Album Description
                  </label>
                  <input
                    type="text"
                    value={newAlbumDesc}
                    onChange={(e) => setNewAlbumDesc(e.target.value)}
                    placeholder="Short description of this album collection..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Cover Photo (Upload or Paste URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newAlbumCover}
                      onChange={(e) => setNewAlbumCover(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => albumCoverInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={albumCoverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], true);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Create Album</span>
                  </button>
                </div>
              </form>

              {/* List of Albums */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Active Albums ({albums.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {albums.map((album) => {
                    const photosCount = memories.filter((m) => m.albumId === album.id).length;
                    return (
                      <div
                        key={album.id}
                        className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col group"
                      >
                        <div className="relative h-28 w-full bg-neutral-900">
                          <img
                            src={album.coverImage}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold border border-amber-400/30">
                            {album.badge}
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate drop-shadow-md">
                              {album.name}
                            </span>
                            <span className="text-[10px] text-neutral-300 bg-neutral-900/80 px-2 py-0.5 rounded-full">
                              {photosCount} photos
                            </span>
                          </div>
                        </div>

                        <div className="p-3 flex items-center justify-between text-xs">
                          <p className="text-[11px] text-neutral-400 truncate flex-1 mr-2">
                            {album.description}
                          </p>
                          <button
                            onClick={() => handleDeleteAlbum(album.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CELEBRATION DETAILS & LETTER ================= */}
          {activeTab === 'celebration' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Celebration Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Birthday Person's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Milestone Age *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={personAge}
                      onChange={(e) => setPersonAge(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Header Subtitle
                    </label>
                    <input
                      type="text"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Date Stamp
                    </label>
                    <input
                      type="text"
                      value={dateStamp}
                      onChange={(e) => setDateStamp(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Royal Parchment Letter Customizer */}
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Royal Parchment Letter Text</span>
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Opening Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={letterParagraph1}
                    onChange={(e) => setLetterParagraph1(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Middle Blessing Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={letterParagraph2}
                    onChange={(e) => setLetterParagraph2(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Closing Blessing Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={letterParagraph3}
                    onChange={(e) => setLetterParagraph3(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Signature Line
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/30 cursor-pointer"
                  >
                    Save Celebration Settings
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= TAB 4: GUEST WISHES MANAGER ================= */}
          {activeTab === 'wishes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Guest Wishes Wall ({wishes.length})
                </h3>
                <button
                  onClick={() => {
                    if (confirm('Reset wishes to original default entries?')) {
                      onResetAllData();
                      showToast('Default data reloaded.');
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-amber-400 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Data</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${w.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {w.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-white">{w.author}</h4>
                          <span className="text-[10px] text-amber-400 font-medium">({w.relation})</span>
                          <span className="text-[9px] text-neutral-500">{w.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">&ldquo;{w.message}&rdquo;</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWish(w.id)}
                      className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                      title="Delete wish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>All uploads stored securely in local browser storage.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
