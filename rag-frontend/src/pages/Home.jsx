import React from 'react';
import { useNavigate } from 'react-router-dom';
import PDFUploader from '../components/PDFUploader';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600">
          AI RAG DOCUMENT CHATBOT
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light">
          Upload PDFs and Chat with Your Documents using AI.
        </p>
      </div>

      {/* PDF Upload Card */}
      <div className="w-full max-w-2xl glass-card rounded-2xl p-6 md:p-10 animate-slide-up">
        <PDFUploader />
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border flex justify-center">
          <button 
            onClick={() => navigate('/chat')}
            className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-3 w-full md:w-auto"
          >
            Go to Chat
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
        <div className="glass-card p-6 rounded-xl text-center">
          <div className="text-primary-500 text-3xl mb-4 flex justify-center">🚀</div>
          <h3 className="text-lg font-semibold mb-2">Fast Retrieval</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lightning fast document embeddings and semantic search.</p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <div className="text-primary-500 text-3xl mb-4 flex justify-center">📚</div>
          <h3 className="text-lg font-semibold mb-2">Context Aware</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent responses based directly on your uploaded knowledge.</p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <div className="text-primary-500 text-3xl mb-4 flex justify-center">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Source Tracking</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Every response includes chunks of exactly where the data came from.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
