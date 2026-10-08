import React, { useState } from 'react';
import { FiFileText, FiMoreVertical, FiEdit2, FiTrash2, FiClock, FiHardDrive, FiCheckCircle } from 'react-icons/fi';

const PDFCard = ({ doc, onRename, onDelete, onSelectForChat, isSelected }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div 
      className={`glass-card rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg relative flex flex-col justify-between ${
        isSelected 
          ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/20 dark:bg-primary-900/10' 
          : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Top Row: Icon, Name & Dropdown */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/20 dark:from-red-500/20 dark:to-orange-500/30 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0 shadow-sm">
            <FiFileText size={24} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-snug truncate" title={doc.name}>
              {doc.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <FiCheckCircle size={12} />
                {doc.status || 'Indexed'}
              </span>
              {doc.pageCount && (
                <span className="text-xs text-gray-400">
                  {doc.pageCount} pages
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          >
            <FiMoreVertical size={18} />
          </button>

          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl z-20 py-1.5 animate-fade-in text-sm">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(doc);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-left"
                >
                  <FiEdit2 size={14} className="text-primary-500" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(doc);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                >
                  <FiTrash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-dark-border/60 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <FiClock size={13} />
          <span>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recently'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiHardDrive size={13} />
          <span>{doc.size || '1.2 MB'}</span>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;
