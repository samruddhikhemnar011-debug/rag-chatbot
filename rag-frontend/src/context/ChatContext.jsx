import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State for chat history
  const [messages, setMessages] = useState([]);
  
  // State for tracking loading status during AI generation
  const [isLoading, setIsLoading] = useState(false);
  
  // State for tracking uploaded documents (future multi-PDF support)
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  
  // Future Authentication Support
  const [user, setUser] = useState(null);

  // Add a new message to the chat
  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, {
      ...message,
      id: message.id || Date.now().toString(),
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // Update a specific message (e.g., streaming responses or adding sources)
  const updateMessage = useCallback((id, updates) => {
    setMessages((prev) => 
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Add an uploaded document
  const addDocument = useCallback((doc) => {
    setUploadedDocuments((prev) => [...prev, {
      ...doc,
      id: doc.id || Date.now().toString(),
      uploadedAt: new Date().toISOString()
    }]);
  }, []);

  // Remove an uploaded document
  const removeDocument = useCallback((id) => {
    setUploadedDocuments((prev) => prev.filter(doc => doc.id !== id));
  }, []);

  // Send message to the backend POST /api/v1/chat/
  const sendMessage = useCallback(async (questionText) => {
    if (!questionText || !questionText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(questionText.trim());

      if (data.success) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.answer,
          pdfName: data.pdf_name,
          chunksRetrieved: data.chunks_retrieved,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botErrorMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.message || 'Unable to get answer from PDF.',
          isError: true,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botErrorMessage]);
        toast.error(data.message || 'Error processing question');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to send message';

      const botErrorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Error: ${errorMsg}`,
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botErrorMessage]);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        setIsLoading,
        uploadedDocuments,
        user,
        setUser,
        addMessage,
        updateMessage,
        clearChat,
        addDocument,
        removeDocument,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

