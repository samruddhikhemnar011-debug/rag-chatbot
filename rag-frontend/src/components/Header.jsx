import React, { useState } from 'react';
import { FiMenu, FiLogOut, FiUser, FiSearch, FiFileText, FiZap } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import SearchModal from './SearchModal';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { uploadedDocuments, activeChat } = useChat();
  const [searchOpen, setSearchOpen] = useState(false);

  const activeDocName = activeChat?.pdfName || (uploadedDocuments.length > 0 ? uploadedDocuments[0].name : null);

  return (
    <>
      <header className="h-16 border-b border-gray-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/70 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 transition-colors">
        {/* Left Side: Sidebar Toggle & Active Document Indicator */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-border transition-colors md:hidden"
            title="Toggle Sidebar"
          >
            <FiMenu size={22} />
          </button>
          {!sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-border transition-colors"
              title="Toggle Sidebar"
            >
              <FiMenu size={22} />
            </button>
          )}

          {/* Active Knowledge Context Badge */}
          {activeDocName ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/40 text-xs font-medium text-primary-700 dark:text-primary-300 shadow-sm">
              <FiFileText className="text-red-500 shrink-0" size={14} />
              <span className="truncate max-w-[180px] md:max-w-[240px] font-semibold">{activeDocName}</span>
              <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                Active RAG
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-700 dark:text-amber-300">
              <FiZap size={14} />
              <span>No active PDF selected</span>
            </div>
          )}
        </div>

        {/* Right Side: Global Search, Theme Toggle, User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            <FiSearch size={14} />
            <span>Search...</span>
            <kbd className="text-[10px] font-mono bg-white dark:bg-dark-border px-1 py-0.5 rounded shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-2 pl-2 md:pl-4 border-l border-gray-200 dark:border-dark-border">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-border text-xs font-medium text-gray-700 dark:text-gray-300">
                <FiUser size={14} className="text-primary-500" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
