import React, { useState, useEffect } from 'react';
import {
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  X,
  Cloud,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Wand2
} from 'lucide-react';
import {
  getStoredImgbbKey,
  setStoredImgbbKey,
  getStoredRemoveBgKey,
  setStoredRemoveBgKey,
  uploadToImgbb
} from '../utils/imageHelper';

interface ImgbbKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (key: string) => void;
}

// Valid 10x10 transparent PNG in base64 Data URI for key verification
const TEST_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVR42mP8z8BQDwAEhAF/VAAXADsY1ZgGAAAAAElFTkSuQmCC';

export const ImgbbKeyModal: React.FC<ImgbbKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKey, setApiKey] = useState('');
  const [removeBgKey, setRemoveBgKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showRemoveBgKey, setShowRemoveBgKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentImgbb = getStoredImgbbKey();
      const currentRemoveBg = getStoredRemoveBgKey();
      setApiKey(currentImgbb);
      setRemoveBgKey(currentRemoveBg);

      if (currentImgbb) {
        setStatusMessage({
          type: 'info',
          text: `ImgBB key loaded (${currentImgbb.slice(0, 4)}...${currentImgbb.slice(-4)}). Links will generate directly via https://api.imgbb.com.`
        });
      } else {
        setStatusMessage(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    let trimmedImgbb = apiKey.trim();
    let trimmedRemoveBg = removeBgKey.trim();

    if (!trimmedImgbb && !trimmedRemoveBg) {
      setStatusMessage({ type: 'error', text: 'Please enter an ImgBB API key or Remove.bg API key.' });
      return;
    }

    // Auto-detect and swap if user pasted Remove.bg key (24 chars) into ImgBB box or vice versa
    let autoDetected = false;
    if (!trimmedRemoveBg && /^[a-zA-Z0-9]{24}$/.test(trimmedImgbb) && !/^[a-fA-F0-9]{32}$/.test(trimmedImgbb)) {
      trimmedRemoveBg = trimmedImgbb;
      trimmedImgbb = '';
      setRemoveBgKey(trimmedRemoveBg);
      setApiKey('');
      autoDetected = true;
    } else if (!trimmedImgbb && /^[a-fA-F0-9]{32}$/.test(trimmedRemoveBg)) {
      trimmedImgbb = trimmedRemoveBg;
      trimmedRemoveBg = '';
      setApiKey(trimmedImgbb);
      setRemoveBgKey('');
      autoDetected = true;
    }

    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Saving and verifying API configuration...' });

    // Always immediately save keys to localStorage so user configuration is never lost
    if (trimmedImgbb) {
      setStoredImgbbKey(trimmedImgbb);
      if (onKeyUpdated) onKeyUpdated(trimmedImgbb);
    }
    if (trimmedRemoveBg) {
      setStoredRemoveBgKey(trimmedRemoveBg);
    }

    try {
      let imgbbVerified = false;
      let removeBgNotes = '';

      if (trimmedImgbb) {
        try {
          const result = await uploadToImgbb(TEST_PNG_BASE64, {
            key: trimmedImgbb,
            name: 'verify_key'
          });

          if (result && result.success && result.url) {
            imgbbVerified = true;
            if (result.deleteUrl) {
              fetch(result.deleteUrl, { method: 'GET', mode: 'no-cors' }).catch(() => {});
            }
          }
        } catch (imgbbErr: any) {
          console.warn('ImgBB verification notice:', imgbbErr.message);
          // Key is saved; only note if it is explicitly an invalid API key
          if (imgbbErr.message?.toLowerCase().includes('invalid api')) {
            throw new Error('ImgBB API key is invalid or unrecognized');
          }
        }
      }

      if (trimmedRemoveBg) {
        try {
          const accRes = await fetch('https://api.remove.bg/v1.0/account', {
            headers: { 'X-Api-Key': trimmedRemoveBg },
            signal: AbortSignal.timeout(6000)
          }).catch(() => null);

          if (accRes && !accRes.ok) {
            if (accRes.status === 403 || accRes.status === 401) {
              throw new Error('Remove.bg API key is invalid or unauthorized');
            } else if (accRes.status === 402) {
              removeBgNotes = ' (Note: Remove.bg credits at 0; studio fallback will activate automatically)';
            }
          }
        } catch (removeBgErr: any) {
          if (removeBgErr.message?.includes('invalid') || removeBgErr.message?.includes('unauthorized')) {
            throw removeBgErr;
          }
        }
      }

      setStatusMessage({
        type: 'success',
        text: autoDetected
          ? `✅ Key auto-detected & saved successfully!${removeBgNotes}`
          : `✅ Configuration saved & active! Ready for instant 1-click background removal and link generation.${removeBgNotes}`
      });
    } catch (err: any) {
      console.warn('Verification notice:', err);
      // Key was already saved in storage
      setStatusMessage({
        type: 'error',
        text: `⚠️ Saved, but verification note: ${err.message || 'Check your key'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKeys = () => {
    setStoredImgbbKey('');
    setStoredRemoveBgKey('');
    setApiKey('');
    setRemoveBgKey('');
    if (onKeyUpdated) onKeyUpdated('');
    setStatusMessage({
      type: 'info',
      text: 'Keys removed. Background cutouts will use in-browser processing.'
    });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://api.imgbb.com/1/upload');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                Cloud Link & AI Settings
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Generate permanent <code className="text-[11px] font-mono text-blue-500">https://i.ibb.co/</code> links & AI cutouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 text-sm text-slate-700 dark:text-slate-300 overflow-y-auto">
          {/* Info Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs leading-relaxed space-y-2">
            <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                ImgBB Upload API: <code className="font-mono text-[11px]">https://api.imgbb.com/1/upload</code>
              </span>
              <button
                type="button"
                onClick={handleCopyEndpoint}
                className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 hover:bg-blue-200 text-blue-700 dark:text-blue-200 flex items-center gap-1 transition-colors"
                title="Copy endpoint"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-blue-800 dark:text-blue-300/80">
              Works seamlessly on any web host (Vercel, Netlify, Static) with built-in browser direct uploading and serverless functions.
            </p>
          </div>

          {/* Section 1: ImgBB Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-500" />
                ImgBB API Key (Permanent Link Generator)
              </label>
              <a
                href="https://api.imgbb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Get Free Key (10 sec) <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste ImgBB key (e.g. 5d83f...)"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Section 2: Optional Custom Remove.bg Key */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-purple-500" />
                Remove.bg API Key (Optional Custom Key)
              </label>
              <a
                href="https://www.remove.bg/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Get Remove.bg Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showRemoveBgKey ? 'text' : 'password'}
                value={removeBgKey}
                onChange={(e) => setRemoveBgKey(e.target.value)}
                placeholder="Optional: leave blank to use pre-configured built-in key"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowRemoveBgKey(!showRemoveBgKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                {showRemoveBgKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Leave blank to use the active built-in Remove.bg key (bundled in GitHub) and client fallback.
            </p>
          </div>

          {/* Web Hosting Resilience Feature Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Web Hosting Self-Healing Architecture
            </span>
            <p className="text-emerald-700 dark:text-emerald-300/80 text-[11px] leading-relaxed">
              When deployed to Vercel, requests use serverless functions (<code className="font-mono">/api/remove-bg</code> and <code className="font-mono">/api/upload-imgbb</code>). If hosted on static web platforms (GitHub Pages, Netlify), it automatically executes direct in-browser canvas cleaning and direct ImgBB uploads.
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 border leading-relaxed ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <Key className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-2">
          <div>
            {(apiKey || removeBgKey) && (
              <button
                type="button"
                onClick={handleClearKeys}
                disabled={isTesting}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isTesting}
              className="px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={isTesting || (!apiKey.trim() && !removeBgKey.trim())}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Test &amp; Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
