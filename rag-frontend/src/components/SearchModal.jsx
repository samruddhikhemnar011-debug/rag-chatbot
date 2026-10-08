import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMessageSquare, FiFileText, FiChevronRight } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const { chats, uploadedDocuments, selectChat } = useChat();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredChats = query.trim()
    ? chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.messages.some(m => m.text.toLowerCase().includes(query.toLowerCase())))
    : chats.slice(0, 5);

  const filteredDocs = query.trim()
    ? uploadedDocuments.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
    : uploadedDocuments.slice(0, 5);

  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    navigate('/chat');
    onClose();
  };

  const handleSelectDoc = () => {
    navigate('/');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-dark-border gap-3">
              <FiSearch className="text-gray-400 text-xl" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats, questions, or PDFs... (Press Esc to close)"
                autoFocus
                className="flex-1 bg-transparent border-none text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-sm md:text-base"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-border"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-gray-100 dark:divide-dark-border/50">
              {/* Chats Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                  Chat Conversations ({filteredChats.length})
                </h4>
                {filteredChats.length === 0 ? (
                  <p className="text-xs text-gray-400 italic pl-1">No chats matching search query.</p>
                ) : (
                  <div className="space-y-1">
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center shrink-0">
                            <FiMessageSquare size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-500 transition-colors">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {chat.messages.length} messages • Updated {new Date(chat.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="pt-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                  Uploaded Documents ({filteredDocs.length})
                </h4>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic pl-1">No PDF documents matching search query.</p>
                ) : (
                  <div className="space-y-1">
                    {filteredDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={handleSelectDoc}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
                            <FiFileText size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-400 transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {doc.size} • {doc.status || 'Indexed'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md">
                          View
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
