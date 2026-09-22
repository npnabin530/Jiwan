import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, Sparkles, Heart, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, user: { email: string }) => void;
  onGoToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onGoToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials. Please verify email and password.');
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#ffffff'],
      });

      onLoginSuccess(data.token, data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDefaultDemo = () => {
    setEmail('admin@birthday.love');
    setPassword('birthday2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#0d090a] text-neutral-100 flex items-center justify-center p-4 relative overflow-hidden font-outfit">
      {/* Background Romantic Ambient Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-rose-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Cute Card Container */}
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 relative">
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/30 mb-3 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-neutral-950 flex items-center justify-center">
                <Lock className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Access Only</span>
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Birthday CMS Studio
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Private control panel to customize photos, memories, songs, theme & heartfelt messages.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin Email</span>
              </label>
              <input
                id="input-admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@birthday.love"
                className="w-full bg-neutral-950/80 border border-neutral-700 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Password</span>
              </label>
              <div className="relative">
                <input
                  id="input-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-950/80 border border-neutral-700 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-admin-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
            <button
              type="button"
              onClick={fillDefaultDemo}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Click to auto-fill default admin credentials</span>
            </button>
            <p className="text-[11px] text-neutral-500 mt-1">
              (admin@birthday.love / birthday2026!)
            </p>
          </div>

          {/* Back to public user website link */}
          <div className="mt-4 pt-3 border-t border-neutral-800 text-center">
            <button
              id="btn-login-return-to-user-website"
              type="button"
              onClick={onGoToPublic}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors cursor-pointer"
            >
              <span>🎂 Return to Birthday Website (User Panel)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
