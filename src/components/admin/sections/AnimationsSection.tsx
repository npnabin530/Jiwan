import React from 'react';
import { AnimationSettings } from '../../../types';
import { Sparkles, Heart, Wind, Flame, SunMedium, Play, Sliders } from 'lucide-react';

interface AnimationsSectionProps {
  animations: AnimationSettings;
  onChange: (updated: AnimationSettings) => void;
}

export const AnimationsSection: React.FC<AnimationsSectionProps> = ({ animations, onChange }) => {
  const updateToggle = (field: keyof AnimationSettings, val: any) => {
    onChange({ ...animations, [field]: val });
  };

  const toggles = [
    { key: 'floatingHearts', label: 'Floating Hearts 💕', desc: 'Gentle floating romantic hearts across the screen' },
    { key: 'balloons', label: 'Festive Balloons 🎈', desc: 'Colorful floating helium birthday balloons' },
    { key: 'confetti', label: 'Confetti Effects 🎉', desc: 'Shimmering metallic gold and rose confetti burst' },
    { key: 'sparkles', label: 'Magic Sparkles ✨', desc: 'Twinkling magical stars following touches' },
    { key: 'flowers', label: 'Falling Rose Petals 🌸', desc: 'Delicate drifting flower blossom petals' },
    { key: 'floatingParticles', label: 'Ambient Firefly Dust 🌟', desc: 'Subtle glowing bokeh dust in background' },
    { key: 'photoAnimations', label: 'Polaroid Tilt & Lift 📸', desc: 'Interactive tilt, lift, and bounce on photos' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <span>Animation & Particle Effects Studio</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Toggle celebration visual physics, particle speed, and interactive effects.
        </p>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {toggles.map((item) => (
          <div
            key={item.key}
            className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between"
          >
            <div>
              <h4 className="text-xs font-bold text-white">{item.label}</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!animations[item.key as keyof AnimationSettings]}
                onChange={(e) => updateToggle(item.key as keyof AnimationSettings, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>
        ))}
      </div>

      {/* Speed & Intensity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-2">
            Particle Motion Speed
          </label>
          <div className="flex gap-2">
            {(['slow', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => updateToggle('speed', spd)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                  animations.speed === spd
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-2">
            Effect Density / Intensity
          </label>
          <div className="flex gap-2">
            {(['subtle', 'medium', 'extravagant'] as const).map((density) => (
              <button
                key={density}
                type="button"
                onClick={() => updateToggle('intensity', density)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                  animations.intensity === density
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
