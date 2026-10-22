import React from 'react';
import { Search, Filter, Star, Trash2, Edit3, AlertTriangle, X, Layers, LocateFixed } from 'lucide-react';
import { FilterStatus, ImageItem } from '../types';

interface SearchBarProps {
  searchQuery: string;
  filterStatus: FilterStatus;
  filteredCount: number;
  totalCount: number;
  lastCheckedItem?: ImageItem | null;
  onSearchChange: (query: string) => void;
  onFilterStatusChange: (status: FilterStatus) => void;
  onGoToLastChecked?: () => void;
  onClearLastChecked?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  filterStatus,
  filteredCount,
  totalCount,
  lastCheckedItem,
  onSearchChange,
  onFilterStatusChange,
  onGoToLastChecked,
  onClearLastChecked,
}) => {
  return (
    <nav
      aria-label="Product Search and Filter Navigation"
      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-md dark:shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 transition-colors"
    >
      <h2 className="sr-only">Product Search and Status Filters</h2>
      
      {/* Search Field & Go to Last Checked Button */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-80 lg:w-96 xl:w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by SKU, Title, or Link..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-8 py-2 font-mono transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Jump to Last Checked Listing button with Clear action */}
        {lastCheckedItem && onGoToLastChecked && (
          <div className="flex items-center shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden">
            <button
              onClick={onGoToLastChecked}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              title={`Jump to last checked listing: SKU ${lastCheckedItem.sku} (Row #${lastCheckedItem.rowIdx})`}
            >
              <LocateFixed className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">Last Checked</span>
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                #{lastCheckedItem.rowIdx}
              </span>
            </button>
            {onClearLastChecked && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearLastChecked();
                }}
                className="px-1.5 py-2 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 border-l border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Dismiss / Clear Last Checked checkpoint"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Filter:
        </span>

        <button
          onClick={() => onFilterStatusChange('frontend')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1 ${
            filterStatus === 'frontend'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          Frontend (Main)
        </button>

        <button
          onClick={() => onFilterStatusChange('highlighted')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1 ${
            filterStatus === 'highlighted'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Star className="w-3 h-3 fill-amber-400" />
          Highlighted
        </button>

        <button
          onClick={() => onFilterStatusChange('deleted')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1 ${
            filterStatus === 'deleted'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md font-bold'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Trash2 className="w-3 h-3" />
          Marked Delete
        </button>

        <button
          onClick={() => onFilterStatusChange('edited')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1 ${
            filterStatus === 'edited'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-cyan-600 dark:text-cyan-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Edit3 className="w-3 h-3" />
          Edited Links
        </button>

        <button
          onClick={() => onFilterStatusChange('broken')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1 ${
            filterStatus === 'broken'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          Local/Broken
        </button>
      </div>

      {/* Filtered count badge */}
      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0 hidden lg:block">
        Showing <span className="font-bold text-amber-600 dark:text-amber-400">{filteredCount.toLocaleString()}</span> of {totalCount.toLocaleString()}
      </div>

    </nav>
  );
};
