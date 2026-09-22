import React, { useState, useRef } from 'react';
import { MusicSettings } from '../../../types';
import { Music, Play, Pause, Volume2, Upload, Link as LinkIcon, Sparkles, Check, Trash2, Radio } from 'lucide-react';
import { soundManager } from '../../../utils/audio';

interface MusicSectionProps {
  music: MusicSettings;
  onChange: (updated: MusicSettings) => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({ music, onChange }) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = (field: keyof MusicSettings, val: any) => {
    onChange({ ...music, [field]: val });
    if (field === 'volume') {
      soundManager.setVolume(val / 100);
    }
    if (field === 'audioUrl') {
      soundManager.setCustomAudioUrl(val);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav')) {
      alert('Please upload an MP3 or WAV audio track.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Audio = event.target?.result as string;
      onChange({
        ...music,
        title: file.name.replace(/\.[^/.]+$/, ''),
        audioUrl: base64Audio,
        useSynthesizer: false,
      });
      soundManager.setCustomAudioUrl(base64Audio);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const togglePreview = () => {
    if (isPlayingPreview) {
      soundManager.stopHappyBirthday();
      setIsPlayingPreview(false);
    } else {
      soundManager.setCustomAudioUrl(music.audioUrl || '');
      soundManager.setVolume((music.volume || 80) / 100);
      soundManager.playHappyBirthdayMelody();
      setIsPlayingPreview(true);
    }
  };

  const useDefaultSynthesizer = () => {
    soundManager.stopHappyBirthday();
    setIsPlayingPreview(false);
    onChange({
      ...music,
      title: 'Happy Birthday Music Box Melody (Synthesizer)',
      audioUrl: '',
      useSynthesizer: true,
    });
    soundManager.setCustomAudioUrl('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-rose-400" />
          <span>Background Music & Sound Manager</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure celebratory background audio, volume, autoplay behavior, and custom tracks.
        </p>
      </div>

      {/* 🎵 Current Background Music Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-rose-950/30 border border-rose-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <div className="w-full h-full rounded-[14px] bg-neutral-950 flex items-center justify-center">
              <Music className={`w-5 h-5 ${isPlayingPreview ? 'text-amber-400 animate-bounce' : 'text-rose-400'}`} />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold mb-1">
              <span>🎵 Current Background Music</span>
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {music.title || 'Happy Birthday Music Box Melody'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {music.useSynthesizer || !music.audioUrl
                ? 'Synthesized Celesta & Music Box Tone (zero external buffering)'
                : 'Custom Audio Track (MP3/WAV)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Play/Pause Preview */}
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isPlayingPreview
                ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            {isPlayingPreview ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Preview</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Play Preview</span>
              </>
            )}
          </button>

          {/* Reset to default synth */}
          {music.audioUrl && (
            <button
              onClick={useDefaultSynthesizer}
              title="Reset to default birthday music box"
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-neutral-700 cursor-pointer"
            >
              Reset to Melody Box
            </button>
          )}
        </div>
      </div>

      {/* Music Settings Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enable / Disable Master Music */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Enable Background Music</h4>
            <p className="text-[11px] text-neutral-400">Allow visitors to enjoy background celebratory soundtrack</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={music.enabled}
              onChange={(e) => updateField('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Autoplay Preference */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Autoplay on Visitor Load</h4>
            <p className="text-[11px] text-neutral-400">Starts automatically when browser security policies permit</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={music.autoplay}
              onChange={(e) => updateField('autoplay', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Volume Slider */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Default Volume ({music.volume}%)</span>
            </label>
            <span className="text-xs text-neutral-400 font-mono">{music.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={music.volume}
            onChange={(e) => updateField('volume', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        {/* Upload Custom Audio File */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-rose-400" />
            <span>Upload Audio File (MP3 / WAV)</span>
          </h4>
          <p className="text-[11px] text-neutral-400 mb-3">
            Upload custom song or voice message directly into the website storage.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Browse Audio File</span>
          </button>
        </div>

        {/* Custom Audio URL */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Or Add Audio from Stream / Web URL</span>
          </h4>
          <p className="text-[11px] text-neutral-400 mb-2">
            Direct link to an audio stream (e.g. https://domain.com/song.mp3).
          </p>
          <input
            type="url"
            value={music.audioUrl?.startsWith('data:') ? '' : music.audioUrl}
            onChange={(e) => updateField('audioUrl', e.target.value)}
            placeholder="https://..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>
    </div>
  );
};
