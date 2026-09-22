import React, { useRef, useState } from 'react';
import { FullWebsiteData } from '../../../types';
import { Settings, RefreshCw, Download, Upload, ShieldCheck, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface GeneralSettingsSectionProps {
  data: FullWebsiteData;
  onResetToDefault: () => void;
  onImportData: (imported: FullWebsiteData) => void;
}

export const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({
  data,
  onResetToDefault,
  onImportData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `birthday-cms-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings && parsed.memories && parsed.photos) {
          onImportData(parsed);
          setImportStatus('Website backup data imported successfully!');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          alert('Invalid backup file format. Missing required fields.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-400" />
          <span>Database & Backup Management</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Export backup copies of memories and photos, restore defaults, or inspect database status.
        </p>
      </div>

      {importStatus && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Database Status Card */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Full-Stack JSON Database</h4>
            <p className="text-[11px] text-neutral-400">
              Persisted server-side in <code className="text-rose-300 font-mono text-[10px]">data/database.json</code>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
          ● Synced & Live
        </span>
      </div>

      {/* Backup and Restore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export JSON */}
        <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export Backup File</span>
          </h4>
          <p className="text-[11px] text-neutral-400">
            Download an offline JSON snapshot containing all website text, photos, and scrapbook memories.
          </p>
          <button
            type="button"
            onClick={handleExportJson}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json Backup</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Restore / Import Backup</span>
          </h4>
          <p className="text-[11px] text-neutral-400">
            Upload a previously exported backup file to restore website content immediately.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Select Backup File</span>
          </button>
        </div>
      </div>

      {/* Reset to Default */}
      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Reset Website to Default Content</span>
            </h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Restores the factory celebration content for Jawan Urnaw's 19th Birthday.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-700 cursor-pointer"
          >
            Reset All
          </button>
        </div>

        {showResetConfirm && (
          <div className="p-3 bg-neutral-950 rounded-xl border border-rose-600/50 space-y-2 text-xs">
            <p className="text-rose-200">
              Are you sure? This will replace your current edits with the original celebration preset.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetToDefault();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Credentials info */}
      <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-neutral-200">Server Authentication Protected</p>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Admin sessions are verified on the Express backend via bearer authentication tokens. Passwords and secret keys are stored securely on the backend server environment and never exposed in public client bundles.
          </p>
        </div>
      </div>
    </div>
  );
};
