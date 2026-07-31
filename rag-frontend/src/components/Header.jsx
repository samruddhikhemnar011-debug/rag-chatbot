import React from 'react';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-colors md:hidden"
        >
          <FiMenu size={24} />
        </button>
        {!sidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="hidden md:block p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-colors"
          >
            <FiMenu size={24} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-dark-border">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-border text-xs font-medium text-gray-700 dark:text-gray-300">
              <FiUser size={14} className="text-indigo-500" />
              <span className="max-w-[140px] truncate">{user.email}</span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
