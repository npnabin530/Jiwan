import React from 'react';
import { SiteSettings } from '../../../types';
import { Mail, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Heart } from 'lucide-react';

interface BirthdayMessageSectionProps {
  settings: SiteSettings;
  onChange: (updated: SiteSettings) => void;
}

export const BirthdayMessageSection: React.FC<BirthdayMessageSectionProps> = ({ settings, onChange }) => {
  const updateField = (field: keyof SiteSettings, val: any) => {
    onChange({ ...settings, [field]: val });
  };

  const handleParagraphChange = (index: number, text: string) => {
    const updated = [...(settings.letterBody || [])];
    updated[index] = text;
    onChange({ ...settings, letterBody: updated });
  };

  const addParagraph = () => {
    const updated = [...(settings.letterBody || []), 'A new heartfelt message paragraph for the birthday celebration...'];
    onChange({ ...settings, letterBody: updated });
  };

  const removeParagraph = (index: number) => {
    const updated = (settings.letterBody || []).filter((_, i) => i !== index);
    onChange({ ...settings, letterBody: updated });
  };

  const moveParagraph = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const body = [...(settings.letterBody || [])];
    if (target < 0 || target >= body.length) return;
    const temp = body[index];
    body[index] = body[target];
    body[target] = temp;
    onChange({ ...settings, letterBody: body });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-rose-400" />
          <span>Heartfelt Birthday Letter & Message Editor</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Write and format the personal keepsake letter shown to the birthday person.
        </p>
      </div>

      <div className="space-y-4">
        {/* Letter Greeting Title */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <label className="block text-xs font-semibold text-rose-300 mb-1">
            Letter Heading Title *
          </label>
          <input
            type="text"
            value={settings.letterTitle}
            onChange={(e) => updateField('letterTitle', e.target.value)}
            placeholder="To Jawan, On Your 19th Milestone 👑"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Paragraphs Editor */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-200">
              Personal Letter Paragraphs ({settings.letterBody?.length || 0})
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-rose-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-3">
            {(settings.letterBody || []).map((paragraph, index) => (
              <div key={index} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-semibold text-rose-400">Paragraph #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, 'down')}
                      disabled={index === settings.letterBody.length - 1}
                      className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="p-1 hover:text-rose-400 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-400 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Signature & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Closing Signature *
            </label>
            <input
              type="text"
              value={settings.signatureName}
              onChange={(e) => updateField('signatureName', e.target.value)}
              placeholder="Forever With All Our Love, The Crew & Family 💕"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Date Stamp *
            </label>
            <input
              type="text"
              value={settings.dateStamp}
              onChange={(e) => updateField('dateStamp', e.target.value)}
              placeholder="22 September 2026"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Live Letter Card Preview */}
        <div className="p-6 rounded-3xl bg-amber-50/95 text-neutral-900 border border-amber-200/80 shadow-xl space-y-3 font-outfit relative">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2">
            <span className="text-xs font-bold text-rose-800 font-dancing text-lg">Keepsake Letter Preview</span>
            <span className="text-xs text-neutral-500 font-mono">{settings.dateStamp}</span>
          </div>

          <h3 className="font-playfair text-xl font-bold text-rose-950">
            {settings.letterTitle}
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed font-serif">
            {(settings.letterBody || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-3 border-t border-rose-200/60 flex items-center justify-between">
            <span className="font-dancing text-base sm:text-lg text-rose-800 font-bold">
              {settings.signatureName}
            </span>
            <div className="w-7 h-7 rounded-full bg-rose-600 text-amber-200 text-xs font-bold flex items-center justify-center shadow-xs">
              {settings.age}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
