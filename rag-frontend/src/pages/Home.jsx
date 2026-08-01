import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import PDFUploader from '../components/PDFUploader';
import PDFList from '../components/PDFList';
import { 
  FiMessageSquare, FiFileText, FiCpu, FiCheckCircle, 
  FiArrowRight, FiZap, FiClock, FiPlus 
} from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const { chats, uploadedDocuments, createNewChat, selectChat } = useChat();

  const totalQueries = chats.reduce((acc, c) => acc + c.messages.filter(m => m.sender === 'user').length, 0);

  const handleStartNewChat = () => {
    createNewChat();
    navigate('/chat');
  };

  const handleJumpChat = (chatId) => {
    selectChat(chatId);
    navigate('/chat');
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 p-8 md:p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <FiZap />
            <span>AI-POWERED RAG WORKSPACE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Chat with Your Knowledge Base in Seconds
          </h1>

          <p className="text-sm md:text-base text-primary-100 font-light leading-relaxed">
            Upload PDF documents, extract intelligent insights, and engage in context-aware conversations powered by state-of-the-art vector retrieval.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={handleStartNewChat}
              className="px-6 py-3 bg-white text-primary-600 hover:bg-gray-100 rounded-xl font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FiPlus size={18} />
              <span>Start New Chat</span>
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-all backdrop-blur-md border border-white/20 flex items-center gap-2"
            >
              <span>Go to Chat Studio</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics & Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Chats Card */}
        <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center text-2xl shrink-0">
            <FiMessageSquare />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Chats</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{chats.length}</h3>
          </div>
        </div>

        {/* Total PDFs Card */}
        <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center text-2xl shrink-0">
            <FiFileText />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Uploaded PDFs</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{uploadedDocuments.length}</h3>
          </div>
        </div>

        {/* Queries Processed Card */}
        <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center text-2xl shrink-0">
            <FiCpu />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Queries Asked</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{totalQueries}</h3>
          </div>
        </div>

        {/* RAG Status Card */}
        <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center text-2xl shrink-0">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">System Status</p>
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">Ready for RAG</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: PDF Upload & Management + Recent Chats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PDF Upload & PDF List (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* PDF Uploader Card */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload New Document</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDFs uploaded here are parsed and made searchable.</p>
              </div>
            </div>

            <PDFUploader />
          </div>

          {/* PDF List Section */}
          <PDFList />
        </div>

        {/* Recent Chats Column (1 Column) */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiMessageSquare className="text-primary-500" />
                Recent Conversations
              </h3>
              <button 
                onClick={handleStartNewChat} 
                className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                + New Chat
              </button>
            </div>

            {chats.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No recent chats available.</p>
            ) : (
              <div className="space-y-3">
                {chats.slice(0, 5).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleJumpChat(chat.id)}
                    className="p-3 rounded-xl border border-gray-100 dark:border-dark-border/60 bg-gray-50/50 dark:bg-dark-bg/50 hover:bg-gray-100 dark:hover:bg-dark-border transition-all cursor-pointer group"
                  >
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-500 transition-colors truncate">
                      {chat.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                      <span>{chat.messages.length} messages</span>
                      <span className="flex items-center gap-1">
                        <FiClock size={11} />
                        {new Date(chat.updatedAt || chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
