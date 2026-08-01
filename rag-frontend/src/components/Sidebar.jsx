import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSettings, FiPlus, FiFolder, FiSearch, FiLogOut, FiFileText, FiChevronRight } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatHistory from './ChatHistory';
import SearchModal from './SearchModal';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewChat, uploadedDocuments } = useChat();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNewChat = () => {
    createNewChat();
    navigate('/chat');
  };

  return (
    <>
      <aside 
        className={`${isOpen ? 'w-72' : 'w-0 -translate-x-full'} 
        md:translate-x-0 md:relative absolute z-30 h-full transition-all duration-300 ease-in-out
        bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col shadow-lg md:shadow-none`}
      >
        {/* Top Header / App Logo */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-border/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">
                DocuChat AI
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">RAG KNOWLEDGE HUB</p>
            </div>
          </Link>
        </div>

        {/* Action Controls: New Chat & Quick Search */}
        <div className="p-4 space-y-2">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-between btn-primary !py-2.5 px-4 rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20"
          >
            <div className="flex items-center gap-2">
              <FiPlus size={18} />
              <span>New Chat</span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">⌘N</span>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FiSearch size={14} className="text-gray-400" />
              <span>Search chats & PDFs...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-gray-200 dark:bg-dark-border px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Scrollable Center: History & Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {/* Main Navigation Links */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Navigation
            </h3>
            <nav className="space-y-1">
              <Link 
                to="/chat" 
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/chat' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiMessageSquare size={16} /> <span>Chat Studio</span>
                </div>
                {location.pathname === '/chat' && <FiChevronRight size={14} />}
              </Link>
              <Link 
                to="/" 
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiFolder size={16} /> <span>Dashboard & PDFs</span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">
                  {uploadedDocuments.length}
                </span>
              </Link>
            </nav>
          </div>

          {/* Chat History Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-dark-border/60">
            <ChatHistory />
          </div>

          {/* Quick PDF List Summary */}
          {uploadedDocuments.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-dark-border/60">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Knowledge PDFs ({uploadedDocuments.length})
                </h3>
                <Link to="/" className="text-[11px] text-primary-500 hover:underline">
                  Manage
                </Link>
              </div>
              <div className="space-y-1">
                {uploadedDocuments.slice(0, 3).map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border/50 truncate"
                  >
                    <FiFileText size={14} className="text-red-500 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Settings & User Profile / Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-dark-border space-y-1">
          <Link 
            to="/settings" 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/settings' 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            <FiSettings size={15} /> <span>Settings & API Configuration</span>
          </Link>

          {user && (
            <div className="flex items-center justify-between pt-2 px-2 border-t border-gray-100 dark:border-dark-border/40">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {user.email || 'User'}
                </p>
                <p className="text-[10px] text-emerald-500 font-medium">● Connected</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Sidebar;
