import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this item',
  title = 'Delete Confirmation'
}) => {
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
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-lg">
                <FiAlertTriangle size={20} />
                <span>{title}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{itemName}"</span>? This action cannot be undone.
              </p>
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
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95"
              >
                <FiTrash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
