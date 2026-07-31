import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMessageSquare, FiSettings, FiPlus, FiFolder } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { clearChat } = useChat();

  return (
    <aside 
      className={`${isOpen ? 'w-64' : 'w-0 -translate-x-full'} 
      md:translate-x-0 md:relative absolute z-20 h-full transition-all duration-300 ease-in-out
      glass-card border-r border-gray-200 dark:border-dark-border flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600 whitespace-nowrap overflow-hidden">
          DocuChat AI
        </h1>
      </div>

      <div className="p-4">
        <button 
          onClick={clearChat}
          className="w-full flex items-center gap-2 btn-primary !py-3 whitespace-nowrap"
        >
          <FiPlus size={18} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 py-2 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
          <nav className="space-y-1">
            <Link 
              to="/chat" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/chat' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
              }`}
            >
              <FiMessageSquare /> Chat
            </Link>
            <Link 
              to="/" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
              }`}
            >
              <FiFolder /> Upload PDF
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <Link 
          to="/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/settings' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
          }`}
        >
          <FiSettings /> Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
