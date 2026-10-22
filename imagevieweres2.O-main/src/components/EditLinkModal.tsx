import React, { useState, useEffect } from 'react';
import { X, Check, Link2, Clipboard, ExternalLink, Image as ImageIcon, AlertTriangle, Sparkles, Loader2, Cloud, UploadCloud, Key } from 'lucide-react';
import { ImageItem } from '../types';
import {
  BROKEN_IMG_SVG,
  isRemoteImageUrl,
  requestRemoveBg,
  uploadToImgbb,
  getStoredImgbbKey,
  getStoredRemoveBgKey,
  getAcceleratedImageUrl
} from '../utils/imageHelper';

interface EditLinkModalProps {
  item: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLink: (itemId: number, newLink: string) => void;
  onOpenImgbbSettings?: () => void;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveLink,
  onOpenImgbbSettings
}) => {
  const [newLink, setNewLink] = useState('');
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isUploadingImgbb, setIsUploadingImgbb] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (item) {
      setNewLink(item.link);
      setTestSuccess(null);
      setStatusMsg('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleTestLink = () => {
    if (!newLink.trim()) {
      setTestSuccess(false);
      return;
    }
    setIsTesting(true);
    const img = new Image();
    img.src = newLink.trim();
    img.onload = () => {
      setIsTesting(false);
      setTestSuccess(true);
    };
    img.onerror = () => {
      setIsTesting(false);
      setTestSuccess(false);
    };
  };

  const handleRemoveBgInModal = async (bgColor: 'white' | 'transparent' = 'white') => {
    const targetUrl = newLink.trim() || item.link;
    if (!targetUrl) return;

    setIsRemovingBg(true);
    const currentImgbbKey = getStoredImgbbKey();
    const currentRemoveBgKey = getStoredRemoveBgKey();
    setStatusMsg(
      currentImgbbKey
        ? 'Removing background & generating ImgBB link (api.imgbb.com)...'
        : 'Removing background via Remove.bg...'
    );

    try {
      const res = await requestRemoveBg(targetUrl, {
        bgColor,
        name: `${item.sku || 'sku'}_nobg`,
        imgbbKey: currentImgbbKey || undefined,
        removeBgKey: currentRemoveBgKey || undefined
      });

      if (res.success) {
        const finalLink = res.imgbbUrl || res.link || res.localHostedUrl || res.dataUri;
        if (finalLink) {
          setNewLink(finalLink);
          setTestSuccess(true);
        }

        if (res.imgbbUrl) {
          setStatusMsg(`✨ Background removed & uploaded to ImgBB! (${res.imgbbUrl})`);
        } else if (res.imgbbError) {
          setStatusMsg(`✨ Background removed! (ImgBB: ${res.imgbbError} - used server-hosted link)`);
        } else {
          setStatusMsg('✨ Background removed successfully! Click Apply to save.');
        }
      } else {
        throw new Error(res.message || 'Processing failed');
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg(`❌ Remove.bg error: ${err.message || 'Failed'}`);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleUploadCurrentToImgbb = async () => {
    const target = newLink.trim();
    if (!target) return;

    const imgbbKey = getStoredImgbbKey();
    if (!imgbbKey) {
      if (onOpenImgbbSettings) {
        onOpenImgbbSettings();
      }
      setStatusMsg('⚡ Please configure your free ImgBB API key first in Settings (api.imgbb.com)');
      return;
    }

    setIsUploadingImgbb(true);
    setStatusMsg('Uploading image to https://api.imgbb.com/1/upload...');

    try {
      const result = await uploadToImgbb(target, {
        key: imgbbKey,
        name: `${item.sku || 'image'}_hosted`
      });

      if (result && result.success && result.url) {
        setNewLink(result.url);
        setTestSuccess(true);
        setStatusMsg(`✅ Uploaded to ImgBB: ${result.url}`);
      } else {
        throw new Error('Upload returned no URL');
      }
    } catch (err: any) {
      console.error('ImgBB upload error:', err);
      setStatusMsg(`❌ ImgBB upload error: ${err.message || 'Failed'}`);
    } finally {
      setIsUploadingImgbb(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setNewLink(text.trim());
        setTestSuccess(null);
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleSave = () => {
    const trimmed = newLink.trim();
    if (!trimmed) {
      alert('Please enter a valid image URL');
      return;
    }
    onSaveLink(item.id, trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">Change Image Link &amp; Editor</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">SKU: <span className="font-semibold text-amber-600 dark:text-amber-400">{item.sku}</span> • Image #{item.imgNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* Visual comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Original Image</h3>
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <img
                  src={item.originalLink || BROKEN_IMG_SVG}
                  alt={`Amazon product ${item.sku} original image ${item.imgNo}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (item.originalLink && !target.src.includes('weserv.nl')) {
                      target.src = getAcceleratedImageUrl(item.originalLink);
                    } else {
                      target.src = BROKEN_IMG_SVG;
                    }
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">New Preview</h3>
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <img
                  src={newLink.trim() || BROKEN_IMG_SVG}
                  alt={`Amazon product ${item.sku} edited preview image ${item.imgNo}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const trimmed = newLink.trim();
                    if (trimmed && !target.src.includes('weserv.nl') && !trimmed.startsWith('data:')) {
                      target.src = getAcceleratedImageUrl(trimmed);
                    } else {
                      target.src = BROKEN_IMG_SVG;
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Link input field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                Image URL Address
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* 1-Click Remove BG Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveBgInModal('white')}
                  disabled={isRemovingBg}
                  className="text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 bg-emerald-500/15 hover:bg-emerald-500/25 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 transition-colors font-bold disabled:opacity-40"
                  title="Single-Click AI Remove Background via Remove.bg (Amazon Pure White)"
                >
                  {isRemovingBg ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-emerald-500" />}
                  <span>{isRemovingBg ? 'Working...' : 'Remove BG'}</span>
                </button>

                {/* Upload to ImgBB Button */}
                <button
                  type="button"
                  onClick={handleUploadCurrentToImgbb}
                  disabled={isUploadingImgbb || !newLink.trim()}
                  className="text-xs text-blue-700 dark:text-blue-300 hover:text-blue-800 bg-blue-500/15 hover:bg-blue-500/25 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1 transition-colors font-bold disabled:opacity-40"
                  title="Upload to api.imgbb.com/1/upload to generate permanent hosted link"
                >
                  {isUploadingImgbb ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3 text-blue-500" />}
                  <span>{isUploadingImgbb ? 'Uploading...' : 'To ImgBB'}</span>
                </button>

                {onOpenImgbbSettings && (
                  <button
                    type="button"
                    onClick={onOpenImgbbSettings}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 p-0.5 rounded transition-colors"
                    title="Configure ImgBB API Key"
                  >
                    <Key className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20 transition-colors"
                >
                  <Clipboard className="w-3 h-3" />
                  Paste
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={newLink}
                onChange={(e) => {
                  setNewLink(e.target.value);
                  setTestSuccess(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                placeholder="https://images.example.com/product.jpg"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono transition-all pr-20"
              />
              <button
                type="button"
                onClick={handleTestLink}
                disabled={isTesting}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-300 dark:border-slate-700"
              >
                {isTesting ? 'Testing...' : 'Test URL'}
              </button>
            </div>

            {/* Status Message (Remove.bg or ImgBB result) */}
            {statusMsg && (
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between font-mono">
                <span className="truncate pr-2">{statusMsg}</span>
                {newLink.includes('ibb.co') && (
                  <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-bold bg-blue-500 text-white rounded">
                    ImgBB Hosted
                  </span>
                )}
              </div>
            )}

            {/* Test feedback */}
            {testSuccess === true && !statusMsg && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <Check className="w-3.5 h-3.5" /> Image loaded successfully!
              </p>
            )}
            {testSuccess === false && (
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Warning: Could not verify image load. Check URL or CORS settings.
              </p>
            )}
            {!isRemoteImageUrl(newLink) && newLink.length > 0 && !newLink.startsWith('data:') && (
              <p className="text-xs text-amber-600 dark:text-amber-400/90 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Local path or non-HTTP URL detected. Remote HTTP/HTTPS URLs are recommended.
              </p>
            )}
          </div>

          {/* Direct external open test */}
          {newLink && isRemoteImageUrl(newLink) && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Test in external tab:</span>
              <a
                href={newLink}
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-mono"
              >
                Open link in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 sm:px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-colors shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Apply &amp; Update Excel Cell
          </button>
        </div>

      </div>
    </div>
  );
};
