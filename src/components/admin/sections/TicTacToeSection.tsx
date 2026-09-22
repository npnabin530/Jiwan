import React from 'react';
import { TicTacToeSettings } from '../../../types';
import { Gamepad2, Bot, Sparkles, Volume2, Trophy, Heart } from 'lucide-react';

interface TicTacToeSectionProps {
  tictactoe?: TicTacToeSettings;
  onChange: (updated: TicTacToeSettings) => void;
}

const DEFAULT_SETTINGS: TicTacToeSettings = {
  enabled: true,
  gameTitle: '🎂 TIC-TAC-TOE',
  gameSubtitle: 'You vs Robot 🤖',
  playerName: 'You',
  robotName: 'Robot',
  playerEmoji: '💗',
  robotEmoji: '🤖',
  defaultDifficulty: 'medium',
  backgroundStyle: 'cream-pink',
  confettiEnabled: true,
  soundEnabled: true,
  winMessage: 'You defeated the birthday robot! 🎂✨',
  loseMessage: 'The robot got this one! Try again? 😄',
  drawMessage: 'Perfectly matched! 💕',
};

export const TicTacToeSection: React.FC<TicTacToeSectionProps> = ({
  tictactoe = DEFAULT_SETTINGS,
  onChange,
}) => {
  const settings = { ...DEFAULT_SETTINGS, ...tictactoe };

  const updateField = (field: keyof TicTacToeSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-rose-400" />
          <span>Tic-Tac-Toe Mini-Game Settings</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure the birthday Tic-Tac-Toe vs Robot mini-game titles, emojis, messages, and AI difficulty.
        </p>
      </div>

      {/* Main Enable / Disable Switch */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Enable Tic-Tac-Toe Mini-Game</span>
            {settings.enabled ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-bold">
                DISABLED
              </span>
            )}
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            When enabled, visitors can launch the cute mini-game directly from the memory album or scene navigator.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
        </label>
      </div>

      {/* Game Titles & Identity */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Game Titles & Branding</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Game Card Title</label>
            <input
              type="text"
              value={settings.gameTitle}
              onChange={(e) => updateField('gameTitle', e.target.value)}
              placeholder="🎂 TIC-TAC-TOE"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Game Subtitle</label>
            <input
              type="text"
              value={settings.gameSubtitle}
              onChange={(e) => updateField('gameSubtitle', e.target.value)}
              placeholder="You vs Robot 🤖"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Players & Emojis Customization */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" />
          <span>Player & Robot Customization</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player Configuration */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <span>{settings.playerEmoji}</span>
              <span>Human Player (Visitor)</span>
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Player Display Name</label>
              <input
                type="text"
                value={settings.playerName}
                onChange={(e) => updateField('playerName', e.target.value)}
                placeholder="You"
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Player Symbol / Emoji</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.playerEmoji}
                  onChange={(e) => updateField('playerEmoji', e.target.value)}
                  placeholder="💗"
                  className="w-16 text-center text-base px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-rose-500"
                />
                <div className="flex items-center gap-1">
                  {['💗', '🌸', '👑', '⭐', '🎈'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => updateField('playerEmoji', em)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-all ${
                        settings.playerEmoji === em
                          ? 'bg-rose-500 text-white ring-2 ring-rose-400/50'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Robot Configuration */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>{settings.robotEmoji}</span>
              <span>Robot Opponent (AI)</span>
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Robot Display Name</label>
              <input
                type="text"
                value={settings.robotName}
                onChange={(e) => updateField('robotName', e.target.value)}
                placeholder="Robot"
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Robot Symbol / Emoji</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.robotEmoji}
                  onChange={(e) => updateField('robotEmoji', e.target.value)}
                  placeholder="🤖"
                  className="w-16 text-center text-base px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center gap-1">
                  {['🤖', '🧁', '🐱', '🚀', '⚡'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => updateField('robotEmoji', em)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-all ${
                        settings.robotEmoji === em
                          ? 'bg-amber-500 text-white ring-2 ring-amber-400/50'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty & Gameplay Options */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Difficulty & Effects</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Default Difficulty</label>
            <select
              value={settings.defaultDifficulty}
              onChange={(e) => updateField('defaultDifficulty', e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="easy">🌱 Easy (Silly & Casual)</option>
              <option value="medium">⭐ Medium (Smart & Balanced)</option>
              <option value="hard">👑 Hard (Unbeatable Minimax)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Confetti on Win</span>
              </span>
              <p className="text-[10px] text-neutral-400">Burst confetti on player win</p>
            </div>
            <input
              type="checkbox"
              checked={settings.confettiEnabled}
              onChange={(e) => updateField('confettiEnabled', e.target.checked)}
              className="accent-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-rose-400" />
                <span>Sound FX</span>
              </span>
              <p className="text-[10px] text-neutral-400">Tap, beep, and victory audio</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateField('soundEnabled', e.target.checked)}
              className="accent-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Outcome Messages */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" />
          <span>Outcome Celebratory Messages</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              🎉 Player Win Message
            </label>
            <input
              type="text"
              value={settings.winMessage}
              onChange={(e) => updateField('winMessage', e.target.value)}
              placeholder="You defeated the birthday robot! 🎂✨"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              🤖 Robot Win Message
            </label>
            <input
              type="text"
              value={settings.loseMessage}
              onChange={(e) => updateField('loseMessage', e.target.value)}
              placeholder="The robot got this one! Try again? 😄"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              ✨ Draw / Tie Message
            </label>
            <input
              type="text"
              value={settings.drawMessage}
              onChange={(e) => updateField('drawMessage', e.target.value)}
              placeholder="Perfectly matched! 💕"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
