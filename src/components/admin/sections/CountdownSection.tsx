import React, { useState, useEffect } from 'react';
import { CountdownSettings } from '../../../types';
import { Clock, Calendar, Globe, Sparkles } from 'lucide-react';

interface CountdownSectionProps {
  countdown: CountdownSettings;
  onChange: (updated: CountdownSettings) => void;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ countdown, onChange }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const updateField = (field: keyof CountdownSettings, val: any) => {
    onChange({ ...countdown, [field]: val });
  };

  // Live timer calculation
  useEffect(() => {
    const calculateTime = () => {
      try {
        const targetString = `${countdown.birthdayDate}T${countdown.birthdayTime || '00:00'}:00`;
        const target = new Date(targetString).getTime();
        const now = Date.now();
        const diff = Math.max(0, target - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } catch {
        // Ignored
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [countdown.birthdayDate, countdown.birthdayTime]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-400" />
          <span>Birthday Countdown & Milestone Clock</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Set the exact birthday date and moment. The public countdown ticker calculates automatically.
        </p>
      </div>

      {/* Enable / Disable Switch */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Enable Countdown Timer</h4>
          <p className="text-[11px] text-neutral-400">Show the age leap countdown experience on the website</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={countdown.enabled}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
        </label>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Birthday Date */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Birthday Date *</span>
          </label>
          <input
            type="date"
            value={countdown.birthdayDate}
            onChange={(e) => updateField('birthdayDate', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Birthday Time */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Time of Celebration *</span>
          </label>
          <input
            type="time"
            value={countdown.birthdayTime}
            onChange={(e) => updateField('birthdayTime', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Target Age */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Milestone Target Age</span>
          </label>
          <input
            type="number"
            value={countdown.targetAge}
            onChange={(e) => updateField('targetAge', Number(e.target.value) || 1)}
            min="1"
            max="120"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Countdown Title */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Countdown Screen Title
          </label>
          <input
            type="text"
            value={countdown.countdownTitle}
            onChange={(e) => updateField('countdownTitle', e.target.value)}
            placeholder="Counting Down to Chapter 19 ⚡"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Timezone */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Timezone</span>
          </label>
          <input
            type="text"
            value={countdown.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
            placeholder="UTC or Asia/Kathmandu"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Subtitle */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:col-span-2 md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Countdown Subtitle
          </label>
          <input
            type="text"
            value={countdown.countdownSubtitle}
            onChange={(e) => updateField('countdownSubtitle', e.target.value)}
            placeholder="Every single second brings us closer to your brightest chapter yet!"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Live Countdown Display Preview */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-rose-950/40 border border-rose-500/30 text-center">
        <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
          {countdown.countdownTitle || 'Counting Down to Chapter 19'}
        </h3>
        <p className="text-xs text-neutral-400 mb-4">{countdown.countdownSubtitle}</p>

        <div className="grid grid-cols-4 max-w-xs mx-auto gap-2">
          <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800">
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">{timeLeft.days}</span>
            <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">Days</span>
          </div>
          <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800">
            <span className="font-mono text-xl sm:text-2xl font-bold text-amber-400">{timeLeft.hours}</span>
            <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">Hours</span>
          </div>
          <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800">
            <span className="font-mono text-xl sm:text-2xl font-bold text-rose-400">{timeLeft.minutes}</span>
            <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">Mins</span>
          </div>
          <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800">
            <span className="font-mono text-xl sm:text-2xl font-bold text-pink-400">{timeLeft.seconds}</span>
            <span className="block text-[10px] text-neutral-400 uppercase mt-0.5">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
