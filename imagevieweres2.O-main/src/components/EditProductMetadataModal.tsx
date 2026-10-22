import React, { useState, useEffect } from 'react';
import { X, Check, Edit2, Tag, Layers, FileText, Box } from 'lucide-react';
import { ImageItem } from '../types';

interface EditProductMetadataModalProps {
  item: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveMetadata: (rowIdx: number, newMeta: {
    sku?: string;
    title?: string;
    category?: string;
    material?: string;
    includes?: string;
  }) => void;
}

export const EditProductMetadataModal: React.FC<EditProductMetadataModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveMetadata
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [includes, setIncludes] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCategory(item.category || '');
      setMaterial(item.material || '');
      setIncludes(item.includes || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetadata(item.rowIdx, {
      title: title.trim(),
      category: category.trim(),
      material: material.trim(),
      includes: includes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <Edit2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">Edit Product Information &amp; Attributes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">SKU: <span className="font-semibold text-amber-600 dark:text-amber-400">{item.sku}</span> • Row #{item.rowIdx}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {/* Material */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. 100% Pure Cotton, Stainless Steel 304, Genuine Leather..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Home & Kitchen, Electronics, Apparel..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
          </div>

          {/* Product Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Full Amazon product title..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
          </div>

          {/* Package Includes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-amber-500" />
              Package Includes
            </label>
            <input
              type="text"
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
              placeholder="e.g. 1x Product, 1x Charging Cable, User Manual..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Material &amp; Category to Excel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
