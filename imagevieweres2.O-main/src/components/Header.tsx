import React, { useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Save,
  Zap,
  Sparkles,
  Star,
  CheckCircle2,
  Loader2,
  Trash2,
  HardDrive,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Sun,
  Moon,
  LocateFixed,
  Cloud,
  Menu,
  X
} from 'lucide-react';
import { AppStats, FilterStatus, ImageItem } from '../types';

interface HeaderProps {
  stats: AppStats;
  isLoading: boolean;
  loadingMessage: string;
  saveMessage: string;
  sessionSavedTime?: string;
  isHeaderVisible: boolean;
  isNavbarVisible: boolean;
  isAutoHide: boolean;
  isCompact: boolean;
  isDarkMode: boolean;
  showDemoButtons?: boolean;
  filterStatus?: FilterStatus;
  lastCheckedItem?: ImageItem | null;
  rowHandlePosition?: 'left' | 'right';
  hasImgbbKey?: boolean;
  onOpenImgbbSettings?: () => void;
  onToggleRowHandlePosition?: () => void;
  onFilterStatusChange?: (status: FilterStatus) => void;
  onToggleTheme: () => void;
  onToggleHeader: () => void;
  onToggleNavbar: () => void;
  onToggleAutoHide: () => void;
  onToggleCompact: () => void;
  onToggleFullFocus: () => void;
  onFileUpload: (file: File) => void;
  onLoadDemo: (rowCount: number) => void;
  onSaveChanges: () => void;
  onManualSaveSession: () => void;
  onDownloadExcel: () => void;
  onClearMarks: () => void;
  onClearHighlights: () => void;
  onGoToLastChecked?: () => void;
  onClearLastChecked?: () => void;
  onBulkHighlightFiltered?: () => void;
  onBulkDeleteFiltered?: () => void;
  filteredCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  isLoading,
  loadingMessage,
  saveMessage,
  sessionSavedTime,
  isHeaderVisible,
  isNavbarVisible,
  isAutoHide,
  isCompact,
  isDarkMode,
  showDemoButtons = false,
  filterStatus,
  lastCheckedItem,
  rowHandlePosition = 'right',
  hasImgbbKey = false,
  onOpenImgbbSettings,
  onToggleRowHandlePosition,
  onFilterStatusChange,
  onToggleTheme,
  onToggleHeader,
  onToggleNavbar,
  onToggleAutoHide,
  onToggleCompact,
  onToggleFullFocus,
  onFileUpload,
  onLoadDemo,
  onSaveChanges,
  onManualSaveSession,
  onDownloadExcel,
  onClearMarks,
  onClearHighlights,
  onGoToLastChecked,
  onClearLastChecked,
  onBulkHighlightFiltered,
  onBulkDeleteFiltered,
  filteredCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  // If header is manually or auto hidden, render minimal floating toolbar pill at the top
  if (!isHeaderVisible) {
    return (
      <div className="w-full flex items-center justify-between px-2.5 sm:px-4 py-1.5 bg-white/95 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 shadow-sm gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow-xs">amazon</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs hidden sm:inline">5 Lac AKU Gallery</span>
          {sessionSavedTime && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              <span className="hidden xs:inline">Auto-Saved</span>
            </span>
          )}
        </div>

        {/* Floating Unhide / Control Buttons (Scrollable on small devices) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5 shrink min-w-0">
          {/* Quick Go to Last Checked button when header is collapsed */}
          {lastCheckedItem && onGoToLastChecked && (
            <button
              onClick={onGoToLastChecked}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-md border border-amber-300 cursor-pointer"
              title={`Go to last checked listing: SKU ${lastCheckedItem.sku} (Row #${lastCheckedItem.rowIdx})`}
            >
              <LocateFixed className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span>Last Checked (#{lastCheckedItem.rowIdx})</span>
            </button>
          )}

          {/* Theme Shift Button */}
          <button
            onClick={onToggleTheme}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-amber-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1 border border-amber-300 dark:border-amber-500/30 shadow-xs"
            title="Shift Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            <span className="hidden xs:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={onToggleHeader}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-md"
            title="Expand Header"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Show Header</span>
          </button>

          <button
            onClick={onToggleNavbar}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 border ${
              isNavbarVisible
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isNavbarVisible ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <button
            onClick={onToggleAutoHide}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 border ${
              isAutoHide
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Auto-hide header on gallery scroll"
          >
            <Zap className="w-3 h-3 text-amber-400 dark:text-amber-300" />
            <span>Auto-Hide: {isAutoHide ? 'ON' : 'OFF'}</span>
          </button>

          {onToggleRowHandlePosition && (
            <button
              onClick={onToggleRowHandlePosition}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:white"
              title="Toggle Row Controls Position (Right / Left)"
            >
              <span>Controls: {rowHandlePosition === 'right' ? 'Right ➡️' : 'Left ⬅️'}</span>
            </button>
          )}

          {onOpenImgbbSettings && (
            <button
              onClick={onOpenImgbbSettings}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                hasImgbbKey
                  ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-blue-600'
              }`}
              title="ImgBB Public Link Generator Settings (api.imgbb.com/1/upload)"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-500" />
              <span>ImgBB: {hasImgbbKey ? 'Active 🟢' : 'Set Key ⚡'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 sticky top-0 z-40 shadow-md dark:shadow-xl backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-none space-y-2">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv"
          className="hidden"
        />

        {/* Mobile Header Bar (Screen width < 768px) */}
        <div className="flex md:hidden items-center justify-between gap-2 py-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md tracking-wider shadow-xs shrink-0">
              amazon
            </span>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                Amazon Image Viewer
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {stats.totalRows.toLocaleString()} SKUs · {stats.frontendCount.toLocaleString()} Imgs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Open File */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              title="Open Excel Spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Quick Save Changes */}
            <button
              onClick={onSaveChanges}
              disabled={isLoading || stats.totalRows === 0}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                stats.markedDeleteCount > 0
                  ? 'bg-amber-400 text-slate-950 border border-amber-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
              title="Save Changes to Excel"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save{stats.markedDeleteCount > 0 ? ` (${stats.markedDeleteCount})` : ''}</span>
            </button>

            {/* Theme Shift */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-300 transition-all cursor-pointer"
              title="Shift Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Mobile Menu Drawer Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all"
              title="Open Actions & Settings Menu"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden xs:inline">Menu</span>
              {(stats.markedDeleteCount > 0 || stats.highlightedRowsCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop View Header (Hidden on Mobile < 768px) */}
        <div className="hidden md:block space-y-2">
          {/* Top Branding Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg tracking-wider shadow-sm flex items-center gap-1">
                <span>amazon</span>
              </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Amazon Image Viewer – Bulk Product Gallery
                <span className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 5 Lac AKU Engine
                </span>
              </h1>
              {!isCompact && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                  Bulk Excel Amazon Product Gallery • Link Editor • IndexedDB Auto-Save
                </p>
              )}
            </div>
          </div>

          {/* Stats Badges & Session Auto-Save Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {sessionSavedTime && (
              <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs text-[11px] font-semibold whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Auto-Saved ({sessionSavedTime})</span>
              </div>
            )}

            <button
              onClick={() => onFilterStatusChange?.('frontend')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 whitespace-nowrap ${
                filterStatus === 'frontend'
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
              title="Filter gallery to Frontend Main Images only"
            >
              Frontend (Main): <span className="font-bold text-amber-700 dark:text-amber-400">{stats.frontendCount.toLocaleString()}</span>
            </button>

            <button
              onClick={() => onFilterStatusChange?.('deleted')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 whitespace-nowrap ${
                filterStatus === 'deleted'
                  ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
              title="Filter gallery to Marked Delete Images"
            >
              Deletes: <span className="font-bold text-rose-600 dark:text-rose-400">{stats.markedDeleteCount}</span>
            </button>

            <button
              onClick={() => onFilterStatusChange?.('highlighted')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 whitespace-nowrap ${
                filterStatus === 'highlighted'
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
              title="Filter gallery to Highlighted Rows"
            >
              Highlights: <span className="font-bold text-amber-700 dark:text-amber-400">{stats.highlightedRowsCount}</span>
            </button>

            {stats.editedLinksCount > 0 && (
              <button
                onClick={() => onFilterStatusChange?.('edited')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 whitespace-nowrap ${
                  filterStatus === 'edited'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-cyan-600 dark:text-cyan-400 border-slate-200 dark:border-slate-800'
                }`}
                title="Filter gallery to Edited Links & Metadata"
              >
                Edits: <span className="font-bold">{stats.editedLinksCount}</span>
              </button>
            )}
          </div>

          {/* View Mode, Theme & Layout Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            
            {/* Unique Theme Shift Button */}
            <button
              onClick={onToggleTheme}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                isDarkMode
                  ? 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-50 shadow-sm'
              }`}
              title="Shift UI Theme (Light Mode / Dark Mode)"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline">Dark Theme</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleFullFocus}
              className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 font-semibold rounded-lg transition-all flex items-center gap-1 border border-amber-500/20"
              title="Full Screen Grid Focus (Hides Header & Navbar)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Full Grid Focus</span>
            </button>

            <button
              onClick={onToggleNavbar}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 border ${
                isNavbarVisible
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Toggle Search and Filter Toolbar"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:inline">{isNavbarVisible ? 'Hide Filters' : 'Show Filters'}</span>
            </button>

            <button
              onClick={onToggleAutoHide}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 border ${
                isAutoHide
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Automatically hide header when scrolling down"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 dark:text-amber-300" />
              <span className="hidden sm:inline">Auto-Hide: {isAutoHide ? 'ON' : 'OFF'}</span>
            </button>

            {onToggleRowHandlePosition && (
              <button
                onClick={onToggleRowHandlePosition}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 border ${
                  rowHandlePosition === 'right'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Switch whole-row selection controls position (Right / Left)"
              >
                <span>Row Controls: {rowHandlePosition === 'right' ? 'Right ➡️' : 'Left ⬅️'}</span>
              </button>
            )}

            {onOpenImgbbSettings && (
              <button
                onClick={onOpenImgbbSettings}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 border ${
                  hasImgbbKey
                    ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-500/30 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-300'
                }`}
                title="ImgBB Public Link Generator Settings (api.imgbb.com/1/upload)"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">ImgBB Link:</span>
                <span>{hasImgbbKey ? 'Active 🟢' : 'Set Key ⚡'}</span>
              </button>
            )}

            <button
              onClick={onToggleCompact}
              className={`px-2 py-1 rounded-lg font-medium transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 ${
                isCompact ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' : ''
              }`}
              title="Toggle Compact Mode"
            >
              {isCompact ? <Minimize2 className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onToggleHeader}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Minimize Header"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Open File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Open Excel
            </button>

            {/* Go to Last Checked Button */}
            {lastCheckedItem && onGoToLastChecked && (
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden">
                <button
                  onClick={onGoToLastChecked}
                  className="px-3 py-1.5 text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title={`Go to last checked listing: SKU ${lastCheckedItem.sku} (Row #${lastCheckedItem.rowIdx})`}
                >
                  <LocateFixed className="w-3.5 h-3.5 text-amber-500" />
                  <span>Last Checked</span>
                  <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    #{lastCheckedItem.rowIdx}
                  </span>
                </button>
                {onClearLastChecked && (
                  <button
                    type="button"
                    onClick={onClearLastChecked}
                    className="px-2 py-2 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 border-l border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Clear Last Checked checkpoint"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Save Session Button */}
            <button
              onClick={onManualSaveSession}
              disabled={isLoading || stats.totalRows === 0}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md border border-indigo-400/30"
              title="Persist complete session, images, material & category edits"
            >
              <HardDrive className="w-4 h-4" />
              Save Session
            </button>

            {/* Quick Demo Dataset Trigger (Off by default for live deployment) */}
            {(showDemoButtons || (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SHOW_DEMO === 'true') && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <span className="px-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase hidden sm:inline">Load Demo:</span>
                <button
                  onClick={() => onLoadDemo(2000)}
                  disabled={isLoading}
                  className="px-2.5 py-1 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors font-medium text-[11px]"
                >
                  2k
                </button>
                <button
                  onClick={() => onLoadDemo(10000)}
                  disabled={isLoading}
                  className="px-2.5 py-1 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors font-medium text-[11px]"
                >
                  10k
                </button>
                <button
                  onClick={() => onLoadDemo(50000)}
                  disabled={isLoading}
                  className="px-2.5 py-1 hover:bg-white dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold rounded-lg transition-colors text-[11px] flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3" /> 50k
                </button>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              onClick={onSaveChanges}
              disabled={isLoading || stats.totalRows === 0}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes {stats.markedDeleteCount > 0 ? `(${stats.markedDeleteCount})` : ''}
            </button>

            <button
              onClick={onDownloadExcel}
              disabled={isLoading || stats.totalRows === 0}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Excel (Highlighted)
            </button>

            {onBulkHighlightFiltered && (
              <button
                onClick={onBulkHighlightFiltered}
                disabled={isLoading || !filteredCount || filteredCount === 0}
                className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-400/40 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-40"
                title="Toggle highlight for all visible filtered rows in Excel"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Bulk Highlight {filteredCount ? `(${filteredCount})` : ''}</span>
              </button>
            )}

            {onBulkDeleteFiltered && (
              <button
                onClick={onBulkDeleteFiltered}
                disabled={isLoading || !filteredCount || filteredCount === 0}
                className="px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-400/40 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-40"
                title="Toggle mark for deletion on all visible filtered items"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Bulk Mark {filteredCount ? `(${filteredCount})` : ''}</span>
              </button>
            )}

            <button
              onClick={onClearMarks}
              disabled={isLoading || stats.markedDeleteCount === 0}
              className="px-2.5 py-1.5 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Marks
            </button>

            <button
              onClick={onClearHighlights}
              disabled={isLoading || stats.highlightedRowsCount === 0}
              className="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5" />
              Clear Stars
            </button>

          </div>

        </div>
        </div> {/* Closes hidden md:block desktop container */}

        {/* Responsive Mobile Drawer / Action Sheet (Opens when tapping Menu on mobile) */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-[10050] bg-black/80 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-full max-w-sm sm:max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded shadow-xs">amazon</span>
                  <span className="font-bold text-sm">QuickSKU Controls</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {/* 1. Status & Filters Section */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Gallery Filters &amp; Metrics
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { onFilterStatusChange?.('frontend'); setIsMobileMenuOpen(false); }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        filterStatus === 'frontend'
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Frontend (Main)</div>
                      <div className="text-base font-extrabold">{stats.frontendCount.toLocaleString()}</div>
                    </button>

                    <button
                      onClick={() => { onFilterStatusChange?.('deleted'); setIsMobileMenuOpen(false); }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        filterStatus === 'deleted'
                          ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">Marked Delete</div>
                      <div className="text-base font-extrabold">{stats.markedDeleteCount}</div>
                    </button>

                    <button
                      onClick={() => { onFilterStatusChange?.('highlighted'); setIsMobileMenuOpen(false); }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        filterStatus === 'highlighted'
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">Highlighted Rows</div>
                      <div className="text-base font-extrabold">{stats.highlightedRowsCount}</div>
                    </button>

                    <button
                      onClick={() => { onFilterStatusChange?.('edited'); setIsMobileMenuOpen(false); }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        filterStatus === 'edited'
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-cyan-600 dark:text-cyan-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">Edited Links</div>
                      <div className="text-base font-extrabold">{stats.editedLinksCount}</div>
                    </button>
                  </div>
                  {sessionSavedTime && (
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Auto-Saved ({sessionSavedTime})</span>
                    </div>
                  )}
                </div>

                {/* 2. Primary File Operations */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    File &amp; Export
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => { fileInputRef.current?.click(); setIsMobileMenuOpen(false); }}
                      className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        Open Excel Spreadsheet
                      </span>
                      <span className="text-[10px] text-slate-400">.xlsx, .xls</span>
                    </button>

                    <button
                      onClick={() => { onSaveChanges(); setIsMobileMenuOpen(false); }}
                      disabled={isLoading || stats.totalRows === 0}
                      className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold flex items-center justify-between shadow-md disabled:opacity-40"
                    >
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes to Excel
                      </span>
                      {stats.markedDeleteCount > 0 && (
                        <span className="bg-slate-950 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {stats.markedDeleteCount} Deletes
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { onDownloadExcel(); setIsMobileMenuOpen(false); }}
                      disabled={isLoading || stats.totalRows === 0}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-between shadow-md disabled:opacity-40"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Excel (Highlighted)
                      </span>
                    </button>

                    <button
                      onClick={() => { onManualSaveSession(); setIsMobileMenuOpen(false); }}
                      disabled={isLoading || stats.totalRows === 0}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm disabled:opacity-40"
                    >
                      <HardDrive className="w-4 h-4" />
                      Save Session (IndexedDB)
                    </button>

                    {lastCheckedItem && onGoToLastChecked && (
                      <div className="flex items-center w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden shadow-xs">
                        <button
                          onClick={() => { onGoToLastChecked(); setIsMobileMenuOpen(false); }}
                          className="flex-1 py-2 px-3 text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <LocateFixed className="w-4 h-4 text-amber-500" />
                            Jump to Last Checked SKU
                          </span>
                          <span className="font-mono bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            #{lastCheckedItem.rowIdx}
                          </span>
                        </button>
                        {onClearLastChecked && (
                          <button
                            onClick={() => { onClearLastChecked(); setIsMobileMenuOpen(false); }}
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 border-l border-slate-300 dark:border-slate-700 transition-colors"
                            title="Clear Last Checked checkpoint"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Bulk & Batch Controls */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Bulk Actions
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {onBulkHighlightFiltered && (
                      <button
                        onClick={() => { onBulkHighlightFiltered(); setIsMobileMenuOpen(false); }}
                        disabled={isLoading || !filteredCount || filteredCount === 0}
                        className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Bulk Star {filteredCount ? `(${filteredCount})` : ''}</span>
                      </button>
                    )}

                    {onBulkDeleteFiltered && (
                      <button
                        onClick={() => { onBulkDeleteFiltered(); setIsMobileMenuOpen(false); }}
                        disabled={isLoading || !filteredCount || filteredCount === 0}
                        className="p-2 rounded-xl bg-rose-500/15 border border-rose-400/40 text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Bulk Delete {filteredCount ? `(${filteredCount})` : ''}</span>
                      </button>
                    )}

                    <button
                      onClick={() => { onClearMarks(); setIsMobileMenuOpen(false); }}
                      disabled={isLoading || stats.markedDeleteCount === 0}
                      className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 font-semibold flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Marks</span>
                    </button>

                    <button
                      onClick={() => { onClearHighlights(); setIsMobileMenuOpen(false); }}
                      disabled={isLoading || stats.highlightedRowsCount === 0}
                      className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 font-semibold flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Clear Stars</span>
                    </button>
                  </div>
                </div>

                {/* 4. Settings & View Preferences */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    View &amp; Cloud Settings
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => { onToggleNavbar(); setIsMobileMenuOpen(false); }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                        Search &amp; Filter Toolbar
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                        {isNavbarVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>

                    <button
                      onClick={() => { onToggleAutoHide(); }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Auto-Hide Header on Scroll
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isAutoHide ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        {isAutoHide ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {onToggleRowHandlePosition && (
                      <button
                        onClick={() => { onToggleRowHandlePosition(); }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold"
                      >
                        <span>Whole-Row Controls Position</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                          {rowHandlePosition === 'right' ? 'Right ➡️' : 'Left ⬅️'}
                        </span>
                      </button>
                    )}

                    {onOpenImgbbSettings && (
                      <button
                        onClick={() => { onOpenImgbbSettings(); setIsMobileMenuOpen(false); }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-blue-500" />
                          ImgBB API Key &amp; Permanent Links
                        </span>
                        <span className="text-[10px] font-mono">
                          {hasImgbbKey ? 'Active 🟢' : 'Set Key ⚡'}
                        </span>
                      </button>
                    )}

                    {/* Quick Demo Dataset Trigger in Drawer */}
                    {showDemoButtons && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1.5">Load Demo Dataset:</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => { onLoadDemo(2000); setIsMobileMenuOpen(false); }}
                            className="py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-bold text-xs"
                          >
                            2k
                          </button>
                          <button
                            onClick={() => { onLoadDemo(10000); setIsMobileMenuOpen(false); }}
                            className="py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-bold text-xs"
                          >
                            10k
                          </button>
                          <button
                            onClick={() => { onLoadDemo(50000); setIsMobileMenuOpen(false); }}
                            className="py-1.5 bg-amber-400 text-slate-950 rounded-lg text-center font-bold text-xs"
                          >
                            50k ✨
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Status Feedback Notification */}
        {(isLoading || saveMessage) && (
          <div className="flex items-center justify-between gap-3 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {isLoading && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingMessage || 'Processing dataset...'}</span>
              </div>
            )}
            {saveMessage && !isLoading && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};



