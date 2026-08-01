import React, { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { useChat } from '../context/ChatContext';
import { FiSliders, FiTrash2, FiCheckCircle, FiShield, FiServer, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const { chats, uploadedDocuments } = useChat();
  const [chunkSize, setChunkSize] = useState(1000);
  const [temperature, setTemperature] = useState(0.7);

  const handleClearCache = () => {
    try {
      localStorage.removeItem('rag_chats');
      localStorage.removeItem('rag_uploaded_docs');
      toast.success('Local cache cleared! Refresh page to reload defaults.');
    } catch {
      toast.error('Failed to clear cache.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <FiSliders className="text-primary-500" />
          Settings & Configuration
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Customize your appearance, RAG parameters, and manage local storage.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center">
                <FiMoon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">Appearance Mode</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between dark and light themes.</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* RAG & Model Configuration */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-dark-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
              <FiServer size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">RAG Vector Parameters</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Future backend embedding & model hyperparameter controls.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Chunk Size ({chunkSize} characters)
              </label>
              <input
                type="range"
                min="250"
                max="2000"
                step="50"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">Controls character chunking size when embedding PDFs.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">0 = Precise / Factual, 1 = Creative responses.</p>
            </div>
          </div>
        </div>

        {/* Backend System Status */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
                <FiShield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">API & Endpoint Connection</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Target URL: <code>http://localhost:8000/api/v1</code></p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <FiCheckCircle size={14} /> Connected
            </span>
          </div>
        </div>

        {/* Cache & Data Management */}
        <div className="glass-card rounded-2xl p-6 border border-red-200/60 dark:border-red-950/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-red-600 dark:text-red-400">Clear Local Application Cache</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Resets stored local chat sessions ({chats.length}) and document entries ({uploadedDocuments.length}).
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95"
            >
              <FiTrash2 size={14} /> Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
