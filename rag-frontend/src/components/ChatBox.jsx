import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  FiSend, FiLoader, FiFileText, FiLayers, FiUser, FiCpu, 
  FiCopy, FiCheck, FiEdit2, FiTrash2, FiRefreshCw, FiZap, FiInfo 
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import RenameModal from './RenameModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const SUGGESTED_PROMPTS = [
  { icon: '💡', text: 'Summarize the main points of this document.' },
  { icon: '🔍', text: 'What are the key technical concepts explained here?' },
  { icon: '📊', text: 'Extract all important statistics and metrics.' },
  { icon: '⚡', text: 'List the actionable takeaways or recommendations.' }
];

const ChatBox = () => {
  const { 
    messages, isLoading, sendMessage, activeChat, 
    renameChat, deleteChat, clearChat, uploadedDocuments 
  } = useChat();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showSourcesId, setShowSourcesId] = useState(null);
  
  // Modals state
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input.trim();
    setInput('');
    sendMessage(textToSend);
  };

  const handlePromptClick = (promptText) => {
    if (isLoading) return;
    sendMessage(promptText);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-white dark:bg-dark-card overflow-hidden">
      {/* Top Header Bar for Active Chat */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-card/50 backdrop-blur-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
            <FiCpu />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
                {activeChat?.title || 'RAG Assistant Session'}
              </h3>
              {activeChat && (
                <button
                  onClick={() => setIsRenameOpen(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                  title="Rename Session"
                >
                  <FiEdit2 size={13} />
                </button>
              )}
            </div>
            {activeChat?.pdfName && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <FiFileText size={11} className="text-red-500" />
                <span>Knowledge Context: <strong>{activeChat.pdfName}</strong></span>
              </p>
            )}
          </div>
        </div>

        {/* Actions Dropdown / Buttons */}
        {activeChat && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-xs flex items-center gap-1"
              title="Clear Messages"
            >
              <FiRefreshCw size={14} />
              <span className="hidden md:inline">Clear</span>
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs flex items-center gap-1"
              title="Delete Chat Session"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty State: AI Prompt Cards */
          <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-primary-500/20">
              <FiZap />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ask anything about your document!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uploaded PDFs are indexed into vector chunks for real-time RAG context retrieval.
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="p-4 text-left rounded-2xl border border-gray-200 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60 hover:bg-white dark:hover:bg-dark-card hover:border-primary-500/50 hover:shadow-md transition-all group"
                >
                  <span className="text-xl mb-2 block">{prompt.icon}</span>
                  <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">
                    {prompt.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <FiCpu size={18} />
                  </div>
                )}

                <div
                  className={`relative max-w-[90%] md:max-w-[80%] rounded-2xl p-4 md:p-5 shadow-xs ${
                    isUser
                      ? 'bg-primary-600 text-white rounded-br-xs'
                      : msg.isError
                      ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-bl-xs'
                      : 'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-100 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed break-words">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}
                  </div>

                  {/* Metadata & Actions Footer for Bot Messages */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.pdfName && (
                          <span className="inline-flex items-center gap-1 bg-gray-200/70 dark:bg-dark-border px-2 py-0.5 rounded-md font-medium text-[11px]">
                            <FiFileText className="text-red-500" size={12} />
                            {msg.pdfName}
                          </span>
                        )}
                        {msg.chunksRetrieved !== undefined && (
                          <span className="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            <FiLayers size={12} />
                            {msg.chunksRetrieved} chunk{msg.chunksRetrieved === 1 ? '' : 's'} retrieved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 p-1 hover:text-gray-800 dark:hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <FiCheck className="text-emerald-500" size={14} />
                          ) : (
                            <FiCopy size={14} />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="block text-[10px] opacity-60 text-right mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <FiUser size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 text-white flex items-center justify-center shrink-0">
              <FiCpu size={18} />
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl rounded-bl-xs p-4 shadow-sm flex items-center gap-3">
              <FiLoader className="animate-spin text-primary-500 text-lg" />
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Searching vector store & generating answer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 p-3.5 rounded-xl border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm md:text-base transition-all disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              uploadedDocuments.length === 0 
                ? "Upload a PDF document to begin chatting..." 
                : "Type your query about the PDF..."
            }
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/20"
          >
            {isLoading ? (
              <FiLoader className="animate-spin text-lg" />
            ) : (
              <>
                <span className="hidden sm:inline">Send</span>
                <FiSend size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Modals */}
      <RenameModal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        currentName={activeChat?.title}
        title="Rename Chat Session"
        onSave={(newTitle) => {
          if (activeChat) renameChat(activeChat.id, newTitle);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        itemName={activeChat?.title}
        title="Delete Chat Session"
        onConfirm={() => {
          if (activeChat) deleteChat(activeChat.id);
        }}
      />
    </div>
  );
};

export default ChatBox;
