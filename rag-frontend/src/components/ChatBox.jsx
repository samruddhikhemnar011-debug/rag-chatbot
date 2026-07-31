import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { FiSend, FiLoader, FiFileText, FiLayers, FiUser, FiCpu } from 'react-icons/fi';

const ChatBox = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
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

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3">
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500 text-2xl">
              <FiCpu />
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Ask any question about your uploaded PDF!
            </p>
            <p className="text-sm">Type your query below and click Send.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-1">
                    <FiCpu size={18} />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  isUser
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : msg.isError
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-bl-none'
                    : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                    {msg.text}
                  </p>

                  {!isUser && (msg.pdfName || msg.chunksRetrieved !== undefined) && (
                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-dark-border/50 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {msg.pdfName && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-border px-2 py-1 rounded">
                          <FiFileText className="text-primary-500" />
                          {msg.pdfName}
                        </span>
                      )}
                      {msg.chunksRetrieved !== undefined && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-border px-2 py-1 rounded">
                          <FiLayers className="text-primary-500" />
                          {msg.chunksRetrieved} chunk{msg.chunksRetrieved === 1 ? '' : 's'} retrieved
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-1">
                    <FiUser size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <FiCpu size={18} />
            </div>
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
              <FiLoader className="animate-spin text-primary-500 text-lg" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Searching document and generating response...
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
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-dark-border bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm md:text-base transition-all disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
    </div>
  );
};

export default ChatBox;

