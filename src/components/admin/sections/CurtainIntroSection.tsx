import React from 'react';
import { CurtainSettings } from '../../../types';
import { Sparkles, Film, PlayCircle, Eye, EyeOff } from 'lucide-react';

interface CurtainIntroSectionProps {
  curtain: CurtainSettings;
  onChange: (updated: CurtainSettings) => void;
}

export const CurtainIntroSection: React.FC<CurtainIntroSectionProps> = ({ curtain, onChange }) => {
  const updateField = (field: keyof CurtainSettings, val: any) => {
    onChange({ ...curtain, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-rose-400" />
          <span>Curtain & Interactive Intro Settings</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Control which cinematic intro sequences and interactive mini-games run before the memory book opens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Curtain Intro Toggle */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Velvet Curtain Opening</h4>
            <p className="text-[11px] text-neutral-400">Show initial royal velvet curtain with gold tassel pull</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={curtain.curtainEnabled}
              onChange={(e) => updateField('curtainEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Age Leap Countdown Toggle */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Age Leap Countdown Scene</h4>
            <p className="text-[11px] text-neutral-400">Animated number counting up to the milestone age</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={curtain.countdownEnabled}
              onChange={(e) => updateField('countdownEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Balloon Hunter Game */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Balloon Hunter Mini-Game</h4>
            <p className="text-[11px] text-neutral-400">Interactive balloon popping game to find the red heart balloon</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={curtain.balloonGameEnabled}
              onChange={(e) => updateField('balloonGameEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Paint Wipe Scene */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Scratch & Paint Wipe Reveal</h4>
            <p className="text-[11px] text-neutral-400">Canvas wipe reveal where user wipes screen to unveil photo</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={curtain.paintWipeEnabled}
              onChange={(e) => updateField('paintWipeEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Fireworks Surprise Scene */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Grand Fireworks & Confetti Burst</h4>
            <p className="text-[11px] text-neutral-400">Celebration fireworks finale before opening the scrapbook album</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={curtain.fireworksSurpriseEnabled}
              onChange={(e) => updateField('fireworksSurpriseEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Curtain Text Customization */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Intro Tap Prompt Text
          </label>
          <input
            type="text"
            value={curtain.introText}
            onChange={(e) => updateField('introText', e.target.value)}
            placeholder="Tap Anywhere to Open Curtains 🎭"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>
    </div>
  );
};
