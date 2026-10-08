import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi';

const RenameModal = ({ isOpen, onClose, currentName, onSave, title = 'Rename Item' }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(currentName || '');
  }, [currentName, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold text-lg">
                <FiEdit2 className="text-primary-500" />
                <span>{title}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new name..."
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FiCheck size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RenameModal;
