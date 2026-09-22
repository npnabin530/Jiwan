import React, { useState, useRef } from 'react';
import { PhotoItem } from '../../../types';
import { Image as ImageIcon, Upload, Plus, Trash2, ArrowUp, ArrowDown, Star, Sparkles, Check, Link as LinkIcon } from 'lucide-react';

interface PhotosSectionProps {
  photos: PhotoItem[];
  onChange: (updatedPhotos: PhotoItem[]) => void;
}

export const PhotosSection: React.FC<PhotosSectionProps> = ({ photos, onChange }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('Today');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newPhotoItem: PhotoItem = {
        id: `p-${Date.now()}`,
        url: base64,
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: 'Precious birthday memory.',
        date: 'Today',
        memoryTitle: file.name.replace(/\.[^/.]+$/, ''),
        memoryDescription: 'Uploaded keepsake photograph.',
        isCover: photos.length === 0,
        isHero: photos.length === 0,
        order: photos.length + 1,
      };
      onChange([newPhotoItem, ...photos]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle replace photo upload
  const handleReplaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange(
        photos.map((p) =>
          p.id === replaceTargetId ? { ...p, url: base64 } : p
        )
      );
      setReplaceTargetId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add photo from URL
  const handleAddFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newPhotoItem: PhotoItem = {
      id: `p-${Date.now()}`,
      url: newUrl.trim(),
      title: newTitle.trim() || 'New Keepsake Photo',
      caption: newCaption.trim() || 'Precious birthday memory.',
      date: newDate.trim() || 'Today',
      memoryTitle: newTitle.trim() || 'New Keepsake Photo',
      memoryDescription: newCaption.trim() || 'Precious birthday memory.',
      isCover: photos.length === 0,
      isHero: photos.length === 0,
      order: photos.length + 1,
    };

    onChange([newPhotoItem, ...photos]);
    setNewUrl('');
    setNewTitle('');
    setNewCaption('');
    setIsUrlModalOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      onChange(photos.filter((p) => p.id !== id));
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;
    const updated = [...photos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const setCover = (id: string) => {
    onChange(
      photos.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
  };

  const setHero = (id: string) => {
    onChange(
      photos.map((p) => ({
        ...p,
        isHero: p.id === id,
      }))
    );
  };

  const updatePhotoDetails = (id: string, updates: Partial<PhotoItem>) => {
    onChange(
      photos.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedPhoto?.id === id) {
      setSelectedPhoto({ ...selectedPhoto, ...updates });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-400" />
            <span>Photo Management ({photos.length})</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload pictures, set hero and album cover images, and edit captions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload file button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          {/* Add URL button */}
          <button
            onClick={() => setIsUrlModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Add by URL</span>
          </button>
        </div>
      </div>

      {/* Hidden input for photo replacement */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleReplaceUpload}
        className="hidden"
      />

      {/* Add by URL Modal */}
      {isUrlModalOpen && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              <span>Add Image from Web URL</span>
            </h3>
            <button
              onClick={() => setIsUrlModalOpen(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleAddFromUrl} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-300 mb-1">Photo Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Birthday Smile"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-300 mb-1">Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. 22 Sep 2026"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="e.g. An unforgettable moment in time..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {newUrl && (
              <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-3">
                <img
                  src={newUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-neutral-700"
                  onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
                <span className="text-[11px] text-neutral-400">Live preview of image</span>
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
            >
              Add to Gallery
            </button>
          </form>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col group"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-4/3 bg-neutral-950 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {photo.isCover && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Album Cover</span>
                  </span>
                )}
                {photo.isHero && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow-md">
                    Hero Photo
                  </span>
                )}
              </div>

              {/* Quick Actions Overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/70 backdrop-blur-xs p-1 rounded-xl">
                <button
                  onClick={() => {
                    setReplaceTargetId(photo.id);
                    replaceFileInputRef.current?.click();
                  }}
                  title="Replace image file"
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs cursor-pointer"
                >
                  Replace
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  title="Delete Photo"
                  className="p-1 rounded-lg hover:bg-rose-900/60 text-neutral-300 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editable Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
              <div>
                <input
                  type="text"
                  value={photo.title}
                  onChange={(e) => updatePhotoDetails(photo.id, { title: e.target.value })}
                  placeholder="Photo Title"
                  className="w-full bg-transparent border-b border-transparent focus:border-rose-400 font-semibold text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updatePhotoDetails(photo.id, { caption: e.target.value })}
                  placeholder="Caption / Description"
                  className="w-full bg-transparent border-b border-transparent focus:border-rose-400 text-[11px] text-neutral-400 outline-none mt-1"
                />
              </div>

              {/* Toggles & Reorder Buttons */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCover(photo.id)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
                      photo.isCover
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Cover
                  </button>
                  <button
                    onClick={() => setHero(photo.id)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
                      photo.isHero
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Hero
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === photos.length - 1}
                    className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
