import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneType, MemoryItem, Album, BirthdayWish, CelebrationSettings, FullWebsiteData } from './types';
import { initialMemories, initialAlbums, initialWishes, defaultSettings } from './data/memories';
import { CurtainScene } from './components/CurtainScene';
import { AgeCountdownScene } from './components/AgeCountdownScene';
import { BalloonGameScene } from './components/BalloonGameScene';
import { PaintWipeScene } from './components/PaintWipeScene';
import { CelebrationSurpriseScene } from './components/CelebrationSurpriseScene';
import { MemoryBookScene } from './components/MemoryBookScene';
import { TicTacToeGame } from './components/TicTacToeGame';
import { SoundControl } from './components/SoundControl';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { Film, Shield, Settings } from 'lucide-react';
import { soundManager } from './utils/audio';

const AUTH_STORAGE_KEY = 'birthday_admin_jwt';

export default function App() {
  // Routing State
  const [route, setRoute] = useState<'public' | 'admin' | 'admin-login'>('public');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  // Scene state for public celebration
  const [currentScene, setCurrentScene] = useState<SceneType>('curtain');
  const [showSceneNav, setShowSceneNav] = useState<boolean>(false);

  // Dynamic Site Data (Synchronized with backend /api/public/data)
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [wishes, setWishes] = useState<BirthdayWish[]>(initialWishes);
  const [settings, setSettings] = useState<CelebrationSettings>(defaultSettings);
  const [fullData, setFullData] = useState<FullWebsiteData | null>(null);

  // Determine route based on current URL path or hash
  const determineRoute = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    const isLogin = path === '/admin/login' || hash === '#/admin/login';
    const isAdmin =
      path === '/admin' ||
      path.startsWith('/admin/') ||
      hash === '#/admin' ||
      hash.startsWith('#/admin') ||
      hash === '#admin';

    if (isLogin) {
      setRoute('admin-login');
    } else if (isAdmin) {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (token) {
        setAdminToken(token);
        setRoute('admin');
      } else {
        setRoute('admin-login');
        if (window.location.pathname !== '/admin/login') {
          window.history.replaceState(null, '', '/admin/login');
        }
      }
    } else {
      setRoute('public');
    }
  }, []);

  // Listen to popstate and hashchange
  useEffect(() => {
    determineRoute();
    window.addEventListener('popstate', determineRoute);
    window.addEventListener('hashchange', determineRoute);
    return () => {
      window.removeEventListener('popstate', determineRoute);
      window.removeEventListener('hashchange', determineRoute);
    };
  }, [determineRoute]);

  // Fetch live public data from server
  const loadPublicData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setFullData(d);
        if (d.memories && Array.isArray(d.memories) && d.memories.length > 0) {
          setMemories(d.memories);
        }
        if (d.wishes && Array.isArray(d.wishes)) {
          setWishes(d.wishes);
        }
        if (d.settings) {
          setSettings({
            personName: d.settings.personName || defaultSettings.personName,
            age: d.settings.age || defaultSettings.age,
            subTitle: d.settings.subtitle || defaultSettings.subTitle,
            letterTitle: d.settings.letterTitle || defaultSettings.letterTitle,
            letterBody: d.settings.letterBody || defaultSettings.letterBody,
            signatureName: d.settings.signatureName || defaultSettings.signatureName,
            dateStamp: d.settings.dateStamp || defaultSettings.dateStamp,
            memoryAlbumTitle: d.settings.memoryAlbumTitle || defaultSettings.memoryAlbumTitle,
            memoryAlbumSubtitle: d.settings.memoryAlbumSubtitle || defaultSettings.memoryAlbumSubtitle,
            buttonText: d.settings.buttonText || defaultSettings.buttonText,
            footerText: d.settings.footerText || defaultSettings.footerText,
            heroText: d.settings.heroText || defaultSettings.heroText,
            mainTitle: d.settings.mainTitle || defaultSettings.mainTitle,
            birthdayMessage: d.settings.birthdayMessage || defaultSettings.birthdayMessage,
          });
        }
        if (d.music) {
          if (d.music.audioUrl) {
            soundManager.setCustomAudioUrl(d.music.audioUrl);
          }
          if (d.music.volume !== undefined) {
            soundManager.setVolume(d.music.volume / 100);
          }
        }
      }
    } catch (e) {
      console.warn('Using local celebration state:', e);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // Navigation handlers
  const handleLoginSuccess = (token: string) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, token);
    } catch {
      // Ignored
    }
    setAdminToken(token);
    window.history.pushState(null, '', '/admin');
    setRoute('admin');
  };

  const handleLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // Ignored
      }
    }
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignored
    }
    setAdminToken(null);
    window.history.pushState(null, '', '/admin/login');
    setRoute('admin-login');
  };

  const goToPublic = () => {
    window.history.pushState(null, '', '/');
    setRoute('public');
    loadPublicData();
  };

  const goToAdmin = () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      setAdminToken(token);
      window.history.pushState(null, '', '/admin');
      setRoute('admin');
    } else {
      window.history.pushState(null, '', '/admin/login');
      setRoute('admin-login');
    }
  };

  const handleDataSaved = (savedData: FullWebsiteData) => {
    setFullData(savedData);
    if (savedData.memories) setMemories(savedData.memories);
    if (savedData.wishes) setWishes(savedData.wishes);
    if (savedData.settings) {
      setSettings({
        personName: savedData.settings.personName || defaultSettings.personName,
        age: savedData.settings.age || defaultSettings.age,
        subTitle: savedData.settings.subtitle || defaultSettings.subTitle,
        letterTitle: savedData.settings.letterTitle || defaultSettings.letterTitle,
        letterBody: savedData.settings.letterBody || defaultSettings.letterBody,
        signatureName: savedData.settings.signatureName || defaultSettings.signatureName,
        dateStamp: savedData.settings.dateStamp || defaultSettings.dateStamp,
        memoryAlbumTitle: savedData.settings.memoryAlbumTitle || defaultSettings.memoryAlbumTitle,
        memoryAlbumSubtitle: savedData.settings.memoryAlbumSubtitle || defaultSettings.memoryAlbumSubtitle,
        buttonText: savedData.settings.buttonText || defaultSettings.buttonText,
        footerText: savedData.settings.footerText || defaultSettings.footerText,
        heroText: savedData.settings.heroText || defaultSettings.heroText,
        mainTitle: savedData.settings.mainTitle || defaultSettings.mainTitle,
        birthdayMessage: savedData.settings.birthdayMessage || defaultSettings.birthdayMessage,
      });
    }
  };

  const handleAddWish = async (newWish: BirthdayWish) => {
    setWishes((prev) => [newWish, ...prev]);
    try {
      await fetch('/api/public/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish),
      });
    } catch {
      // Local fallback retained
    }
  };

  const goToScene = (scene: SceneType) => {
    setCurrentScene(scene);
  };

  // -------------------------------------------------------------
  // RENDER: ADMIN LOGIN PAGE (/admin/login)
  // -------------------------------------------------------------
  if (route === 'admin-login') {
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToPublic={goToPublic}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER: PROTECTED ADMIN DASHBOARD (/admin)
  // -------------------------------------------------------------
  if (route === 'admin') {
    if (!adminToken) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoToPublic={goToPublic}
        />
      );
    }
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleLogout}
        onViewPublic={goToPublic}
        initialData={fullData || undefined}
        onDataSaved={handleDataSaved}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER: PUBLIC BIRTHDAY WEBSITE (Zero admin buttons visible)
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-black text-neutral-100 flex items-center justify-center font-outfit overflow-x-hidden">
      {/* Background Ambience on Desktop */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-neutral-950 to-black pointer-events-none" />

      {/* Floating Audio & Music Sound Controls */}
      <SoundControl />

      {/* Top Left Navigation Controls (Scene Jump + Admin Panel Link) */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        <button
          id="btn-toggle-scene-nav"
          onClick={() => setShowSceneNav(!showSceneNav)}
          title="Jump to any scene"
          className="p-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700/80 text-neutral-400 hover:text-amber-400 text-xs cursor-pointer shadow-lg shadow-black/40 transition-colors"
        >
          <Film className="w-3.5 h-3.5" />
        </button>

        {/* Dedicated Admin Link Button on User Panel */}
        <button
          id="btn-goto-admin-floating"
          onClick={goToAdmin}
          title="Open Admin Studio CMS Panel"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-800 backdrop-blur-md border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-semibold cursor-pointer shadow-lg shadow-black/40 transition-all hover:scale-105"
        >
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-[11px] font-bold">Admin CMS</span>
        </button>
      </div>

      {/* Scene Quick Jump Menu */}
      <AnimatePresence>
        {showSceneNav && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-4 z-50 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 text-xs min-w-[210px]"
          >
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Jump to Scene:
            </div>
            {(
              [
                { id: 'curtain', label: '1. Curtains Opening 🎭' },
                { id: 'countdown', label: '2. Age Leap ⚡' },
                { id: 'balloon-game', label: '3. Balloon Hunter 🎈' },
                { id: 'paint-wipe', label: '4. Paint Wipe Reveal 🎨' },
                { id: 'fireworks-surprise', label: '5. Fireworks & Surprise 🎆' },
                { id: 'memory-book', label: '6. 3D Memory Book & Albums 📖' },
                { id: 'tictactoe', label: '7. Birthday Tic-Tac-Toe 🎮' },
              ] as const
            ).map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  goToScene(sc.id);
                  setShowSceneNav(false);
                }}
                className={`text-left px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  currentScene === sc.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {sc.label}
              </button>
            ))}

            <div className="my-1 border-t border-neutral-800" />
            <button
              id="btn-jump-to-admin-menu"
              onClick={() => {
                setShowSceneNav(false);
                goToAdmin();
              }}
              className="text-left px-3 py-1.5 rounded-xl transition-colors cursor-pointer bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 hover:text-rose-200 font-bold flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin CMS Panel</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                CMS
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Responsive Phone View Container */}
      <div
        id="phone-view-frame"
        className="relative w-full h-[100dvh] sm:h-[94vh] sm:max-h-[920px] max-w-md sm:rounded-[38px] overflow-hidden bg-neutral-950 sm:border-[6px] sm:border-neutral-800/80 sm:shadow-[0_0_80px_rgba(245,158,11,0.25)] flex flex-col"
      >
        {/* Dynamic Animated Scene Transition Container */}
        <div className="relative w-full h-full flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {currentScene === 'curtain' && (
              <motion.div
                key="scene-curtain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col"
              >
                <CurtainScene
                  onOpen={() => goToScene('countdown')}
                  personName={settings.personName}
                  age={settings.age}
                />
              </motion.div>
            )}

            {currentScene === 'countdown' && (
              <motion.div
                key="scene-countdown"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col"
              >
                <AgeCountdownScene
                  onComplete={() => goToScene('balloon-game')}
                  personName={settings.personName}
                  targetAge={settings.age}
                />
              </motion.div>
            )}

            {currentScene === 'balloon-game' && (
              <motion.div
                key="scene-balloon-game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col"
              >
                <BalloonGameScene
                  onRedBalloonPopped={() => goToScene('paint-wipe')}
                  personName={settings.personName}
                  age={settings.age}
                />
              </motion.div>
            )}

            {currentScene === 'paint-wipe' && (
              <motion.div
                key="scene-paint-wipe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col"
              >
                <PaintWipeScene
                  onWipeComplete={() => goToScene('fireworks-surprise')}
                  personName={settings.personName}
                  age={settings.age}
                />
              </motion.div>
            )}

            {currentScene === 'fireworks-surprise' && (
              <motion.div
                key="scene-fireworks-surprise"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: 'brightness(1.5)' }}
                transition={{ duration: 0.6 }}
                className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col"
              >
                <CelebrationSurpriseScene
                  onOpenBook={() => goToScene('memory-book')}
                  personName={settings.personName}
                  age={settings.age}
                />
              </motion.div>
            )}

            {currentScene === 'memory-book' && (
              <motion.div
                key="scene-memory-book"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full flex flex-col"
              >
                <MemoryBookScene
                  onRestart={() => goToScene('curtain')}
                  memories={memories}
                  albums={albums}
                  wishes={wishes}
                  onAddWish={handleAddWish}
                  settings={settings}
                  tictactoeSettings={fullData?.tictactoe || fullData?.tictactoe_settings}
                  onOpenAdmin={goToAdmin}
                />
              </motion.div>
            )}

            {currentScene === 'tictactoe' && (
              <motion.div
                key="scene-tictactoe"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col"
              >
                <TicTacToeGame
                  settings={fullData?.tictactoe || fullData?.tictactoe_settings}
                  onBackToMemories={() => goToScene('memory-book')}
                  onBackToBirthday={() => goToScene('curtain')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
