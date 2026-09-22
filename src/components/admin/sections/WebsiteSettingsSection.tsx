import React from 'react';
import { SiteSettings } from '../../../types';
import { Type, Sparkles, User, Calendar, FileText, Bookmark } from 'lucide-react';

interface WebsiteSettingsSectionProps {
  settings: SiteSettings;
  onChange: (updated: SiteSettings) => void;
}

export const WebsiteSettingsSection: React.FC<WebsiteSettingsSectionProps> = ({ settings, onChange }) => {
  const updateField = (field: keyof SiteSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Type className="w-5 h-5 text-rose-400" />
          <span>Website Text & Brand Content</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Customize all visible texts, titles, subtitles, and labels for the birthday website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person's Name */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Birthday Person's Name *</span>
          </label>
          <input
            type="text"
            value={settings.personName}
            onChange={(e) => updateField('personName', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="e.g. Jawan Urnaw"
          />
        </div>

        {/* Milestone Age */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Milestone Age *</span>
          </label>
          <input
            type="number"
            value={settings.age}
            onChange={(e) => updateField('age', Number(e.target.value) || 1)}
            min="1"
            max="120"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Main Title */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Main Birthday Title *
          </label>
          <input
            type="text"
            value={settings.mainTitle}
            onChange={(e) => updateField('mainTitle', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="e.g. Happy 19th Birthday, Jawan! 🎂"
          />
        </div>

        {/* Subtitle */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Page Subtitle / Tagline
          </label>
          <input
            type="text"
            value={settings.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="A magical celebration of light, laughs, and golden moments..."
          />
        </div>

        {/* Hero Text */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Hero Intro Description
          </label>
          <textarea
            rows={2}
            value={settings.heroText}
            onChange={(e) => updateField('heroText', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Memory Album Title */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Memory Album Title</span>
          </label>
          <input
            type="text"
            value={settings.memoryAlbumTitle}
            onChange={(e) => updateField('memoryAlbumTitle', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="🎂 OUR BIRTHDAY MEMORIES 💕"
          />
        </div>

        {/* Memory Album Subtitle */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Memory Album Subtitle
          </label>
          <input
            type="text"
            value={settings.memoryAlbumSubtitle}
            onChange={(e) => updateField('memoryAlbumSubtitle', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="A little book full of beautiful moments..."
          />
        </div>

        {/* Button Text */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Main Action Button Text
          </label>
          <input
            type="text"
            value={settings.buttonText}
            onChange={(e) => updateField('buttonText', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="📖 Open My Memories"
          />
        </div>

        {/* Footer Text */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Footer Copyright / Signature
          </label>
          <input
            type="text"
            value={settings.footerText}
            onChange={(e) => updateField('footerText', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
            placeholder="Crafted with endless love for Jawan • Chapter 19"
          />
        </div>
      </div>
    </div>
  );
};
