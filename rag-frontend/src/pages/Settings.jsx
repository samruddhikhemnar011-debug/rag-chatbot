import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

const Settings = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Settings</h2>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-dark-border">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Appearance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between dark and light mode.</p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">API Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage backend connection settings.</p>
          </div>
          <button className="btn-secondary">Configure</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
