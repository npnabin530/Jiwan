import React from 'react';
import { ThemeSettings } from '../../../types';
import { Palette, Sparkles, Sliders, Check } from 'lucide-react';

interface ThemeSectionProps {
  theme: ThemeSettings;
  onChange: (updated: ThemeSettings) => void;
}

const PRESETS = [
  {
    id: 'cream-rose',
    name: 'Cream & Rose Gold 💕',
    primary: '#f43f5e',
    accent: '#f59e0b',
    background: '#fffaf5',
    text: '#1f2937',
  },
  {
    id: 'royal-midnight',
    name: 'Royal Velvet & Gold 👑',
    primary: '#e11d48',
    accent: '#fbbf24',
    background: '#0a0a0c',
    text: '#ffffff',
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Whisper 💜',
    primary: '#a855f7',
    accent: '#ec4899',
    background: '#faf5ff',
    text: '#2e1065',
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Peach & Apricot 🌅',
    primary: '#f97316',
    accent: '#f43f5e',
    background: '#fff7ed',
    text: '#431407',
  },
];

export const ThemeSection: React.FC<ThemeSectionProps> = ({ theme, onChange }) => {
  const updateField = (field: keyof ThemeSettings, val: any) => {
    onChange({ ...theme, [field]: val });
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    onChange({
      ...theme,
      preset: preset.id,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.background,
      textColor: preset.text,
      buttonColor: preset.primary,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          <span>Background & Theme Customizer</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Select visual themes, background imagery, video ambience, and accent color palettes.
        </p>
      </div>

      {/* Preset Palettes */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-300 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One-Click Palette Presets</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                theme.preset === p.id
                  ? 'border-rose-400 bg-neutral-850 shadow-md ring-1 ring-rose-400'
                  : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.primary }} />
                <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.accent }} />
                <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.background }} />
              </div>
              <p className="text-xs font-bold text-white truncate">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Primary Accent Color */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-200 mb-2">
            Primary Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primaryColor || '#f43f5e'}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Secondary Accent Color */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-200 mb-2">
            Secondary / Golden Accent
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.accentColor || '#f59e0b'}
              onChange={(e) => updateField('accentColor', e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => updateField('accentColor', e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Button Color */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-200 mb-2">
            Main Button Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.buttonColor || '#f43f5e'}
              onChange={(e) => updateField('buttonColor', e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.buttonColor}
              onChange={(e) => updateField('buttonColor', e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-200 mb-2">
            Base Canvas Background
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.backgroundColor || '#fffaf5'}
              onChange={(e) => updateField('backgroundColor', e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.backgroundColor}
              onChange={(e) => updateField('backgroundColor', e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Custom Background Image URL */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-200 mb-1">
            Custom Background Image URL (Optional)
          </label>
          <input
            type="url"
            value={theme.bgImageUrl}
            onChange={(e) => updateField('bgImageUrl', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Background Video URL */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-200 mb-1">
            Ambient Background Video URL (Optional MP4 / WebM)
          </label>
          <input
            type="url"
            value={theme.bgVideoUrl}
            onChange={(e) => updateField('bgVideoUrl', e.target.value)}
            placeholder="https://.../ambient.mp4"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Overlay Opacity */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-200">
              Dark Overlay Tint ({theme.overlayOpacity}%)
            </label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={theme.overlayOpacity}
            onChange={(e) => updateField('overlayOpacity', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="p-5 rounded-3xl border border-neutral-800 bg-neutral-950 relative overflow-hidden">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Live Theme Preview
        </h3>
        <div
          className="p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: theme.backgroundColor || '#fffaf5',
            color: theme.textColor || '#1f2937',
            borderColor: theme.primaryColor || '#f43f5e',
          }}
        >
          <div>
            <h4 className="font-playfair text-xl font-bold">Happy 19th Birthday! 💕</h4>
            <p className="text-xs opacity-80 mt-1">
              Sample romantic card styled with your current palette selection.
            </p>
          </div>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform"
            style={{
              backgroundColor: theme.buttonColor || '#f43f5e',
              color: theme.buttonTextColor || '#ffffff',
            }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
};
