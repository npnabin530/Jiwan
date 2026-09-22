import React, { useState, useEffect } from 'react';
import { FullWebsiteData } from '../../types';
import {
  Type,
  Image as ImageIcon,
  BookOpen,
  Music,
  Palette,
  Clock,
  Film,
  Mail,
  Sparkles,
  Settings,
  Save,
  ExternalLink,
  LogOut,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Shield,
  Gamepad2,
} from 'lucide-react';
import { WebsiteSettingsSection } from './sections/WebsiteSettingsSection';
import { PhotosSection } from './sections/PhotosSection';
import { MemoriesSection } from './sections/MemoriesSection';
import { MusicSection } from './sections/MusicSection';
import { ThemeSection } from './sections/ThemeSection';
import { CountdownSection } from './sections/CountdownSection';
import { CurtainIntroSection } from './sections/CurtainIntroSection';
import { BirthdayMessageSection } from './sections/BirthdayMessageSection';
import { AnimationsSection } from './sections/AnimationsSection';
import { TicTacToeSection } from './sections/TicTacToeSection';
import { GeneralSettingsSection } from './sections/GeneralSettingsSection';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onViewPublic: () => void;
  initialData?: FullWebsiteData;
  onDataSaved?: (data: FullWebsiteData) => void;
}

type TabType =
  | 'settings'
  | 'photos'
  | 'memories'
  | 'music'
  | 'theme'
  | 'countdown'
  | 'curtain'
  | 'message'
  | 'animations'
  | 'tictactoe'
  | 'general';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onViewPublic,
  initialData,
  onDataSaved,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [data, setData] = useState<FullWebsiteData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch full data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          onLogout();
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, onLogout]);

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveAll = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save changes to database');
      }

      setHasUnsavedChanges(false);
      if (onDataSaved) {
        onDataSaved(data);
      }
      showToast('All changes saved to server database! 🎉');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Save failed: ${err.message}`);
      } else {
        alert('Save failed. Please check network connection.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await fetch('/api/admin/reset-defaults', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setHasUnsavedChanges(false);
        if (onDataSaved) onDataSaved(json.data);
        showToast('Website restored to factory defaults!');
      }
    } catch (err) {
      alert('Failed to reset defaults');
    }
  };

  const handleImportData = (imported: FullWebsiteData) => {
    setData(imported);
    setHasUnsavedChanges(true);
    showToast('Imported snapshot. Click Save to persist.');
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#0d090a] text-white flex items-center justify-center font-outfit">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-400">Loading Birthday CMS Control Panel...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'settings', label: 'Website Text', icon: Type },
    { id: 'photos', label: `Photos (${data.photos.length})`, icon: ImageIcon },
    { id: 'memories', label: `Memories (${data.memories.length})`, icon: BookOpen },
    { id: 'music', label: 'Music & Audio', icon: Music },
    { id: 'theme', label: 'Theme & Colors', icon: Palette },
    { id: 'countdown', label: 'Countdown Clock', icon: Clock },
    { id: 'curtain', label: 'Curtain & Scenes', icon: Film },
    { id: 'message', label: 'Letter & Message', icon: Mail },
    { id: 'animations', label: 'Animation Effects', icon: Sparkles },
    { id: 'tictactoe', label: 'Tic-Tac-Toe Game 🎮', icon: Gamepad2 },
    { id: 'general', label: 'Database & Backup', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0c090a] text-neutral-100 flex flex-col font-outfit">
      {/* Top Navbar */}
      <header className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-neutral-950 flex items-center justify-center">
                <Shield className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair font-bold text-sm sm:text-base text-white">
                  Birthday Studio CMS
                </span>
                {hasUnsavedChanges && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:block">
                Celebrating {data.settings.personName} • Chapter {data.settings.age}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Public Website / User Panel */}
          <button
            id="btn-admin-view-user-panel"
            onClick={onViewPublic}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Open User Birthday Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>🎂 View User Website</span>
          </button>

          {/* Save All Changes */}
          <button
            id="btn-save-all-cms"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-rose-500/25 ring-2 ring-rose-400/50 animate-pulse'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Log Out of Admin Panel"
            className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-950/60 p-4 shrink-0 hidden md:flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <button
              id="btn-sidebar-view-user-site"
              onClick={onViewPublic}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 hover:from-rose-500/25 hover:to-amber-500/25 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/40 shadow-xs cursor-pointer transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>🎂 Go to User Website</span>
            </button>
            <div className="text-[11px] text-neutral-500 space-y-1">
              <p>Database: Synced (JSON)</p>
              <p className="text-[10px]">Tip: Press Ctrl+S to save anytime</p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-neutral-950 p-4 flex flex-col justify-between border-r border-neutral-800">
              <nav className="space-y-1">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-800">
                  <span className="font-playfair font-bold text-sm text-white">Sections</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer text-left ${
                        isActive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="space-y-2 pt-3 border-t border-neutral-800">
                <button
                  id="btn-mobile-view-user-site"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onViewPublic();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-950/40 text-rose-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-rose-500/30 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>🎂 Go to User Website</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2 rounded-xl bg-neutral-900 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {activeTab === 'settings' && (
            <WebsiteSettingsSection
              settings={data.settings}
              onChange={(updated) => {
                setData({ ...data, settings: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'photos' && (
            <PhotosSection
              photos={data.photos}
              onChange={(updated) => {
                setData({ ...data, photos: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'memories' && (
            <MemoriesSection
              memories={data.memories}
              onChange={(updated) => {
                setData({ ...data, memories: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'music' && (
            <MusicSection
              music={data.music}
              onChange={(updated) => {
                setData({ ...data, music: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeSection
              theme={data.theme}
              onChange={(updated) => {
                setData({ ...data, theme: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'countdown' && (
            <CountdownSection
              countdown={data.countdown}
              onChange={(updated) => {
                setData({ ...data, countdown: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'curtain' && (
            <CurtainIntroSection
              curtain={data.curtain}
              onChange={(updated) => {
                setData({ ...data, curtain: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'message' && (
            <BirthdayMessageSection
              settings={data.settings}
              onChange={(updated) => {
                setData({ ...data, settings: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'animations' && (
            <AnimationsSection
              animations={data.animations}
              onChange={(updated) => {
                setData({ ...data, animations: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'tictactoe' && (
            <TicTacToeSection
              tictactoe={data.tictactoe || data.tictactoe_settings}
              onChange={(updated) => {
                setData({ ...data, tictactoe: updated, tictactoe_settings: updated });
                setHasUnsavedChanges(true);
              }}
            />
          )}

          {activeTab === 'general' && (
            <GeneralSettingsSection
              data={data}
              onResetToDefault={handleResetToDefault}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>

      {/* Floating Save Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-emerald-200 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
